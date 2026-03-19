import { handleServerError, sendSuccess } from "~/server/utils/http";
import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    let companyId = typeof query.companyId === "string" ? query.companyId : undefined;

    const search = typeof query.search === "string" ? query.search : undefined;

    // TODO: Remove this hardcoded fallback once subdomain logic is implemented
    if (!companyId) {
      companyId = 'cmhp2pzdq0000gjpvfdsaumu0';
    }
    const activeOnly = query.activeOnly === 'true';

    if (!companyId) {
      throw createError({
        statusCode: 400,
        statusMessage: "Company ID is required",
      });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase configuration");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    let query_builder = supabase
      .from('products')
      .select('*')
      .eq('company_id', companyId);

    if (activeOnly) {
      query_builder = query_builder.eq('is_active', true);
    }

    if (search) {
      query_builder = query_builder.ilike('name', `%${search}%`);
    }

    const { data: products, error } = await query_builder.order('created_at', { ascending: false });

    if (error) throw error;

    return sendSuccess(event, {
      data: products,
    });
  } catch (error) {
    return handleServerError(event, error, {
      statusCode: 500,
      code: "PRODUCTS_FETCH_FAILED",
      message: "Failed to fetch products",
    });
  }
});
