import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: "Admin ID is required",
      });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase configuration");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { error } = await supabase.from("Admins").delete().eq("id", id);

    if (error) throw error;

    return { success: true, message: "Admin deleted successfully" };
  } catch (error) {
    console.error("Error deleting admin:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to delete admin",
    });
  }
});
