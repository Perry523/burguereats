import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  try {
    const auth = requireAuth(event);
    if (auth.role !== "admin") {
      throw createError({ statusCode: 403, statusMessage: "Admin only" });
    }

    const body = await readBody(event);
    const { biker_id, dateFrom, dateTo } = body;
    if (!biker_id) throw createError({ statusCode: 400, statusMessage: "Missing biker_id" });
    if (!dateFrom || !dateTo) throw createError({ statusCode: 400, statusMessage: "Missing dateFrom/dateTo" });

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

    // 2. Fetch unpaid payments ONLY for the specified week
    const { data: payments, error: payErr } = await supabase
      .from("biker_payments")
      .select("id, amount, total_deliveries")
      .eq("biker_id", biker_id)
      .eq("is_paid", false)
      .gte("date", dateFrom)
      .lte("date", dateTo);

    if (payErr) throw payErr;

    let weekWallet = 0;
    let weekDeliveries = 0;
    const unpaidIds: string[] = [];
    for (const p of (payments || [])) {
      weekWallet += Number(p.amount) || 0;
      weekDeliveries += Number(p.total_deliveries) || 0;
      unpaidIds.push(p.id);
    }

    if (unpaidIds.length === 0) {
      throw createError({ statusCode: 400, statusMessage: "Nenhum registro pendente nesta semana" });
    }

    // Calculations scoped to this week
    const advanceMoney = Number(biker.advance_money) || 0;
    const deliveryFee = weekDeliveries * 1; // R$ 1.00 per delivery
    const netPaid = weekWallet - advanceMoney - deliveryFee;

    // 3. Create the payout receipt
    const { data: payout, error: insertErr } = await supabase
      .from("biker_payouts")
      .insert([{
        biker_id,
        amount_paid: netPaid,
        discounts: advanceMoney,
        delivery_fee_total: deliveryFee,
        type: 'settlement',
        week_from: dateFrom,
        week_to: dateTo,
      }])
      .select()
      .single();

    if (insertErr) {
      console.error("Error inserting to biker_payouts:", insertErr);
      throw createError({ statusCode: 500, statusMessage: "Erro ao gerar recibo de pagamento" });
    }

    // 4. Subtract the week's wallet from the biker's global wallet, and reset advance_money
    const currentWallet = Number(biker.wallet) || 0;
    const newWallet = Math.max(0, currentWallet - weekWallet);
    const { error: resetErr } = await supabase
      .from("Entregadores")
      .update({ wallet: newWallet, advance_money: 0 })
      .eq("id", biker_id);

    if (resetErr) throw resetErr;

    // 5. Mark ONLY this week's payments as paid
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
