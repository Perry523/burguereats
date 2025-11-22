import { DatabaseHelper } from "~/server/utils/database";
import { randomUUID } from "crypto";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    if (!body.name || !body.companyId) {
      throw createError({
        statusCode: 400,
        statusMessage: "Name and companyId are required",
      });
    }

    const db = new DatabaseHelper();
    const category = await db.create("SideCategory", {
      id: randomUUID(),
      name: body.name,
      description: body.description,
      isRequired: body.isRequired ?? false,
      maxSelections:
        typeof body.maxSelections === "number" ? body.maxSelections : null,
      order: typeof body.order === "number" ? body.order : 0,
      companyId: body.companyId,
    });

    return {
      success: true,
      data: category,
    };
  } catch (error) {
    console.error("Error creating side category:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to create side category",
    });
  }
});
