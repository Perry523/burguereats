import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  try {
    const auth = requireAuth(event);
    if (auth.role !== "admin") {
      throw createError({ statusCode: 403, statusMessage: "Admin only" });
    }

    const companyId = event.context.params?.id;
    if (!companyId) {
      throw createError({ statusCode: 400, statusMessage: "Company ID required" });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase configuration");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get current status
    const { data: company, error: fetchErr } = await supabase
      .from("Company")
      .select("isActive")
      .eq("id", companyId)
      .single();

    if (fetchErr || !company) {
      throw createError({ statusCode: 404, statusMessage: "Company not found" });
    }

    const newStatus = !company.isActive;

    const { error: updateErr } = await supabase
      .from("Company")
      .update({ isActive: newStatus })
      .eq("id", companyId);

    if (updateErr) throw updateErr;

    return { success: true, isActive: newStatus };
  } catch (error: any) {
    if (error.statusCode) throw error;
    console.error("Error toggling company status:", error);
    throw createError({
      statusCode: 500,
      statusMessage: error.message || "Failed to toggle status",
    });
  }
});
