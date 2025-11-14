import { handleServerError, sendError, sendSuccess } from "~/server/utils/http";
import { DatabaseHelper } from "~/server/utils/database";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");

    if (!id) {
      return sendError(event, {
        statusCode: 400,
        code: "CATEGORY_ID_REQUIRED",
        message: "Category ID is required",
      });
    }

    const db = new DatabaseHelper();
    const existingCategory = await db.findById("Category", id);

    if (!existingCategory) {
      return sendError(event, {
        statusCode: 404,
        code: "CATEGORY_NOT_FOUND",
        message: "Category not found",
      });
    }

    await db.delete("Category", id);

    return sendSuccess(event, {
      data: null,
    });
  } catch (error) {
    return handleServerError(event, error, {
      statusCode: 500,
      code: "CATEGORY_DELETE_FAILED",
      message: "Failed to delete category",
    });
  }
});
