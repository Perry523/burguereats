import { createClient } from "@supabase/supabase-js";
import { createNotification } from "~/server/utils/notifications";

export default defineEventHandler(async (event) => {
  try {
    const id = event.context.params?.id;
    const body = await readBody(event);
    const { status, biker_id } = body;

    if (!id) {
      throw new Error("Missing order ID");
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase configuration");
    }

    // Use service key to bypass RLS
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch the current order data before update for comparison
    const { data: currentOrder } = await supabase
      .from("orders")
      .select("*, biker_id, company_id, customer_name")
      .eq("id", id)
      .single();

    const updateData: Record<string, any> = { updated_at: new Date() };
    if (status) updateData.status = status;
    if (biker_id !== undefined) updateData.biker_id = biker_id || null;

    const { data, error } = await supabase
      .from("orders")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    // --- Notification Triggers ---

    // 1. Biker was assigned to an order
    if (biker_id && biker_id !== currentOrder?.biker_id) {
      // Find the biker's userId from the Entregadores table
      const { data: bikerRecord } = await supabase
        .from("Entregadores")
        .select("userId")
        .eq("id", biker_id)
        .single();

      if (bikerRecord?.userId) {
        await createNotification({
          userId: bikerRecord.userId,
          companyId: currentOrder?.company_id,
          title: "Nova entrega atribuída",
          description: `Pedido de ${currentOrder?.customer_name || "cliente"} foi atribuído a você.`,
          type: "order_assigned",
          data: { orderId: id },
        });
      }
    }

    // 2. Order was marked as completed — notify the admin
    if (status === "completed" && currentOrder?.status !== "completed") {
      // Find admin users for this company via the Admins table
      const companyId = currentOrder?.company_id;
      if (companyId) {
        const { data: admins } = await supabase
          .from("Admins")
          .select("id")
          .eq("companyId", companyId);

        if (admins && admins.length > 0) {
          for (const admin of admins) {
            await createNotification({
              userId: admin.id,
              companyId,
              title: "Pedido finalizado",
              description: `Pedido de ${currentOrder?.customer_name || "cliente"} foi finalizado pelo entregador.`,
              type: "order_completed",
              data: { orderId: id },
            });
          }
        }
      }
    }

    return {
      success: true,
      data,
    };
  } catch (error: any) {
    console.error("Error updating order:", error);
    return { success: false, error: error.message };
  }
});
