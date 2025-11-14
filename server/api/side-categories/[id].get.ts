import { DatabaseHelper } from "~/server/utils/database";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: "Side category ID is required",
      });
    }

    const db = new DatabaseHelper();
    const category = await db.findById("SideCategory", id);

    if (!category) {
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
