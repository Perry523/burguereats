import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  try {
    const auth = requireAuth(event);
    const query = getQuery(event);
    let companyId = query.companyId as string;

    // Enforcement: Managers can only see their own company's clients
    if (auth.role === 'manager') {
      companyId = auth.companyId as string;
    }

    if (!companyId && auth.role !== 'admin') {
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

    let clientsQuery = supabase
      .from("clients")
      .select("*")
      .order("name", { ascending: true });

    if (companyId) {
      clientsQuery = clientsQuery.eq("company_id", companyId);
    }

    const { data: clients, error } = await clientsQuery;

    if (error) throw error;

    return { success: true, data: clients };
  } catch (error: any) {
    if (error.statusCode) throw error;
    console.error("Error fetching clients:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch clients",
    });
  }
});
