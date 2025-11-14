import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase configuration");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data: categories, error } = await supabase
      .from("SideCategory")
      .select(
        `
        *,
        SideOption (
          id,
          name,
          categoryId,
          createdAt,
          updatedAt
        )
      `
      );

    if (error) throw error;

    return {
      success: true,
      data: (categories || []).map((cat: any) => ({
        ...cat,
        sides: cat.SideOption || [],
      })),
    };
  } catch (error) {
    console.error("Error fetching side categories:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch side categories",
    });
  }
});
