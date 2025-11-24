import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const companyId = query.companyId as string | undefined;

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase configuration");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    let productsQuery = supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (companyId) {
      productsQuery = productsQuery.eq("company_id", companyId);
    }

    const { data: products, error } = await productsQuery;

    if (error) throw error;

    return {
      success: true,
      data: products || [],
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    return { success: false, data: [] };
  }
});
