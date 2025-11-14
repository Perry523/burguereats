import { DatabaseHelper } from "~/server/utils/database";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const companyId = query.companyId as string;

    const db = new DatabaseHelper();
    let admins;

    if (companyId) {
      admins = await db
        .db("Admins")
        .where("companyId", companyId)
        .join("Company", "Admins.companyId", "Company.id")
        .select(
          "Admins.*",
          "Company.name as company_name",
          "Company.email as company_email"
        );
    } else {
      admins = await db
        .db("Admins")
        .join("Company", "Admins.companyId", "Company.id")
        .select(
          "Admins.*",
          "Company.name as company_name",
          "Company.email as company_email"
        );
    }

    return { success: true, data: admins };
  } catch (error) {
    console.error("Error fetching admins:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch admins",
    });
  }
});
