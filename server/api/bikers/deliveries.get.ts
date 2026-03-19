import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const bikerId = query.bikerId as string;

    if (!bikerId) {
      throw createError({
        statusCode: 400,
        statusMessage: "Biker ID is required",
      });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase configuration");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: deliveries, error } = await supabase
      .from("orders")
      .select("*")
      .eq("biker_id", bikerId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return {
      success: true,
      data: deliveries,
    };
  } catch (error) {
    console.error("Error fetching deliveries:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch deliveries",
    });
  }
});
