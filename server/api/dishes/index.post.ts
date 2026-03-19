import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    const name = typeof body.name === "string" ? body.name.trim() : "";
    const companyId = typeof body.companyId === "string" ? body.companyId : "";
    const parsedPrice =
      typeof body.price !== "undefined" ? parseFloat(body.price) : NaN;
    const categoryIds = Array.isArray(body.categoryIds)
      ? body.categoryIds.filter((id: string) => typeof id === "string")
      : [];
    const sideCategoryIds = Array.isArray(body.sideCategoryIds)
      ? body.sideCategoryIds.filter((id: string) => typeof id === "string")
      : [];
    const incomingImage =
      typeof body.imageUrl === "string" ? body.imageUrl : body.image;
    const normalizedImage =
      typeof incomingImage === "string" ? incomingImage.trim() : "";

    if (!name || !companyId || Number.isNaN(parsedPrice)) {
      throw createError({
        statusCode: 400,
        statusMessage: "Name, price, and companyId are required",
      });
    }

    if (categoryIds.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: "At least one category is required",
      });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase configuration");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const dishId = randomUUID();

    const { data: dish, error: dishError } = await supabase
      .from("Dish")
      .insert({
        id: dishId,
        name,
        description:
          typeof body.description === "string" ? body.description : null,
        price: parsedPrice,
        category: "",
        image: normalizedImage || null,
        isAvailable:
          typeof body.isAvailable === "boolean" ? body.isAvailable : true,
        companyId: companyId,
        updatedAt: new Date().toISOString(),
      })
      .select()
      .single();

    if (dishError) throw dishError;

    if (categoryIds.length > 0) {
      const dishCategories = categoryIds.map((categoryId: string) => ({
        dishId,
        categoryId,
      }));
      await supabase.from("DishCategory").insert(dishCategories);
    }

    if (sideCategoryIds.length > 0) {
      const dishSideCategories = sideCategoryIds.map(
        (sideCategoryId: string, index: number) => ({
          dishId,
          sideCategoryId,
          order: index,
        })
      );
      await supabase.from("DishSideCategory").insert(dishSideCategories);
    }

    return { success: true, data: dish };
  } catch (error) {
    console.error("Error creating dish:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to create dish",
    });
  }
});
