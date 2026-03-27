import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  try {
    const auth = requireAuth(event);

    // Only admins can see financial summaries
    if (auth.role !== "admin") {
      throw createError({ statusCode: 403, statusMessage: "Admin only" });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseKey) throw new Error("Missing Supabase configuration");

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch all bikers
    const { data: bikers, error: bikerErr } = await supabase
      .from("Entregadores")
      .select("id, name, email, phone, wallet, advance_money, isActive")
      .order("name", { ascending: true });

    if (bikerErr) throw bikerErr;

    // Fetch all payments grouped by biker to get total deliveries
    const { data: payments, error: payErr } = await supabase
      .from("biker_payments")
      .select("biker_id, total_deliveries")
      .eq("is_paid", false);

    if (payErr) throw payErr;

    // Sum total_deliveries per biker
    const deliveriesByBiker: Record<string, number> = {};
    for (const p of (payments || [])) {
      if (!deliveriesByBiker[p.biker_id]) deliveriesByBiker[p.biker_id] = 0;
      deliveriesByBiker[p.biker_id] += Number(p.total_deliveries) || 0;
    }

    // Build summary for each biker
    const summaries = (bikers || []).map((b: any) => {
      const walletTotal = Number(b.wallet) || 0;
      const advanceMoney = Number(b.advance_money) || 0;
      const totalDeliveries = deliveriesByBiker[b.id] || 0;
      const deliveryFee = totalDeliveries * 1; // R$1 per delivery
      const netToPay = walletTotal - advanceMoney - deliveryFee;

      return {
        id: b.id,
        name: b.name,
        email: b.email,
        phone: b.phone,
        isActive: b.isActive,
        wallet: walletTotal,
        advance_money: advanceMoney,
        total_deliveries: totalDeliveries,
        delivery_fee: deliveryFee,
        net_to_pay: netToPay,
      };
    });

    return { success: true, data: summaries };
  } catch (error: any) {
    if (error.statusCode) throw error;
    console.error("Error fetching biker financials:", error);
    throw createError({ statusCode: 500, statusMessage: "Failed to fetch financials" });
  }
});
