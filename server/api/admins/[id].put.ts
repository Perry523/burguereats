import { DatabaseHelper } from "~/server/utils/database";
import bcrypt from "bcrypt";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");
    const body = await readBody(event);

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: "Admin ID is required",
      });
    }

    const updateData: any = {
      name: body.name,
      email: body.email,
      phone: body.phone,
      isActive: body.isActive,
    };

    if (body.password) {
      updateData.password = await bcrypt.hash(body.password, 10);
    }

    const db = new DatabaseHelper();
    const admin = await db.update("Admins", id, updateData);

    return { success: true, data: admin };
  } catch (error) {
    console.error("Error updating admin:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to update admin",
    });
  }
});
