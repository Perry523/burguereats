import { createClient } from "@supabase/supabase-js";
import dayjs from "dayjs";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const bikerId = query.bikerId as string;

    if (!bikerId) {
      throw createError({
        statusCode: 400,
        statusMessage: "Biker ID is required",
      });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase configuration");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // 1. Get deliveries count
    const { data: allOrders, error: ordersError } = await supabase
      .from("orders")
      .select("*")
      .eq("biker_id", bikerId);

    if (ordersError) throw ordersError;

    const today = dayjs().startOf('day');
    
    const stats = {
      totalDeliveries: allOrders.length,
      pendingDeliveries: allOrders.filter(o => ['pending', 'preparing'].includes(o.status)).length,
      completedToday: allOrders.filter(o => o.status === 'completed' && dayjs(o.created_at).isAfter(today)).length,
      recentDeliveries: allOrders
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5)
    };

    return {
      success: true,
      data: stats
    };
  } catch (error: any) {
    console.error("Error fetching biker stats:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch stats",
    });
  }
});
