import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  try {
    const user = requireAuth(event);
    const query = getQuery(event);
    let companyId = query.companyId as string;

    // Enforcement: Managers can only see their own company
    if (user.role === 'manager') {
      companyId = user.companyId as string;
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase configuration");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    let adminsQuery = supabase.from("Admins").select(
      `
      *,
      Company:companyId (
        id,
        name,
        email
      )
    `
    );

    if (companyId) {
      adminsQuery = adminsQuery.eq("companyId", companyId);
    }

    const { data: admins, error } = await adminsQuery;

    if (error) throw error;

    return { success: true, data: admins };
  } catch (error) {
    console.error("Error fetching admins:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch admins",
    });
  }
});
