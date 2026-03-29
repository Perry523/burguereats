import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  try {
    const auth = requireAuth(event);
    const query = getQuery(event);
    let companyId = query.companyId as string;

    // Enforcement: 
    if (auth.role === 'manager') {
      // Managers ALWAYS filtered by their company
      companyId = auth.companyId as string;
    } else if (auth.role === 'admin') {
      // Admins can see all (empty companyId) OR filter by a specific company if provided in query
      companyId = query.companyId as string || '';
    }

    if (!companyId && auth.role === 'manager') {
      throw createError({
        statusCode: 400,
        statusMessage: "Company ID is required for managers",
      });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase configuration");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // For managers: only show bikers assigned to their company TODAY
    if (auth.role === 'manager' && companyId) {
      const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
      const { data: assignments } = await supabase
        .from("biker_assignments")
        .select("biker_id")
        .eq("company_id", companyId)
        .eq("date", today)
        .eq("status", "confirmado");

      const assignedBikerIds = (assignments || []).map((a: any) => a.biker_id);

      if (assignedBikerIds.length === 0) {
        return { success: true, data: [] };
      }

      const { data: bikers, error } = await supabase
        .from("Entregadores")
        .select("*")
        .in("id", assignedBikerIds)
        .order("createdAt", { ascending: false });

      if (error) throw error;
      return { success: true, data: bikers };
    }

    // For admins: show all bikers
    let bikersQuery = supabase
      .from("Entregadores")
      .select("*")
      .order("createdAt", { ascending: false });

    if (companyId) {
      bikersQuery = bikersQuery.eq("companyId", companyId);
    }

    const { data: bikers, error } = await bikersQuery;

    if (error) throw error;

    return { success: true, data: bikers };
  } catch (error: any) {
    if (error.statusCode) throw error;
    console.error("Error fetching bikers:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch bikers",
    });
  }
});
