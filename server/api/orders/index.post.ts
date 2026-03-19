import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    if (!body.companyId) {
      throw createError({ statusCode: 400, statusMessage: "Company ID is required" });
    }

    // customer_name is optional now — orders are linked via client_id

    const dishItems: any[] = Array.isArray(body.items) ? body.items : [];
    const productItems: any[] = Array.isArray(body.product_items) ? body.product_items : [];

    if (dishItems.length === 0 && productItems.length === 0) {
      throw createError({ statusCode: 400, statusMessage: "Order must contain at least one item" });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

    if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
      throw new Error("Missing Supabase configuration");
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    // Service client used to bypass RLS for stock deduction
    const supabaseService = createClient(supabaseUrl, supabaseServiceKey);

    // 1. Calculate total from all items
    let calculatedTotal = 0;

    for (const item of dishItems) {
      let itemTotal = item.unit_price * item.quantity;
      if (Array.isArray(item.customizations?.selections)) {
        for (const rawSelection of item.customizations.selections) {
          const selectionPrice = typeof rawSelection.price === "number" ? rawSelection.price : 0;
          itemTotal += selectionPrice * item.quantity;
        }
      }
      calculatedTotal += itemTotal;
    }

    for (const item of productItems) {
      calculatedTotal += item.unit_price * item.quantity;
    }

    if (Math.abs(calculatedTotal - (body.total ?? 0)) > 0.01) {
      console.warn(`Total mismatch: Calculated ${calculatedTotal}, Received ${body.total}. Using calculated.`);
    }

    const orderId = randomUUID();
    const pickupCode = Math.floor(100 + Math.random() * 900).toString();

    // 2. Insert main Order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert([
        {
          id: orderId,
          company_id: body.companyId,
          client_id: body.client_id || null,
          customer_name: body.customer_name?.trim() || null,
          customer_phone: body.customer_phone?.trim() || null,
          customer_address: body.customer_address?.trim() || null,
          total: calculatedTotal,
          status: body.status || "pending",
          notes: body.notes?.trim() || null,
          biker_id: body.biker_id || null,
          delivery_fee: body.delivery_fee || 0,
          pickup_code: pickupCode,
        },
      ])
      .select()
      .single();

    if (orderError) throw orderError;

    // 3. Build order_items from both dishes and products
    const allOrderItems: any[] = [];

    for (const item of dishItems) {
      let itemTotal = item.unit_price * item.quantity;
      if (Array.isArray(item.customizations?.selections)) {
        for (const rawSelection of item.customizations.selections) {
          const selectionPrice = typeof rawSelection.price === "number" ? rawSelection.price : 0;
          itemTotal += selectionPrice * item.quantity;
        }
      }
      allOrderItems.push({
        id: randomUUID(),
        order_id: orderId,
        dish_id: item.dish_id,
        dish_name: item.dish_name,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: itemTotal,
        customizations: item.customizations || {},
      });
    }

    for (const item of productItems) {
      allOrderItems.push({
        id: randomUUID(),
        order_id: orderId,
        product_id: item.product_id,
        dish_name: item.product_name, // reuse dish_name column for display
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.unit_price * item.quantity,
        customizations: {},
      });
    }

    if (allOrderItems.length > 0) {
      const { error: itemsError } = await supabase.from("order_items").insert(allOrderItems);
      if (itemsError) throw itemsError;
    }

    // 4. Deduct stock for product items (service key bypasses RLS)
    for (const item of productItems) {
      const { error: stockError } = await supabaseService.rpc("decrement_product_stock", {
        p_product_id: item.product_id,
        p_qty: item.quantity,
      });
      if (stockError) {
        console.error(`Stock deduction failed for product ${item.product_id}:`, stockError);
      }
    }

    return { success: true, data: order };
  } catch (error: any) {
    console.error("Error creating order:", error);

    if (error?.code === "23503") {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid relation. Check if company ID or item IDs exist.",
      });
    }

    throw createError({ statusCode: 500, statusMessage: "Failed to create order" });
  }
});
