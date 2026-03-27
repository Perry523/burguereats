import { createClient } from "@supabase/supabase-js";
import dayjs from "dayjs";

export default defineEventHandler(async (event) => {
  try {
    const auth = requireAuth(event);
    const query = getQuery(event);
    let companyId = query.companyId as string;
    const bikerId = query.bikerId as string | undefined;
    const dateRange = query.dateRange as string | undefined;

    // Enforcement: Managers can only see their own company's stats
    if (auth.role === 'manager') {
      companyId = auth.companyId as string;
    }

    if (!companyId && auth.role !== 'admin') {
      throw createError({
        statusCode: 400,
        statusMessage: "Company ID is required",
      });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase configuration");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Build the query
    let ordersQuery = supabase
      .from("orders")
      .select("*, Entregadores(name)")
      .not("biker_id", "is", null);

    if (companyId) {
      ordersQuery = ordersQuery.eq("company_id", companyId);
    }

    // Biker filter
    if (bikerId && bikerId !== "all") {
      ordersQuery = ordersQuery.eq("biker_id", bikerId);
    }

    // Date Range filter
    const now = dayjs();
    if (dateRange && dateRange !== "all") {
      let dateFrom;
      let dateTo = now.endOf("day").toISOString();
      
      switch (dateRange) {
        case "today":
          dateFrom = now.startOf("day").toISOString();
          break;
        case "yesterday":
          dateFrom = now.subtract(1, "day").startOf("day").toISOString();
          dateTo = now.subtract(1, "day").endOf("day").toISOString();
          break;
        case "last_week":
          dateFrom = now.subtract(7, "day").startOf("day").toISOString();
          break;
        case "last_month":
          dateFrom = now.subtract(1, "month").startOf("day").toISOString();
          break;
        default:
          dateFrom = null;
      }

      if (dateFrom) {
        ordersQuery = ordersQuery.gte("created_at", dateFrom).lte("created_at", dateTo);
      }
    }

    const { data: allOrders, error: ordersError } = await ordersQuery;

    if (ordersError) throw ordersError;

    // Calculate stats
    let totalEarned = 0;
    let totalSpent = 0;

    const completedOrders = (allOrders || []).filter(o => o.status === "completed" || o.status === "delivering");

    completedOrders.forEach(order => {
      totalEarned += order.total || 0;
      totalSpent += order.delivery_fee || 0;
    });

    const recentDeliveries = (allOrders || [])
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 10);

    // Extra financial stats if a specific biker is selected
    let financial = null;
    if (bikerId && bikerId !== "all") {
      const { data: b } = await supabase
        .from("Entregadores")
        .select("wallet, advance_money")
        .eq("id", bikerId)
        .single();
      
      if (b) {
        // Unpaid delivery fee sum from biker_payments
        const { data: unpaidPayments } = await supabase
          .from("biker_payments")
          .select("total_deliveries")
          .eq("biker_id", bikerId)
          .eq("is_paid", false);
        
        let unpaidDeliveriesCount = 0;
        (unpaidPayments || []).forEach(p => unpaidDeliveriesCount += (Number(p.total_deliveries) || 0));
        
        const wallet = Number(b.wallet) || 0;
        const advances = Number(b.advance_money) || 0;
        const totalFees = unpaidDeliveriesCount * 1;
        
        financial = {
          wallet,
          advances,
          totalFees,
          netPay: wallet - advances - totalFees
        };
      }
    }

    const stats = {
      totalDeliveries: (allOrders || []).length, // total orders given to bikers
      completedDeliveries: completedOrders.length,
      totalEarned,
      totalSpent,
      recentDeliveries,
      financial
    };

    return {
      success: true,
      data: stats
    };
  } catch (error: any) {
    if (error.statusCode) throw error;
    console.error("Error fetching admin biker stats:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch stats",
    });
  }
});
