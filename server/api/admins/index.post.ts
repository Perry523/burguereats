import { DatabaseHelper } from "~/server/utils/database";
import bcrypt from "bcrypt";
import { randomUUID } from "crypto";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    if (!body.name || !body.email || !body.password || !body.companyId) {
      throw createError({
        statusCode: 400,
        statusMessage: "Name, email, password, and companyId are required",
      });
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);

    const db = new DatabaseHelper();
    const admin = await db.create("Admins", {
      id: randomUUID(),
      name: body.name,
      email: body.email,
      password: hashedPassword,
      phone: body.phone,
      companyId: body.companyId,
      isActive: body.isActive ?? true,
    });

    return { success: true, data: admin };
  } catch (error) {
    console.error("Error creating admin:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to create admin",
    });
  }
});
