import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const code = query.code as string;
    const companyId = query.companyId as string;

    if (!code || !companyId) {
      throw createError({
        statusCode: 400,
        statusMessage: "Code and Company ID are required",
      });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase configuration");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Find order by pickup_code and company_id
    // We prioritize 'waiting' orders, but finding any order with that code is useful
    const { data: order, error } = await supabase
      .from("orders")
      .select(
        `
        *,
        items:order_items(*)
      `
      )
      .eq("company_id", companyId)
      .eq("pickup_code", code)
      // If we want to restrict to only today's orders or waiting orders, we could add filters here
      // For now, let's just find the most recent one with that code
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error || !order) {
      return { success: false, message: "Order not found" };
    }

    return {
      success: true,
      data: order,
    };
  } catch (error: any) {
    console.error("Error looking up order:", error);
    return { success: false, error: error.message };
  }
});
