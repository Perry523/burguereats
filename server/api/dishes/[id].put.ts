import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");
    const body = await readBody(event);

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

    const updateData: Record<string, unknown> = {};

    if (typeof body.name === "string") {
      const trimmedName = body.name.trim();
      if (trimmedName) {
        updateData.name = trimmedName;
      }
    }

    if (
      typeof Object.prototype?.hasOwnProperty?.call === "function" &&
      Object.prototype?.hasOwnProperty?.call(body, "description")
    ) {
      updateData.description =
        typeof body.description === "string" ? body.description : null;
    }

    if (
      typeof Object.prototype?.hasOwnProperty?.call === "function" &&
      Object.prototype?.hasOwnProperty?.call(body, "price")
    ) {
      const parsedPrice =
        typeof body.price !== "undefined" ? parseFloat(body.price) : NaN;
      if (Number.isNaN(parsedPrice)) {
        throw createError({
          statusCode: 400,
          statusMessage: "Invalid price value",
        });
      }
      updateData.price = parsedPrice;
    }

    const incomingImage =
      typeof body.imageUrl === "string" ? body.imageUrl : body.image;
    const normalizedImage =
      typeof incomingImage === "string" ? incomingImage.trim() : undefined;
    if (normalizedImage !== undefined) {
      updateData.image = normalizedImage || null;
    }

    if (typeof body.isAvailable === "boolean") {
      updateData.isAvailable = body.isAvailable;
    }

    const { data: dish, error } = await supabase
      .from("Dish")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    if (Array.isArray(body.categoryIds)) {
      const categoryIds = body.categoryIds.filter(
        (id) => typeof id === "string"
      );

      await supabase.from("DishCategory").delete().eq("dishId", id);

      if (categoryIds.length > 0) {
        const dishCategories = categoryIds.map((categoryId) => ({
          id: randomUUID(),
          dishId: id,
          categoryId,
        }));
        await supabase.from("DishCategory").insert(dishCategories);
      }
    }

    if (Array.isArray(body.sideCategoryIds)) {
      const sideCategoryIds = body.sideCategoryIds.filter(
        (id) => typeof id === "string"
      );

      await supabase.from("DishSideCategory").delete().eq("dishId", id);

      if (sideCategoryIds.length > 0) {
        const dishSideCategories = sideCategoryIds.map(
          (sideCategoryId, index) => ({
            id: randomUUID(),
            dishId: id,
            sideCategoryId,
            order: index,
          })
        );
        await supabase.from("DishSideCategory").insert(dishSideCategories);
      }
    }

    return { success: true, data: dish };
  } catch (error) {
    console.error("Error updating dish:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to update dish",
    });
  }
});
