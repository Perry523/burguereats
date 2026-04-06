import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  try {
    const auth = requireAuth(event);
    if (auth.role !== 'biker') {
      throw createError({ statusCode: 403, statusMessage: "Bikers only" });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseKey) throw new Error("Missing Supabase configuration");
    const supabase = createClient(supabaseUrl, supabaseKey);

    // 1. Get the Entregadores record for this user
    const { data: bikerRecord, error: bikerErr } = await supabase
      .from("Entregadores")
      .select("id")
      .eq("userId", auth.id)
      .single();

    if (bikerErr || !bikerRecord) {
      return { success: true, data: [] };
    }

    const bikerId = bikerRecord.id;

    // 2. Get vinculations linked to the Company table
    const { data: vinculations, error: vinculationErr } = await supabase
      .from("biker_companies")
      .select("company_id")
      .eq("biker_id", bikerId);

    if (vinculationErr) throw vinculationErr;

    const companyIds = (vinculations || []).map(v => v.company_id);

    if (companyIds.length === 0) {
      return { success: true, data: [] };
    }

    // 3. Fetch company names for the record-creation selection
    const { data: companies, error: companyErr } = await supabase
      .from("Company")
      .select("id, name")
      .in("id", companyIds);

    if (companyErr) throw companyErr;

    const formatted = (companies || []).map(c => ({
      company_id: c.id,
      company_name: c.name
    }));

    return { success: true, data: formatted };

  } catch (error: any) {
    if (error.statusCode) throw error;
    console.error("Error fetching biker vinculated companies:", error);
    throw createError({ 
      statusCode: 500, 
      statusMessage: "Failed to fetch vinculated companies",
      message: error.message || "Unknown error"
    });
  }
});
