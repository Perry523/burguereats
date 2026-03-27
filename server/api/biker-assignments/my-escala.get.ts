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
      .select("id")
      .eq("userId", auth.id)
      .single();

    if (bikerErr || !bikerRecord) {
      return { success: true, data: [] };
    }

    const bikerId = bikerRecord.id;

    // Get date range from query (today + 6 days)
    const query = getQuery(event);
    const dateFrom = query.dateFrom as string;
    const dateTo = query.dateTo as string;

    if (!dateFrom || !dateTo) {
      throw createError({ statusCode: 400, statusMessage: "dateFrom and dateTo required" });
    }

    // Fetch assignments for this biker in the date range
    const { data: assignments, error: assignErr } = await supabase
      .from("biker_assignments")
      .select("*")
      .eq("biker_id", bikerId)
      .gte("date", dateFrom)
      .lte("date", dateTo)
      .order("date", { ascending: true });

    if (assignErr) throw assignErr;

    // Enrich with company names
    const companyIds = [...new Set((assignments || []).map((a: any) => a.company_id))];
    let companyMap: Record<string, any> = {};

    if (companyIds.length > 0) {
      const { data: companies } = await supabase
        .from("Company")
        .select("id, name, operating_hours")
        .in("id", companyIds);
      if (companies) {
        for (const c of companies) companyMap[c.id] = c;
      }
    }

    const enriched = (assignments || []).map((a: any) => {
      const company = companyMap[a.company_id];
      const dayOfWeek = new Date(a.date + "T12:00:00Z").getUTCDay();
      const hours = company?.operating_hours?.[dayOfWeek];
      return {
        ...a,
        company_name: company?.name || "Desconhecida",
        hours: hours?.enabled ? `${hours.open_time} - ${hours.close_time}` : null,
      };
    });

    return { success: true, data: enriched };
  } catch (error: any) {
    if (error.statusCode) throw error;
    console.error("Error fetching biker escala:", error);
    throw createError({ statusCode: 500, statusMessage: "Failed to fetch escala" });
  }
});
