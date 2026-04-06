import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  try {
    const auth = requireAuth(event);
    if (auth.role !== 'admin') {
      throw createError({ statusCode: 403, statusMessage: "Forbidden: Admins only" });
    }

    const bikerId = getRouterParam(event, "id");
    if (!bikerId) throw createError({ statusCode: 400, statusMessage: "Biker ID required" });

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseKey) throw new Error("Missing Supabase configuration");
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get vinculated companies
    const { data: vinculations, error: vinculationErr } = await supabase
      .from("biker_companies")
      .select("company_id")
      .eq("biker_id", bikerId);

    if (vinculationErr) throw vinculationErr;

    const vinculatedIds = (vinculations || []).map(v => v.company_id);

    return {
      success: true,
      data: vinculatedIds
    };

  } catch (error: any) {
    if (error.statusCode) throw error;
    console.error("Error fetching biker vinculations:", error);
    throw createError({ statusCode: 500, statusMessage: "Failed to fetch vinculations" });
  }
});
