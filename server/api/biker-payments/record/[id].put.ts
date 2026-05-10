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
      .select("is_paid, is_advance, biker_id, is_checked")
      .eq("id", id)
      .single();

    if (checkErr || !currentPayment) throw createError({ statusCode: 404, statusMessage: "Record not found" });

    if (currentPayment.is_paid && auth.role !== "admin") {
      throw createError({ statusCode: 400, statusMessage: "Cannot edit a paid record" });
    }

    if (currentPayment.is_advance && auth.role !== "admin") {
      throw createError({ statusCode: 400, statusMessage: "Cannot edit an advance record" });
    }

    const isOnlyChecking = Object.keys(body).length === 1 && body.is_checked !== undefined;
    if (currentPayment.is_checked && !isOnlyChecking) {
      throw createError({ statusCode: 400, statusMessage: "Registros validados não podem ser editados" });
    }

    // Admins can edit any, bikers can only edit their own
    if (auth.role === "biker") {
      const { data: bikerRecord } = await supabase.from("Entregadores").select("id").eq("userId", auth.id).single();
      if (!bikerRecord || bikerRecord.id !== currentPayment.biker_id) {
        throw createError({ statusCode: 403, statusMessage: "Forbidden" });
      }
    }

    const updateData: any = {
      updated_at: new Date().toISOString()
    };
    if (body.date !== undefined) updateData.date = body.date;
    if (body.company_id !== undefined) updateData.company_id = body.company_id;
    if (body.amount !== undefined) updateData.amount = body.amount;
    if (body.total_deliveries !== undefined) updateData.total_deliveries = body.total_deliveries;
    if (body.image_url !== undefined) updateData.image_url = body.image_url;
    if (body.is_checked !== undefined && auth.role === "admin") updateData.is_checked = body.is_checked;

    const { error: updErr } = await supabase
      .from("biker_payments")
      .update(updateData)
      .eq("id", id);

    if (updErr) throw updErr;

    return { success: true };
  } catch (error: any) {
    if (error.statusCode) throw error;
    console.error("Error updating biker payment:", error);
    throw createError({ statusCode: 500, statusMessage: "Failed to update payment" });
  }
});
