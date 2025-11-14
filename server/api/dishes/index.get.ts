import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const companyId = query.companyId as string | undefined;

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase configuration");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    let dishesQuery = supabase
      .from("Dish")
      .select("*")
      .order("createdAt", { ascending: false });

    if (companyId) {
      dishesQuery = dishesQuery.eq("companyId", companyId);
    }

    const { data: dishes, error: dishesError } = await dishesQuery;

    if (dishesError) throw dishesError;

    if (!dishes || dishes.length === 0) {
      return {
        success: true,
        data: dishes || [],
      };
    }

    const dishIds = (dishes as any[]).map((dish) => dish.id);

    const { data: dishCategories, error: categoriesError } = await supabase
      .from("DishCategory")
      .select(
        `
        dishId,
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
      .in("dishId", dishIds);

    if (categoriesError) throw categoriesError;

    const { data: dishSideCategories, error: sideCategoriesError } = await supabase
      .from("DishSideCategory")
      .select(
        `
        dishId,
        order as dishOrder,
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
      .in("dishId", dishIds);

    if (sideCategoriesError) throw sideCategoriesError;

    const categoriesByDish: Record<string, any[]> = {};
    const sideCategoriesByDish: Record<string, any[]> = {};

    (dishCategories || []).forEach((item: any) => {
      if (!categoriesByDish[item.dishId]) categoriesByDish[item.dishId] = [];
      categoriesByDish[item.dishId].push(item.Category);
    });

    (dishSideCategories || []).forEach((item: any) => {
      if (!sideCategoriesByDish[item.dishId]) sideCategoriesByDish[item.dishId] = [];
      sideCategoriesByDish[item.dishId].push({
        ...item.SideCategory,
        dishOrder: item.dishOrder,
      });
    });

    const dishesWithRelations = (dishes as any[]).map((dish) => ({
      ...dish,
      categories: categoriesByDish[dish.id] || [],
      sideCategories: sideCategoriesByDish[dish.id] || [],
    }));

    return {
      success: true,
      data: dishesWithRelations,
    };
  } catch (error) {
    console.error("Error fetching dishes:", error);
    return { success: true, data: [] };
  }
});
export const config = {
  runtime: "nodejs",
};
