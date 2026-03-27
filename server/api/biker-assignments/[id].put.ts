import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  try {
    const auth = requireAuth(event);
    const id = getRouterParam(event, "id");
    const body = await readBody(event);

    if (!id) {
      throw createError({ statusCode: 400, statusMessage: "Assignment ID is required" });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseKey) throw new Error("Missing Supabase configuration");

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Verify assignment exists
    const { data: existing, error: fetchErr } = await supabase
      .from("biker_assignments")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchErr || !existing) {
      throw createError({ statusCode: 404, statusMessage: "Assignment not found" });
    }

    // Managers can only manage their own company's assignments
    if (auth.role === "manager" && existing.company_id !== auth.companyId) {
      throw createError({ statusCode: 403, statusMessage: "Access denied" });
    }

    const updateData: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (body.status !== undefined) {
      if (!["confirmado", "cancelado"].includes(body.status)) {
        throw createError({
          statusCode: 400,
          statusMessage: "Status must be 'confirmado' or 'cancelado'",
        });
      }
      updateData.status = body.status;
    }

    const { data: assignment, error: updateErr } = await supabase
      .from("biker_assignments")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (updateErr) throw updateErr;

    return { success: true, data: assignment };
  } catch (error: any) {
    if (error.statusCode) throw error;
    console.error("Error updating biker assignment:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to update biker assignment",
    });
  }
});
