import { handleServerError, sendSuccess } from "~/server/utils/http";
import { createClient } from "@supabase/supabase-js";

const serializeCategory = (category: {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  order: number;
  companyId: string;
  createdAt: Date;
  updatedAt: Date;
}) => ({
  id: category.id,
  name: category.name,
  slug: category.slug,
  description: category.description,
  order: category.order,
  companyId: category.companyId,
  createdAt: category.createdAt,
  updatedAt: category.updatedAt,
});

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const companyId =
      typeof query.companyId === "string" ? query.companyId : undefined;

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase configuration");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    let categoriesQuery = supabase
      .from("Category")
      .select("*")
      .order("order", { ascending: true })
      .order("name", { ascending: true })
      .order("createdAt", { ascending: true });

    if (companyId) {
      categoriesQuery = categoriesQuery.eq("companyId", companyId);
    }

    const { data: categories, error } = await categoriesQuery;

    if (error) throw error;

    return sendSuccess(event, {
      data: (categories || []).map((category: any) => serializeCategory(category)),
    });
  } catch (error) {
    return handleServerError(event, error, {
      statusCode: 500,
      code: "CATEGORIES_FETCH_FAILED",
      message: "Failed to fetch categories",
    });
  }
});
