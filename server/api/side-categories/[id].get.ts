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

    // Fetch category with its side options
    const { data: category, error } = await supabase
      .from("SideCategory")
      .select(
        `
        *,
        sides:SideOption(*)
      `
      )
      .eq("id", id)
      .single();

    if (error || !category) {
      throw createError({
        statusCode: 404,
        statusMessage: "Side category not found",
      });
    }

    return {
      success: true,
      data: category,
    };
  } catch (error) {
    console.error("Error fetching side category:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch side category",
    });
  }
});
