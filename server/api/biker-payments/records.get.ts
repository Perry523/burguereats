import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  try {
    const auth = requireAuth(event);

    if (auth.role !== "admin") {
      throw createError({ statusCode: 403, statusMessage: "Admin only" });
    }

    const query = getQuery(event);
    const dateFrom = query.dateFrom as string | undefined;
    const dateTo = query.dateTo as string | undefined;
    const companyId = query.companyId as string | undefined;
    const bikerId = query.bikerId as string | undefined;
    // "advance" | "normal" | "" (all)
    const type = query.type as string | undefined;
    const isPaid = query.isPaid as string | undefined; // "true" | "false" | ""
    const isChecked = query.isChecked as string | undefined; // "true" | "false" | ""
    const page = Number(query.page) || 1;
    const perPage = Math.min(Number(query.perPage) || 50, 200);

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey =
      process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseKey)
      throw new Error("Missing Supabase configuration");

    const supabase = createClient(supabaseUrl, supabaseKey);

    let q = supabase
      .from("biker_payments")
      .select(
        "id, biker_id, company_id, date, amount, total_deliveries, is_paid, is_advance, image_url, is_checked, created_at",
        { count: "exact" },
      )
      .order("date", { ascending: false })
      .order("created_at", { ascending: false });

    if (dateFrom && dateTo) {
      q = q.gte("date", dateFrom).lte("date", dateTo);
    }
    if (companyId) q = q.eq("company_id", companyId);
    if (bikerId) q = q.eq("biker_id", bikerId);
    if (type === "advance") q = q.eq("is_advance", true);
    if (type === "normal") q = q.eq("is_advance", false);
    if (isPaid === "true") q = q.eq("is_paid", true);
    if (isPaid === "false") q = q.eq("is_paid", false);
    if (isChecked === "true") q = q.eq("is_checked", true);
    if (isChecked === "false") q = q.eq("is_checked", false);

    // Pagination
    const from = (page - 1) * perPage;
    q = q.range(from, from + perPage - 1);

    const { data: payments, error: payErr, count } = await q;
    if (payErr) throw payErr;

    // Enrich with biker and company names
    const allPayments = payments || [];

    const bikerIds = [
      ...new Set(allPayments.map((p: any) => p.biker_id).filter(Boolean)),
    ];
    const companyIds = [
      ...new Set(allPayments.map((p: any) => p.company_id).filter(Boolean)),
    ];

    let bikerMap: Record<string, string> = {};
    if (bikerIds.length > 0) {
      const { data: bikers } = await supabase
        .from("Entregadores")
        .select("id, name")
        .in("id", bikerIds);
      if (bikers) for (const b of bikers) bikerMap[b.id] = b.name;
    }

    let companyMap: Record<string, string> = {};
    if (companyIds.length > 0) {
      const { data: companies } = await supabase
        .from("Company")
        .select("id, name")
        .in("id", companyIds);
      if (companies) for (const c of companies) companyMap[c.id] = c.name;
    }

    const enriched = allPayments.map((p: any) => ({
      ...p,
      biker_name: bikerMap[p.biker_id] || "Desconhecido",
      company_name: p.is_advance
        ? "Adiantamento"
        : companyMap[p.company_id] || "Adiantamento",
    }));

    // Also fetch all bikers and companies for filter dropdowns
    const { data: allBikers } = await supabase
      .from("Entregadores")
      .select("id, name")
      .order("name");

    const { data: allCompanies } = await supabase
      .from("Company")
      .select("id, name")
      .order("name");

    return {
      success: true,
      data: {
        records: enriched,
        total: count ?? 0,
        page,
        perPage,
        bikers: allBikers || [],
        companies: allCompanies || [],
      },
    };
  } catch (error: any) {
    if (error.statusCode) throw error;
    console.error("Error fetching records:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch records",
    });
  }
});
