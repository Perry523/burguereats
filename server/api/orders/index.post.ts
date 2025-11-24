import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const {
      company_id,
      customer_name,
      customer_phone,
      customer_address,
      items,
      total,
      notes,
    } = body;

    if (
      !company_id ||
      !customer_name ||
      !customer_phone ||
      !items ||
      !Array.isArray(items) ||
      items.length === 0 ||
      total === undefined
    ) {
      throw new Error("Missing required fields");
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase configuration");
    }

    // Use service key to bypass RLS
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Create order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert([
        {
          company_id,
          customer_name,
          customer_phone,
          customer_address,
          total,
          notes: notes || null,
          status: "waiting",
          pickup_code: Math.floor(Math.random() * 900 + 100).toString(),
        },
      ])
      .select()
      .single();

    if (orderError) throw orderError;

    // Create order items
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      dish_id: item.dish_id || null,
      dish_name: item.dish_name,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_price: item.total_price,
      customizations: item.customizations || null,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) throw itemsError;

    return {
      success: true,
      data: order,
    };
  } catch (error: any) {
    console.error("Error creating order:", error);
    return { success: false, error: error.message };
  }
});
