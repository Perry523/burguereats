import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  try {
    const auth = requireAuth(event);
    if (auth.role !== "admin") {
      throw createError({ statusCode: 403, statusMessage: "Admin only" });
    }

    const body = await readBody(event);
    const { biker_id } = body;
    if (!biker_id) throw createError({ statusCode: 400, statusMessage: "Missing biker_id" });

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseKey) throw new Error("Missing Supabase configuration");
    const supabase = createClient(supabaseUrl, supabaseKey);

    // 1. Fetch current biker stats
    const { data: biker, error: bikerErr } = await supabase
      .from("Entregadores")
      .select("id, wallet, advance_money")
      .eq("id", biker_id)
      .single();

    if (bikerErr || !biker) throw createError({ statusCode: 404, statusMessage: "Biker not found" });

    // 2. Fetch unpaid total_deliveries
    const { data: payments, error: payErr } = await supabase
      .from("biker_payments")
      .select("id, total_deliveries")
      .eq("biker_id", biker_id)
      .eq("is_paid", false);

    if (payErr) throw payErr;

    let unpaidDeliveries = 0;
    const unpaidIds: string[] = [];
    for (const p of (payments || [])) {
      unpaidDeliveries += Number(p.total_deliveries) || 0;
      unpaidIds.push(p.id);
    }

    // Calculations
    const walletTotal = Number(biker.wallet) || 0;
    const advanceMoney = Number(biker.advance_money) || 0;
    const deliveryFee = unpaidDeliveries * 1; // R$ 1.00 per delivery
    const netPaid = walletTotal - advanceMoney - deliveryFee;

    // 3. Create the payout receipt
    const { data: payout, error: insertErr } = await supabase
      .from("biker_payouts")
      .insert([{
        biker_id,
        amount_paid: netPaid,
        discounts: advanceMoney,
        delivery_fee_total: deliveryFee,
        type: 'settlement'
      }])
      .select()
      .single();

    if (insertErr) {
        console.error("Error inserting to biker_payouts:", insertErr);
        throw createError({ statusCode: 500, statusMessage: "Erro ao gerar recibo de pagamento" });
    }

    // 4. Reset biker wallet and advance_money
    const { error: resetErr } = await supabase
      .from("Entregadores")
      .update({ wallet: 0, advance_money: 0 })
      .eq("id", biker_id);

    if (resetErr) throw resetErr;

    // 5. Mark daily payments as paid so delivery fee isn't charged again
    if (unpaidIds.length > 0) {
      const { error: markErr } = await supabase
        .from("biker_payments")
        .update({ is_paid: true })
        .in("id", unpaidIds);
        
      if (markErr) console.error("Could not mark payments as paid", markErr);
    }

    return { success: true, payout };

  } catch (error: any) {
    if (error.statusCode) throw error;
    console.error("Error creating payout:", error);
    throw createError({ statusCode: 500, statusMessage: "Failed to create payout" });
  }
});
