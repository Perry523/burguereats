import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async () => {
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase configuration");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data: companies, error } = await supabase
      .from("Company")
      .select("*");

    if (error) throw error;

    return { success: true, data: companies };
  } catch (error) {
    console.error("Error fetching companies:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch companies",
    });
  }
});
