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
    const { data: dish, error: dishError } = await supabase
      .from("Dish")
      .select("*")
      .eq("id", id)
      .single();

    if (dishError || !dish) {
      throw createError({
        statusCode: 404,
        statusMessage: "Dish not found",
      });
    }

    const { data: dishCategories } = await supabase
      .from("DishCategory")
      .select(
        `
        Category:categoryId (
          id,
          name,
          slug,
          description,
          order,
          companyId,
          createdAt,
          updatedAt
        )
      `
      )
      .eq("dishId", id);

    const { data: dishSideCategories } = await supabase
      .from("DishSideCategory")
      .select(
        `
        order,
        SideCategory:sideCategoryId (
          id,
          name,
          description,
          isRequired,
          maxSelections,
          order,
          companyId,
          createdAt,
          updatedAt
        )
      `
      )
      .eq("dishId", id);

    return {
      success: true,
      data: {
        ...dish,
        categories: (dishCategories || []).map((dc: any) => dc.Category),
        sideCategories: (dishSideCategories || []).map((dsc: any) => ({
          ...dsc.SideCategory,
          dishOrder: dsc.order,
        })),
      },
    };
  } catch (error) {
    console.error("Error fetching dish:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch dish",
    });
  }
});
