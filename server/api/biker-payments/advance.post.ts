import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";

export default defineEventHandler(async (event) => {
  try {
    const auth = requireAuth(event);

    if (auth.role !== "admin") {
      throw createError({ statusCode: 403, statusMessage: "Admin only" });
    }

    const body = await readBody(event);
    const bikerId = body.biker_id as string;
    const amount = Number(body.amount);
    const date = body.date as string; // YYYY-MM-DD — determines the week

    if (!bikerId) {
      throw createError({ statusCode: 400, statusMessage: "biker_id is required" });
    }
    if (!amount || amount <= 0) {
      throw createError({ statusCode: 400, statusMessage: "Invalid amount" });
    }
    if (!date) {
      throw createError({ statusCode: 400, statusMessage: "date is required" });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseKey) throw new Error("Missing Supabase configuration");

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Verify biker exists
    const { data: biker, error: bikerErr } = await supabase
      .from("Entregadores")
      .select("id")
      .eq("id", bikerId)
      .single();

    if (bikerErr || !biker) {
      throw createError({ statusCode: 404, statusMessage: "Biker not found" });
    }

    // Insert as a biker_payments record with is_advance = true
    const { data: record, error: insertErr } = await supabase
      .from("biker_payments")
      .insert({
        id: randomUUID(),
        biker_id: bikerId,
        company_id: null,
        date,
        amount,
        total_deliveries: 0,
        is_advance: true,
        is_paid: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (insertErr) {
      console.error("Error inserting advance record:", insertErr);
      throw createError({ statusCode: 500, statusMessage: "Failed to create advance record" });
    }

    return { success: true, data: record };
  } catch (error: any) {
    if (error.statusCode) throw error;
    console.error("Error creating advance:", error);
    throw createError({ statusCode: 500, statusMessage: "Failed to create advance" });
  }
});
