import { DatabaseHelper } from "~/utils/database";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");
    const body = await readBody(event);

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: "Side category ID is required",
      });
    }

    const db = new DatabaseHelper();
    const existingCategory = await db.findById("SideCategory", id);

    if (!existingCategory) {
      throw createError({
        statusCode: 404,
        statusMessage: "Side category not found",
      });
    }

    const updateData: Record<string, unknown> = {};

    if (typeof body.name === "string") {
      updateData.name = body.name;
    }

    if (
      typeof Object.prototype?.hasOwnProperty?.call === "function" &&
      Object.prototype?.hasOwnProperty?.call(body, "description")
    ) {
      updateData.description = body.description;
    }

    if (typeof body.isRequired === "boolean") {
      updateData.is_required = body.isRequired;
    }

    if (typeof body.maxSelections === "number") {
      updateData.max_selections = body.maxSelections;
    }

    if (typeof body.order === "number") {
      updateData.order = body.order;
    }

    const category = await db.update("SideCategory", id, updateData);

    return {
      success: true,
      data: category,
    };
  } catch (error) {
    console.error("Error updating side category:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to update side category",
    });
  }
});
