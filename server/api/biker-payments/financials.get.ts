import { createClient } from "@supabase/supabase-js";
import dayjs from "dayjs";

export default defineEventHandler(async (event) => {
  try {
    const auth = requireAuth(event);

    // Only admins can see financial summaries
    if (auth.role !== "admin") {
      throw createError({ statusCode: 403, statusMessage: "Admin only" });
    }

    const query = getQuery(event);
    const dateFrom = query.dateFrom as string | undefined;
    const dateTo = query.dateTo as string | undefined;

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

    // Fetch payments scoped by date range if provided
    let paymentsQuery = supabase
      .from("biker_payments")
      .select("biker_id, amount, total_deliveries, is_paid")
      .eq("is_paid", false);

    if (dateFrom && dateTo) {
      paymentsQuery = paymentsQuery.gte("date", dateFrom).lte("date", dateTo);
    }

    const { data: payments, error: payErr } = await paymentsQuery;
    if (payErr) throw payErr;

    // Fetch advances scoped by date range if provided
    let advancesQuery = supabase
      .from("biker_payouts")
      .select("biker_id, amount_paid")
      .eq("type", "advance");

    if (dateFrom && dateTo) {
      const startOfDay = dayjs(dateFrom).startOf("day").toISOString();
      const endOfDay = dayjs(dateTo).endOf("day").toISOString();
      advancesQuery = advancesQuery.gte("created_at", startOfDay).lte("created_at", endOfDay);
    }

    const { data: advances, error: advErr } = await advancesQuery;
    if (advErr) console.error("advances query error:", advErr);

    // Sum total_deliveries and wallet per biker (from the scoped payments)
    const statsByBiker: Record<string, { deliveries: number; amount: number; advances: number }> = {};
    for (const p of (payments || [])) {
      if (!statsByBiker[p.biker_id]) statsByBiker[p.biker_id] = { deliveries: 0, amount: 0, advances: 0 };
      statsByBiker[p.biker_id].deliveries += Number(p.total_deliveries) || 0;
      statsByBiker[p.biker_id].amount += Number(p.amount) || 0;
    }

    // Sum advances per biker
    for (const a of (advances || [])) {
      if (!statsByBiker[a.biker_id]) statsByBiker[a.biker_id] = { deliveries: 0, amount: 0, advances: 0 };
      statsByBiker[a.biker_id].advances += Number(a.amount_paid) || 0;
    }

    // Build summary for each biker
    const summaries = (bikers || []).map((b: any) => {
      const bikerStats = statsByBiker[b.id] || { deliveries: 0, amount: 0, advances: 0 };
      const walletTotal = bikerStats.amount;
      const advanceMoney = bikerStats.advances;
      const totalDeliveries = bikerStats.deliveries;
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
