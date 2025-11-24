import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  try {
    const id = event.context.params?.id;

    if (!id) {
      throw new Error("Missing product ID");
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase configuration");
    }

    // Use service key to bypass RLS
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) throw error;

    return {
      success: true,
    };
  } catch (error: any) {
    console.error("Error deleting product:", error);
    return { success: false, error: error.message };
  }
});
