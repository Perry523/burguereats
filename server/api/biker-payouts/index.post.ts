import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  try {
    const auth = requireAuth(event);
    if (auth.role !== "admin") {
      throw createError({ statusCode: 403, statusMessage: "Admin only" });
    }

    const body = await readBody(event);
    const { biker_id, dateFrom, dateTo, paymentDate } = body;
    if (!biker_id) throw createError({ statusCode: 400, statusMessage: "Missing biker_id" });
    if (!dateFrom || !dateTo) throw createError({ statusCode: 400, statusMessage: "Missing dateFrom/dateTo" });

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseKey) throw new Error("Missing Supabase configuration");
    const supabase = createClient(supabaseUrl, supabaseKey);

    // 1. Verify biker exists
    const { data: biker, error: bikerErr } = await supabase
      .from("Entregadores")
      .select("id, wallet")
      .eq("id", biker_id)
      .single();

    if (bikerErr || !biker) throw createError({ statusCode: 404, statusMessage: "Biker not found" });

    // 2. Fetch ALL unpaid biker_payments for the week (normal records + advances)
    const { data: payments, error: payErr } = await supabase
      .from("biker_payments")
      .select("id, amount, total_deliveries, is_advance")
      .eq("biker_id", biker_id)
      .eq("is_paid", false)
      .gte("date", dateFrom)
      .lte("date", dateTo);

    if (payErr) throw payErr;

    // Separate normal records from advance records
    const normalPayments = (payments || []).filter((p) => !p.is_advance);
    const advancePayments = (payments || []).filter((p) => p.is_advance);

    if (normalPayments.length === 0) {
      throw createError({ statusCode: 400, statusMessage: "Nenhum registro pendente nesta semana" });
    }

    // 3. Calculate week totals from the records themselves
    let weekWallet = 0;
    let weekDeliveries = 0;
    const unpaidIds: string[] = [];

    for (const p of normalPayments) {
      weekWallet += Number(p.amount) || 0;
      weekDeliveries += Number(p.total_deliveries) || 0;
      unpaidIds.push(p.id);
    }

    let advanceMoney = 0;
    for (const a of advancePayments) {
      advanceMoney += Number(a.amount) || 0;
      unpaidIds.push(a.id); // Mark advance records as paid too
    }

    const deliveryFee = weekDeliveries * 1; // R$ 1.00 per delivery
    const netPaid = weekWallet - advanceMoney - deliveryFee;

    const payoutData: any = {
      biker_id,
      amount_paid: netPaid,
      discounts: advanceMoney,
      delivery_fee_total: deliveryFee,
      type: 'settlement',
      week_from: dateFrom,
      week_to: dateTo,
    };

    if (paymentDate) {
      // Append current time to make it a valid timestamp if needed, or just let Supabase parse the date. 
      // Supabase correctly parses YYYY-MM-DD to YYYY-MM-DDT00:00:00Z for timestampz fields.
      payoutData.created_at = paymentDate;
    }

    // 4. Create the payout receipt (settlement)
    const { data: payout, error: insertErr } = await supabase
      .from("biker_payouts")
      .insert([payoutData])
      .select()
      .single();

    if (insertErr) {
      console.error("Error inserting to biker_payouts:", insertErr);
      throw createError({ statusCode: 500, statusMessage: "Erro ao gerar recibo de pagamento" });
    }

    // 5. Subtract the week's gross from the biker's global wallet
    const currentWallet = Number(biker.wallet) || 0;
    const newWallet = Math.max(0, currentWallet - weekWallet);
    const { error: walletErr } = await supabase
      .from("Entregadores")
      .update({ wallet: newWallet })
      .eq("id", biker_id);

    if (walletErr) throw walletErr;

    // 6. Mark ALL this week's records (normal + advances) as paid
    if (unpaidIds.length > 0) {
      const { error: markErr } = await supabase
        .from("biker_payments")
        .update({ is_paid: true })
        .in("id", unpaidIds);

      if (markErr) console.error("Could not mark payments as paid:", markErr);
    }

    return { success: true, payout };

  } catch (error: any) {
    if (error.statusCode) throw error;
    console.error("Error creating payout:", error);
    throw createError({ statusCode: 500, statusMessage: "Failed to create payout" });
  }
});
