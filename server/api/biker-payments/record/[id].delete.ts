import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  try {
    const auth = requireAuth(event);

    const id = getRouterParam(event, "id");
    if (!id) {
      throw createError({ statusCode: 400, statusMessage: "Payment ID is required" });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseKey) throw new Error("Missing Supabase configuration");

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Ensure it's not paid
    const { data: currentPayment, error: checkErr } = await supabase
      .from("biker_payments")
      .select("is_paid, biker_id")
      .eq("id", id)
      .single();

    if (checkErr || !currentPayment) throw createError({ statusCode: 404, statusMessage: "Record not found" });

    if (currentPayment.is_paid) {
      throw createError({ statusCode: 400, statusMessage: "Cannot delete a paid record" });
    }

    // Admins can delete any, bikers can only delete their own
    if (auth.role === "biker") {
      const { data: bikerRecord } = await supabase.from("Entregadores").select("id").eq("userId", auth.id).single();
      if (!bikerRecord || bikerRecord.id !== currentPayment.biker_id) {
        throw createError({ statusCode: 403, statusMessage: "Forbidden" });
      }
    }

    const { error: delErr } = await supabase
      .from("biker_payments")
      .delete()
      .eq("id", id);

    if (delErr) throw delErr;

    return { success: true };
  } catch (error: any) {
    if (error.statusCode) throw error;
    console.error("Error deleting biker payment:", error);
    throw createError({ statusCode: 500, statusMessage: "Failed to delete payment" });
  }
});
