import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: "Admin ID is required",
      });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase configuration");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data: admin, error } = await supabase
      .from("Admins")
      .select(
        `
        *,
        Company:companyId (
          id,
          name,
          email
        )
      `
      )
      .eq("id", id)
      .single();

    if (error) throw error;

    if (!admin) {
      throw createError({
        statusCode: 404,
        statusMessage: "Admin not found",
      });
    }

    return { success: true, data: admin };
  } catch (error) {
    console.error("Error fetching admin:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch admin",
    });
  }
});
