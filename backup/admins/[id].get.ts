import { DatabaseHelper } from "~/server/utils/database";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: "Admin ID is required",
      });
    }

    const db = new DatabaseHelper();
    const admin = await db
      .db("Admins")
      .where("Admins.id", id)
      .join("Company", "Admins.companyId", "Company.id")
      .select(
        "Admins.*",
        "Company.name as company_name",
        "Company.email as company_email"
      )
      .first();

    if (!admin) {
      throw createError({
        statusCode: 404,
        statusMessage: "Admin not found",
      });
    }

    return { success: true, data: admin };
  } catch (error) {
    console.error("Error fetching admin:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch admin",
    });
  }
});
