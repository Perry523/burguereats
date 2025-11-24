import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  try {
    const id = event.context.params?.id;
    const body = await readBody(event);
    const { status } = body;

    if (!id) {
      throw new Error("Missing order ID");
    }

    if (!status) {
      throw new Error("Missing status");
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase configuration");
    }

    // Use service key to bypass RLS
    const supabase = createClient(supabaseUrl, supabaseKey);

    const now = new Date();
    const { data, error } = await supabase
      .from("orders")
      .update({
        status,
        updated_at: now,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return {
      success: true,
      data,
    };
  } catch (error: any) {
    console.error("Error updating order:", error);
    return { success: false, error: error.message };
  }
});
