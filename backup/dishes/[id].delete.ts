import { DatabaseHelper } from "~/server/utils/database";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");

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

    await db.delete("Dish", id);

    return { success: true, message: "Dish deleted successfully" };
  } catch (error) {
    console.error("Error deleting dish:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to delete dish",
    });
  }
});
