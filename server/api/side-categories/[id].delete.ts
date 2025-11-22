import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: "Side category ID is required",
      });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase configuration");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data: existingCategory, error: fetchError } = await supabase
      .from("SideCategory")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !existingCategory) {
      throw createError({
        statusCode: 404,
        statusMessage: "Side category not found",
      });
    }

    const { error } = await supabase.from("SideCategory").delete().eq("id", id);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error("Error deleting side category:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to delete side category",
    });
  }
});
