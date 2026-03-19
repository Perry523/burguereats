import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const companyId = query.companyId as string;

    if (!companyId) {
      throw createError({
        statusCode: 400,
        statusMessage: "Company ID is required",
      });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase configuration");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: clients, error } = await supabase
      .from("clients")
      .select("*")
      .eq("company_id", companyId)
      .order("name", { ascending: true });

    if (error) throw error;

    return { success: true, data: clients };
  } catch (error: any) {
    console.error("Error fetching clients:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch clients",
    });
  }
});
