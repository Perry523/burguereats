import { createClient } from "@supabase/supabase-js";
import dayjs from "dayjs";

export default defineEventHandler(async (event) => {
  try {
    const auth = requireAuth(event);
    const query = getQuery(event);
    let companyId = query.companyId as string;
    let bikerId = query.bikerId as string | undefined;
    const dateRange = query.dateRange as string | undefined;

    // Enforcement: Managers can only see their own company's stats
    if (auth.role === 'manager') {
      companyId = auth.companyId as string;
    }

    if (!companyId && auth.role !== 'admin' && auth.role !== 'biker') {
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

    if (auth.role === 'biker') {
      const { data: entregador } = await supabase
        .from('Entregadores')
        .select('id')
        .eq('userId', auth.id)
        .single();
      
      if (entregador) {
        bikerId = entregador.id;
      }
    }

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
    
    // --- PAYMENTS QUERY FOR ADMIN STATS ---
    let paymentsQuery = supabase
      .from("biker_payments")
      .select("*")
      .eq("is_paid", false);

    if (companyId) {
      paymentsQuery = paymentsQuery.eq("company_id", companyId);
    }
    if (bikerId && bikerId !== "all") {
      paymentsQuery = paymentsQuery.eq("biker_id", bikerId);
    }
    
    if (dateRange && dateRange !== "all") {
      let dFromStr = "";
      let dToStr = now.endOf("day").format("YYYY-MM-DD");
      switch (dateRange) {
        case "today":
          dFromStr = now.format("YYYY-MM-DD");
          break;
        case "yesterday":
          dFromStr = now.subtract(1, "day").format("YYYY-MM-DD");
          dToStr = dFromStr;
          break;
        case "last_week":
          dFromStr = now.subtract(7, "day").format("YYYY-MM-DD");
          break;
        case "last_month":
          dFromStr = now.subtract(1, "month").format("YYYY-MM-DD");
          break;
      }
      if (dFromStr) {
        paymentsQuery = paymentsQuery.gte("date", dFromStr).lte("date", dToStr);
      }
    }
    // ------------------------------------

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

    const stats: any = {
      totalDeliveries: (allOrders || []).length, // total orders given to bikers
      completedDeliveries: completedOrders.length,
      totalEarned,
      totalSpent,
      recentDeliveries,
      financial
    };

    // --- PROCESS PAYMENTS STATS FOR ADMIN ---
    const { data: pendingPayments } = await paymentsQuery;
    let pendingDeliveriesCount = 0;
    let totalPendingAmount = 0;

    (pendingPayments || []).forEach(p => {
      pendingDeliveriesCount += Number(p.total_deliveries) || 0;
      totalPendingAmount += Number(p.amount) || 0;
    });

    // Advance Money Calculation
    let totalAdvances = 0;
    let advancesQuery = supabase.from("Entregadores").select("id, advance_money");
    
    if (bikerId && bikerId !== "all") {
      advancesQuery = advancesQuery.eq("id", bikerId);
    } else if (companyId) {
      const bIds = [...new Set((pendingPayments || []).map(p => p.biker_id))];
      if (bIds.length > 0) {
        advancesQuery = advancesQuery.in("id", bIds);
      } else {
        advancesQuery = null as any; // Skip querying
      }
    }

    if (advancesQuery) {
      const { data: advancesData } = await advancesQuery;
      (advancesData || []).forEach(b => {
        totalAdvances += Number(b.advance_money) || 0;
      });
    }

    stats.adminStats = {
      pendingDeliveriesCount,
      totalGross: totalPendingAmount,
      totalAdvances,
      totalServiceFee: pendingDeliveriesCount * 1,
      totalNet: totalPendingAmount - (pendingDeliveriesCount * 1) - totalAdvances,
      pendingRegisters: (pendingPayments || []).sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 10)
    };
    // ----------------------------------------

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
