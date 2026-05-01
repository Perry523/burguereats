import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  try {
    const auth = requireAuth(event);

    const id = getRouterParam(event, "id");
    const body = await readBody(event);

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
      throw createError({ statusCode: 400, statusMessage: "Cannot edit a paid record" });
    }

    // Admins can edit any, bikers can only edit their own
    if (auth.role === "biker") {
      const { data: bikerRecord } = await supabase.from("Entregadores").select("id").eq("userId", auth.id).single();
      if (!bikerRecord || bikerRecord.id !== currentPayment.biker_id) {
        throw createError({ statusCode: 403, statusMessage: "Forbidden" });
      }
    }

    const { error: updErr } = await supabase
      .from("biker_payments")
      .update({
        date: body.date,
        company_id: body.company_id,
        amount: body.amount,
        total_deliveries: body.total_deliveries
      })
      .eq("id", id);

    if (updErr) throw updErr;

    return { success: true };
  } catch (error: any) {
    if (error.statusCode) throw error;
    console.error("Error updating biker payment:", error);
    throw createError({ statusCode: 500, statusMessage: "Failed to update payment" });
  }
});
