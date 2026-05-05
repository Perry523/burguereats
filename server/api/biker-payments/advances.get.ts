import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  try {
    const auth = requireAuth(event);

    if (auth.role !== "admin") {
      throw createError({ statusCode: 403, statusMessage: "Admin only" });
    }

    const query = getQuery(event);
    const bikerId = query.biker_id as string;
    const dateFrom = query.dateFrom as string | undefined;
    const dateTo = query.dateTo as string | undefined;

    if (!bikerId) {
      throw createError({ statusCode: 400, statusMessage: "Biker ID is required" });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseKey) throw new Error("Missing Supabase configuration");

    const supabase = createClient(supabaseUrl, supabaseKey);

    let paymentsQuery = supabase
      .from("biker_payments")
      .select("*")
      .eq("biker_id", bikerId)
      .eq("is_advance", true)
      .order("date", { ascending: false });

    if (dateFrom && dateTo) {
      paymentsQuery = paymentsQuery.gte("date", dateFrom).lte("date", dateTo);
    }

    const { data: advances, error } = await paymentsQuery;

    if (error) throw error;

    return { success: true, data: advances };
  } catch (error: any) {
    if (error.statusCode) throw error;
    console.error("Error fetching advances:", error);
    throw createError({ statusCode: 500, statusMessage: "Failed to fetch advances" });
  }
});
