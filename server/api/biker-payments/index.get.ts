import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  try {
    const auth = requireAuth(event);

    if (auth.role !== "biker") {
      throw createError({ statusCode: 403, statusMessage: "Bikers only" });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseKey) throw new Error("Missing Supabase configuration");

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Find the Entregadores record for this user
    const { data: bikerRecord, error: bikerErr } = await supabase
      .from("Entregadores")
      .select("id, advance_money")
      .eq("userId", auth.id)
      .single();

    if (bikerErr || !bikerRecord) {
      return { success: true, data: { wallet: 0, payments: [] } };
    }

    // Fetch all payments
    const { data: payments, error: payErr } = await supabase
      .from("biker_payments")
      .select("*")
      .eq("biker_id", bikerRecord.id)
      .order("date", { ascending: false });

    if (payErr) throw payErr;

    // Compute wallet: sum of unpaid payments minus advance_money (adiantamentos)
    const openPaymentsTotal = (payments || [])
      .filter((p: any) => !p.is_paid)
      .reduce((acc: number, p: any) => acc + (Number(p.amount) || 0), 0);

    const advanceMoney = Number(bikerRecord.advance_money) || 0;
    const computedWallet = openPaymentsTotal - advanceMoney;

    // Enrich with company names
    const companyIds = [...new Set((payments || []).map((p: any) => p.company_id))];
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

    const enriched = (payments || []).map((p: any) => ({
      ...p,
      company_name: companyMap[p.company_id] || "Desconhecida",
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
    throw createError({ statusCode: 500, statusMessage: "Failed to fetch payments" });
  }
});
