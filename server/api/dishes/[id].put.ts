import { DatabaseHelper } from "~/utils/database";
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

    const db = new DatabaseHelper();
    const existingDish = await db.findById("Dish", id);

    if (!existingDish) {
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

    // Update basic dish data
    const dish = await db.update("Dish", id, updateData);

    // Handle category relationships
    if (Array.isArray(body.categoryIds)) {
      const categoryIds = body.categoryIds.filter(
        (id) => typeof id === "string"
      );

      // Remove existing category relationships
      await db.db("DishCategory").where("dishId", id).del();

      // Add new category relationships
      if (categoryIds.length > 0) {
        const dishCategories = categoryIds.map((categoryId) => ({
          id: randomUUID(),
          dishId: id,
          categoryId,
        }));
        await db.db("DishCategory").insert(dishCategories);
      }
    }

    // Handle side category relationships
    if (Array.isArray(body.sideCategoryIds)) {
      const sideCategoryIds = body.sideCategoryIds.filter(
        (id) => typeof id === "string"
      );

      // Remove existing side category relationships
      await db.db("DishSideCategory").where("dishId", id).del();

      // Add new side category relationships
      if (sideCategoryIds.length > 0) {
        const dishSideCategories = sideCategoryIds.map(
          (sideCategoryId, index) => ({
            id: randomUUID(),
            dishId: id,
            sideCategoryId,
            order: index,
          })
        );
        await db.db("DishSideCategory").insert(dishSideCategories);
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
