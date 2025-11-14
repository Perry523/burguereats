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
    const { data: existingCompany, error: fetchError } = await supabase
      .from("Company")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !existingCompany) {
      throw createError({
        statusCode: 404,
        statusMessage: "Company not found",
      });
    }

    const { error } = await supabase.from("Company").delete().eq("id", id);

    if (error) throw error;

    return { success: true, message: "Company deleted successfully" };
  } catch (error) {
    console.error("Error deleting company:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to delete company",
    });
  }
});
