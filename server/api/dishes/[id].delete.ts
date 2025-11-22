import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: "Dish ID is required",
      });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase configuration");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data: existingDish, error: fetchError } = await supabase
      .from("Dish")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !existingDish) {
      throw createError({
        statusCode: 404,
        statusMessage: "Dish not found",
      });
    }

    const { error } = await supabase.from("Dish").delete().eq("id", id);

    if (error) throw error;

    return { success: true, message: "Dish deleted successfully" };
  } catch (error) {
    console.error("Error deleting dish:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to delete dish",
    });
  }
});
