import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  try {
    const auth = requireAuth(event);

    if (auth.role !== "admin") {
      throw createError({ statusCode: 403, statusMessage: "Admin only" });
    }

    const id = getRouterParam(event, "id");

    if (!id) {
      throw createError({ statusCode: 400, statusMessage: "Payment ID is required" });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseKey) throw new Error("Missing Supabase configuration");

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { error } = await supabase
      .from("biker_payments")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    if (error.statusCode) throw error;
    console.error("Error deleting payment:", error);
    throw createError({ statusCode: 500, statusMessage: "Failed to delete payment" });
  }
});
