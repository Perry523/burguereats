import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";
import { fetchIfoodOrderDetails, acknowledgeIfoodOrder } from "../../utils/ifood";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  console.log('📦 iFood Webhook Received:', JSON.stringify(body, null, 2));
  
  // 1. Initial Checks
  if (!body.merchantId || !body.orderId) {
    console.warn('⚠️ iFood Webhook ignored: Missing merchantId or orderId');
    return { status: "ignored", message: "Missing required fields" };
  }

  // 2. Identify Local Company
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase configuration in .env");
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  console.log(`🔍 Searching for company with merchant ID: ${body.merchantId}...`);
  const { data: company, error: companyError } = await supabase
    .from("Company")
    .select("id, name")
    .eq("ifood_merchant_id", body.merchantId)
    .single();

  if (companyError || !company) {
    console.error(`❌ Company not found for iFood merchant ID: ${body.merchantId}`);
    return { status: "ignored", message: "Merchant not found in local DB" };
  }

  console.log(`✅ Company found: ${company.name} (${company.id})`);

  // 3. Process Events
  const eventCode = body.fullCode || body.code;
  console.log(`🎫 Processing iFood event: ${eventCode}`);
  
  if (eventCode !== "PLACED" && eventCode !== "PLC") {
    console.log(`ℹ️ Event skipped (not PLACED)`);
    return { status: "ignored", message: "Event not handled: " + eventCode };
  }

  // 4. Fetch Order Details from iFood
  console.log(`📡 Fetching order details for ${body.orderId} from iFood API...`);
  try {
    const ifoodOrder = await fetchIfoodOrderDetails(body.orderId);
    console.log(`📄 iFood Order Details fetched successfully`);
    
    // Check if order already exists
    const { data: existingOrder } = await supabase
      .from("orders")
      .select("id")
      .eq("ifood_order_id", body.orderId)
      .single();

    if (existingOrder) {
      console.warn(`⚠️ Order ${body.orderId} already exists in local DB. Skipping.`);
      return { status: "ignored", message: "Order already synced" };
    }

    // 5. Map and Save Order
    console.log(`💾 Saving new order to database...`);
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
