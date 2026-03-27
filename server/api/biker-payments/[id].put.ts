import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  try {
    const auth = requireAuth(event);

    if (auth.role !== "admin") {
      throw createError({ statusCode: 403, statusMessage: "Admin only" });
    }

    const id = getRouterParam(event, "id");
    const body = await readBody(event);

    if (!id) {
      throw createError({ statusCode: 400, statusMessage: "Biker ID is required" });
    }

    const newAdvance = Number(body.advance_money);
    if (!newAdvance || newAdvance <= 0) {
      throw createError({ statusCode: 400, statusMessage: "Invalid advance_money amount" });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseKey) throw new Error("Missing Supabase configuration");

    const supabase = createClient(supabaseUrl, supabaseKey);

    // 1. Fetch current advance_money
    const { data: currentBiker, error: fetchErr } = await supabase
      .from("Entregadores")
      .select("advance_money")
      .eq("id", id)
      .single();

    if (fetchErr) throw fetchErr;

    const currentTotal = Number(currentBiker?.advance_money || 0);
    const updatedTotal = currentTotal + newAdvance;

    // 2. Update Entregadores
    const { data, error } = await supabase
      .from("Entregadores")
      .update({ advance_money: updatedTotal })
      .eq("id", id)
      .select("id, name, wallet, advance_money")
      .single();

    if (error) throw error;

    // 3. Create a payout record of type 'advance'
    const { error: payoutErr } = await supabase
      .from("biker_payouts")
      .insert([{
        biker_id: id,
        amount_paid: newAdvance,
        discounts: 0,
        delivery_fee_total: 0,
        type: 'advance'
      }]);

    if (payoutErr) console.error("Could not register advance payout:", payoutErr);

    return { success: true, data };
  } catch (error: any) {
    if (error.statusCode) throw error;
    console.error("Error launching advance:", error);
    throw createError({ statusCode: 500, statusMessage: "Failed to launch advance" });
  }
});
