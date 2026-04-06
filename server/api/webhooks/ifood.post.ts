import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";
import { fetchIfoodOrderDetails, acknowledgeIfoodOrder } from "../../utils/ifood";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  console.log('📦 iFood Webhook Received:', JSON.stringify(body, null, 2));

  // 1. Initial Validation
  if (!body.merchantId || !body.orderId) {
    console.warn('⚠️ iFood Webhook ignored: Missing merchantId or orderId');
    return { status: "ignored", message: "Missing required fields" };
  }

  // 2. Acknowledge Receipt Immediately
  // This satisfies iFood's <5s response requirement.
  setResponseStatus(event, 202);

  // 3. Process the Sync in the Background
  // event.waitUntil is supported by Nitro/Nuxt for serverless environments.
  event.waitUntil((async () => {
    try {
      const supabaseUrl = process.env.SUPABASE_URL;
      const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

      if (!supabaseUrl || !supabaseKey) {
        console.error("❌ ERROR: Missing Supabase configuration in .env");
        return;
      }

      const supabase = createClient(supabaseUrl, supabaseKey);

      console.log(`🔍 Syncing iFood order ${body.orderId} for merchant ${body.merchantId}...`);

      // Identify Local Company
      const { data: company, error: companyError } = await supabase
        .from("Company")
        .select("id, name")
        .eq("ifood_merchant_id", body.merchantId)
        .single();

      if (companyError || !company) {
        console.error(`❌ ERROR: Merchant ${body.merchantId} not found in local DB.`);
        return;
      }

      // Check event type
      const eventCode = body.fullCode || body.code;
      if (eventCode !== "PLACED" && eventCode !== "PLC") {
        console.log(`ℹ️ Event skipped: ${eventCode}`);
        return;
      }

      // Fetch Order Details
      const ifoodOrder = await fetchIfoodOrderDetails(body.orderId);
      
      // Check for duplicates
      const { data: existingOrder } = await supabase
        .from("orders")
        .select("id")
        .eq("ifood_order_id", body.orderId)
        .single();

      if (existingOrder) {
        console.warn(`⚠️ Order ${body.orderId} already synced. Skipping.`);
        return;
      }

      // Save Order
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

      // Save Items
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

      // Acknowledge to iFood
      await acknowledgeIfoodOrder(body.orderId);

      console.log(`✨ SUCCESS: iFood order ${body.orderId} synced as ${orderId}`);
    } catch (error: any) {
      console.error(`❌ ERROR syncing iFood order ${body.orderId}:`, error.message || error);
    }
  })());

  return { status: "accepted", orderId: body.orderId };
});
