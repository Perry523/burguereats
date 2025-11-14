import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: "Company ID is required",
      });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase configuration");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data: company, error } = await supabase
      .from("Company")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !company) {
      throw createError({
        statusCode: 404,
        statusMessage: "Company not found",
      });
    }

    return { success: true, data: company };
  } catch (error) {
    console.error("Error fetching company:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch company",
    });
  }
});
