import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";

export default defineEventHandler(async (event) => {
  try {
    const auth = requireAuth(event);

    if (auth.role !== "biker") {
      throw createError({ statusCode: 403, statusMessage: "Bikers only" });
    }

    const body = await readBody(event);
    const { date, amount, total_deliveries, company_id } = body;

    if (!date || amount === undefined || amount === null || !company_id) {
      throw createError({
        statusCode: 400,
        statusMessage: "date, amount and company_id are required",
      });
    }

    if (Number(amount) <= 0) {
      throw createError({ statusCode: 400, statusMessage: "Valor deve ser maior que zero" });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseKey) throw new Error("Missing Supabase configuration");

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Find the Entregadores record
    const { data: bikerRecord, error: bikerErr } = await supabase
      .from("Entregadores")
      .select("id, wallet")
      .eq("userId", auth.id)
      .single();

    if (bikerErr || !bikerRecord) {
      throw createError({ statusCode: 404, statusMessage: "Entregador não encontrado" });
    }

    const bikerId = bikerRecord.id;
    const supabaseKeyService = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;
    const supabaseService = createClient(supabaseUrl, supabaseKeyService);

    // Verify permission: Either has a daily assignment OR has a persistent vinculation
    const { data: assignment } = await supabase
      .from("biker_assignments")
      .select("id")
      .eq("biker_id", bikerId)
      .eq("company_id", company_id)
      .eq("date", date)
      .eq("status", "confirmado")
      .maybeSingle();

    if (!assignment) {
      // If not in scale, check for persistent vinculation (bound)
      const { data: vinculation } = await supabaseService
        .from("biker_companies")
        .select("id")
        .eq("biker_id", bikerId)
        .eq("company_id", company_id)
        .maybeSingle();

      if (!vinculation) {
        throw createError({
          statusCode: 400,
          statusMessage: "Você não possui vínculo nem está escalado para este restaurante nesta data.",
        });
      }
    }

    // Create the payment record
    const { data: payment, error: insertErr } = await supabase
      .from("biker_payments")
      .insert({
        id: randomUUID(),
        biker_id: bikerId,
        company_id,
        date,
        amount: Number(amount),
        total_deliveries: Number(total_deliveries) || 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (insertErr) throw insertErr;

    // Increment wallet
    const newWallet = (Number(bikerRecord.wallet) || 0) + Number(amount);
    const { error: walletErr } = await supabase
      .from("Entregadores")
      .update({ wallet: newWallet })
      .eq("id", bikerId);

    if (walletErr) throw walletErr;

    return { success: true, data: { payment, wallet: newWallet } };
  } catch (error: any) {
    if (error.statusCode) throw error;
    console.error("Error creating biker payment:", error);
    throw createError({ statusCode: 500, statusMessage: "Failed to create payment" });
  }
});
