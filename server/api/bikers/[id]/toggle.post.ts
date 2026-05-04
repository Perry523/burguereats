import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  try {
    const auth = requireAuth(event);
    if (auth.role !== "admin") {
      throw createError({ statusCode: 403, statusMessage: "Admin only" });
    }

    const bikerId = event.context.params?.id;
    if (!bikerId) {
      throw createError({ statusCode: 400, statusMessage: "Biker ID required" });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY; // Service key needed to update other users

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase configuration");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get current status
    const { data: currentBiker, error: fetchErr } = await supabase
      .from("Entregadores")
      .select("isActive")
      .eq("id", bikerId)
      .single();

    if (fetchErr) throw fetchErr;

    const newStatus = !currentBiker.isActive;

    const { error: updateErr } = await supabase
      .from("Entregadores")
      .update({ isActive: newStatus })
      .eq("id", bikerId);

    if (updateErr) throw updateErr;

    return { success: true, isActive: newStatus };
  } catch (error: any) {
    console.error("Error toggling biker status:", error);
    throw createError({
      statusCode: 500,
      statusMessage: error.message || "Failed to toggle status",
    });
  }
});
