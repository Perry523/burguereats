import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  try {
    const auth = requireAuth(event);
    const query = getQuery(event);

    const date = query.date as string;
    let companyId = query.companyId as string;

    if (!date) {
      throw createError({
        statusCode: 400,
        statusMessage: "Date is required (YYYY-MM-DD)",
      });
    }

    // Managers can only see their own company's assignments
    if (auth.role === "manager") {
      companyId = auth.companyId as string;
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseKey) throw new Error("Missing Supabase configuration");

    const supabase = createClient(supabaseUrl, supabaseKey);

    let q = supabase
      .from("biker_assignments")
      .select("*")
      .eq("date", date)
      .order("created_at", { ascending: false });

    if (companyId) {
      q = q.eq("company_id", companyId);
    }

    const { data: assignments, error } = await q;
    if (error) throw error;

    // Enrich with biker names and company names
    const bikerIds = [...new Set((assignments || []).map((a: any) => a.biker_id))];
    const companyIds = [...new Set((assignments || []).map((a: any) => a.company_id))];

    let bikerMap: Record<string, any> = {};
    let companyMap: Record<string, any> = {};

    if (bikerIds.length > 0) {
      const { data: bikers } = await supabase
        .from("Entregadores")
        .select("id, name, email, phone")
        .in("id", bikerIds);
      if (bikers) {
        for (const b of bikers) bikerMap[b.id] = b;
      }
    }

    if (companyIds.length > 0) {
      const { data: companies } = await supabase
        .from("Company")
        .select("id, name, operating_hours")
        .in("id", companyIds);
      if (companies) {
        for (const c of companies) companyMap[c.id] = c;
      }
    }

    const enriched = (assignments || []).map((a: any) => ({
      ...a,
      biker_name: bikerMap[a.biker_id]?.name || "Desconhecido",
      biker_email: bikerMap[a.biker_id]?.email || "",
      biker_phone: bikerMap[a.biker_id]?.phone || "",
      company_name: companyMap[a.company_id]?.name || "Desconhecida",
    }));

    return { success: true, data: enriched };
  } catch (error: any) {
    if (error.statusCode) throw error;
    console.error("Error fetching biker assignments:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch biker assignments",
    });
  }
});
