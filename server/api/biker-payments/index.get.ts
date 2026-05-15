import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  try {
    const auth = requireAuth(event);

    if (
      auth.role !== "biker" &&
      auth.role !== "admin" &&
      auth.role !== "manager"
    ) {
      throw createError({ statusCode: 403, statusMessage: "Unauthorized" });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey =
      process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseKey)
      throw new Error("Missing Supabase configuration");

    const supabase = createClient(supabaseUrl, supabaseKey);

    let bikerRecord = null;
    let computedWallet = 0;
    let openPaymentsTotal = 0;
    let advanceMoney = 0;
    let paymentsQuery = supabase
      .from("biker_payments")
      .select("*")
      .order("date", { ascending: false });

    // If biker, scope to only their payments and compute wallet
    if (auth.role === "biker") {
      const { data: bRecord, error: bikerErr } = await supabase
        .from("Entregadores")
        .select("id")
        .eq("userId", auth.id)
        .single();

      if (bikerErr || !bRecord) {
        return { success: true, data: { wallet: 0, payments: [] } };
      }
      bikerRecord = bRecord;
      paymentsQuery = paymentsQuery.eq("biker_id", bikerRecord.id);
    }

    // Fetch payments
    const { data: payments, error: payErr } = await paymentsQuery;
    if (payErr) throw payErr;

    // For bikers, compute the current wallet status
    if (auth.role === "biker" && bikerRecord) {
      const openNormalTotal = (payments || [])
        .filter((p: any) => !p.is_paid && !p.is_advance)
        .reduce((acc: number, p: any) => acc + (Number(p.amount) || 0), 0);

      const openAdvanceTotal = (payments || [])
        .filter((p: any) => !p.is_paid && p.is_advance)
        .reduce((acc: number, p: any) => acc + (Number(p.amount) || 0), 0);

      advanceMoney = openAdvanceTotal;
      openPaymentsTotal = openNormalTotal;
      computedWallet = openNormalTotal - openAdvanceTotal;
    }

    // Enrich with company names and biker names
    const companyIds = [
      ...new Set(
        (payments || []).map((p: any) => p.company_id).filter(Boolean),
      ),
    ];
    const bikerIds = [...new Set((payments || []).map((p: any) => p.biker_id))];

    let companyMap: Record<string, string> = {};
    if (companyIds.length > 0) {
      const { data: companies } = await supabase
        .from("Company")
        .select("id, name")
        .in("id", companyIds);
      if (companies) {
        for (const c of companies) companyMap[c.id] = c.name;
      }
    }

    let bikerMap: Record<string, string> = {};
    if (auth.role !== "biker" && bikerIds.length > 0) {
      const { data: bikers } = await supabase
        .from("Entregadores")
        .select("id, name")
        .in("id", bikerIds);
      if (bikers) {
        for (const b of bikers) bikerMap[b.id] = b.name;
      }
    }

    const enriched = (payments || []).map((p: any) => ({
      ...p,
      company_name: p.is_advance
        ? "Adiantamento"
        : companyMap[p.company_id] || "Adiantamento",
      biker_name:
        auth.role === "biker"
          ? auth.name
          : bikerMap[p.biker_id] || "Desconhecido",
    }));

    return {
      success: true,
      data: {
        wallet: computedWallet,
        openPaymentsTotal,
        advanceMoney,
        payments: enriched,
      },
    };
  } catch (error: any) {
    if (error.statusCode) throw error;
    console.error("Error fetching biker payments:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch payments",
    });
  }
});
