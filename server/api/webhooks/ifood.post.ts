import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";
import { fetchIfoodOrderDetails, acknowledgeIfoodOrder } from "../../utils/ifood";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  
  // 1. Initial Checks
  if (!body.merchantId || !body.orderId) {
    return { status: "ignored", message: "Missing required fields" };
  }

  // 2. Identify Local Company
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY; // Service key for global lookup

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase configuration");
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data: company, error: companyError } = await supabase
    .from("Company")
    .select("id, name")
    .eq("ifood_merchant_id", body.merchantId)
    .single();

  if (companyError || !company) {
    console.error(`Company not found for iFood merchant ID: ${body.merchantId}`);
    return { status: "ignored", message: "Merchant not found in local DB" };
  }

  // 3. Process Events
  // iFood typically sends simple events: "PLC" (Placed), "CAN" (Cancelled), etc.
  if (body.fullCode !== "PLACED" && body.code !== "PLC") {
    return { status: "ignored", message: "Event not handled: " + (body.fullCode || body.code) };
  }

  // 4. Fetch Order Details from iFood
  try {
    const ifoodOrder = await fetchIfoodOrderDetails(body.orderId);
    
    // Check if order already exists
    const { data: existingOrder } = await supabase
      .from("orders")
      .select("id")
      .eq("ifood_order_id", body.orderId)
      .single();

    if (existingOrder) {
      return { status: "ignored", message: "Order already synced" };
    }

    // 5. Map and Save Order
    const orderId = randomUUID();
    const pickupCode = Math.floor(100 + Math.random() * 900).toString();

    const { error: orderError } = await supabase
      .from("orders")
      .insert({
        id: orderId,
        company_id: company.id,
        ifood_order_id: body.orderId,
        customer_name: ifoodOrder.customer?.name || "Cliente iFood",
        customer_phone: ifoodOrder.customer?.phone?.number || null,
        total: ifoodOrder.payments?.total?.value || 0,
        status: "pending",
        delivery_fee: ifoodOrder.total?.deliveryFee?.value || 0,
        pickup_code: pickupCode,
        notes: ifoodOrder.notes || null,
        createdAt: new Date().toISOString(),
      });

    if (orderError) throw orderError;

    // 6. Map and Save Items
    const items = (ifoodOrder.items || []).map((item: any) => ({
      id: randomUUID(),
      order_id: orderId,
      dish_name: item.name,
      quantity: item.quantity,
      unit_price: item.unitPrice,
      total_price: item.totalPrice,
      customizations: { ifood_details: item.options || [] },
    }));

    if (items.length > 0) {
      await supabase.from("order_items").insert(items);
    }

    // 7. Acknowledge Receipt to iFood
    await acknowledgeIfoodOrder(body.orderId);

    return { status: "success", localOrderId: orderId };
  } catch (error: any) {
    console.error("Error syncing iFood order:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to sync order",
    });
  }
});
