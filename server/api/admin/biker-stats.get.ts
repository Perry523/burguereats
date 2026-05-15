import { createClient } from "@supabase/supabase-js";
import dayjs from "dayjs";

export default defineEventHandler(async (event) => {
  try {
    const auth = requireAuth(event);
    const query = getQuery(event);
    let companyId = query.companyId as string;
    let bikerId = query.bikerId as string | undefined;
    const dateRange = query.dateRange as string | undefined;
    const dateFrom = query.dateFrom as string | undefined; // yyyy-mm-dd
    const dateTo = query.dateTo as string | undefined; // yyyy-mm-dd

    // Enforcement: Managers can only see their own company's stats
    if (auth.role === "manager") {
      companyId = auth.companyId as string;
    }

    if (!companyId && auth.role !== "admin" && auth.role !== "biker") {
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

    if (auth.role === "biker") {
      const { data: entregador } = await supabase
        .from("Entregadores")
        .select("id")
        .eq("userId", auth.id)
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
    if (dateFrom && dateTo) {
      // Explicit date range from week picker (takes priority)
      ordersQuery = ordersQuery
        .gte("created_at", `${dateFrom}T00:00:00`)
        .lte("created_at", `${dateTo}T23:59:59`);
    } else if (dateRange && dateRange !== "all") {
      let dfrom: string | null = null;
      let dto = now.endOf("day").toISOString();
      switch (dateRange) {
        case "today":
          dfrom = now.startOf("day").toISOString();
          break;
        case "yesterday":
          dfrom = now.subtract(1, "day").startOf("day").toISOString();
          dto = now.subtract(1, "day").endOf("day").toISOString();
          break;
        case "last_week":
          dfrom = now.subtract(7, "day").startOf("day").toISOString();
          break;
        case "last_month":
          dfrom = now.subtract(1, "month").startOf("day").toISOString();
          break;
      }
      if (dfrom)
        ordersQuery = ordersQuery
          .gte("created_at", dfrom)
          .lte("created_at", dto);
    }

    // --- PAYMENTS QUERY FOR ADMIN STATS ---
    let paymentsQuery = supabase.from("biker_payments").select("*");

    if (companyId) {
      paymentsQuery = paymentsQuery.eq("company_id", companyId);
    }
    if (bikerId && bikerId !== "all") {
      paymentsQuery = paymentsQuery.eq("biker_id", bikerId);
    }

    if (dateFrom && dateTo) {
      paymentsQuery = paymentsQuery.gte("date", dateFrom).lte("date", dateTo);
    } else if (dateRange && dateRange !== "all") {
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
      if (dFromStr)
        paymentsQuery = paymentsQuery.gte("date", dFromStr).lte("date", dToStr);
    }
    // ------------------------------------

    const { data: allOrders, error: ordersError } = await ordersQuery;

    if (ordersError) throw ordersError;

    // Calculate stats
    let totalEarned = 0;
    let totalSpent = 0;

    const completedOrders = (allOrders || []).filter(
      (o) => o.status === "completed" || o.status === "delivering",
    );

    completedOrders.forEach((order) => {
      totalEarned += order.total || 0;
      totalSpent += order.delivery_fee || 0;
    });

    const recentDeliveries = (allOrders || [])
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      )
      .slice(0, 10);

    // Extra financial stats if a specific biker is selected
    let financial = null;
    if (bikerId && bikerId !== "all") {
      const { data: b } = await supabase
        .from("Entregadores")
        .select("advance_money")
        .eq("id", bikerId)
        .single();

      if (b) {
        // ── Payments for the selected range (paid + unpaid) ──
        let paymentsQueryBuilder = supabase
          .from("biker_payments")
          .select(
            "id, amount, total_deliveries, is_paid, date, company_id, is_advance",
          )
          .eq("biker_id", bikerId);

        if (dateFrom && dateTo) {
          paymentsQueryBuilder = paymentsQueryBuilder
            .gte("date", dateFrom)
            .lte("date", dateTo);
        }

        const { data: rawPayments, error: payErr } = await paymentsQueryBuilder;
        if (payErr) console.error("payments query error:", payErr);

        const sortedPayments = (rawPayments || []).sort(
          (a: any, b: any) =>
            new Date(b.date).getTime() - new Date(a.date).getTime(),
        );

        // Enrich with company names
        const companyIds = [
          ...new Set(
            sortedPayments.map((p: any) => p.company_id).filter(Boolean),
          ),
        ];
        let companyMap: Record<string, string> = {};
        if (companyIds.length > 0) {
          const { data: companies } = await supabase
            .from("Company")
            .select("id, name")
            .in("id", companyIds);
          if (companies) {
            for (const c of companies) companyMap[c.id] = c.name;
          }
        }

        const weekPayments = sortedPayments.map((p: any) => ({
          ...p,
          company_name: p.is_advance
            ? "Adiantamento"
            : companyMap[p.company_id] || "Adiantamento",
        }));

        // Compute totals from the week's records
        let openPaymentsTotal = 0;
        let unpaidDeliveriesCount = 0;
        let paidTotal = 0;
        let paidCount = 0;
        let advances = 0;

        weekPayments.forEach((p) => {
          if (p.is_advance) {
            // Only count advances that haven't been paid yet as a deduction.
            // Advances already marked as paid were settled in a previous payout
            // and must NOT be subtracted from the current netPay.
            if (!p.is_paid) {
              advances += Number(p.amount) || 0;
            }
          } else {
            if (p.is_paid) {
              paidTotal += Number(p.amount) || 0;
              paidCount++;
            } else {
              openPaymentsTotal += Number(p.amount) || 0;
              unpaidDeliveriesCount += Number(p.total_deliveries) || 0;
            }
          }
        });

        let totalFees = unpaidDeliveriesCount * 1;
        const regularPaymentsCount = weekPayments.filter(
          (p: any) => !p.is_advance,
        ).length;
        const weekPaid =
          regularPaymentsCount > 0 && paidCount === regularPaymentsCount;

        // When the week is paid, fetch the actual net amount from biker_payouts
        // instead of using the gross sum from biker_payments (which doesn't
        // account for advance and delivery fee deductions).
        let actualPaidTotal = paidTotal;
        if (weekPaid && dateFrom && dateTo) {
          const { data: payoutRecord } = await supabase
            .from("biker_payouts")
            .select("amount_paid, discounts, delivery_fee_total")
            .eq("biker_id", bikerId)
            .eq("week_from", dateFrom)
            .eq("week_to", dateTo)
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle();

          if (payoutRecord) {
            actualPaidTotal = Number(payoutRecord.amount_paid) || 0;
            // Also reflect the actual discounts from the payout receipt
            advances = Number(payoutRecord.discounts) || 0;
            totalFees = Number(payoutRecord.delivery_fee_total) || 0;
          }
        }

        financial = {
          wallet: weekPaid ? paidTotal : openPaymentsTotal, // gross for this period
          advances,
          totalFees,
          netPay: weekPaid ? actualPaidTotal : openPaymentsTotal - advances - totalFees,
          weekPaid,
          paidTotal: actualPaidTotal,
          weekPayments,
        };
      }
    }

    const stats: any = {
      totalDeliveries: (allOrders || []).length, // total orders given to bikers
      completedDeliveries: completedOrders.length,
      totalEarned,
      totalSpent,
      recentDeliveries,
      financial,
    };

    // --- PROCESS PAYMENTS STATS FOR ADMIN ---
    const { data: allPayments } = await paymentsQuery;
    let totalDeliveriesCount = 0;
    let pendingDeliveriesCount = 0;
    let totalGrossAmount = 0;
    let totalPendingAmount = 0;
    let totalAdvances = 0;
    let pendingAdvances = 0;

    (allPayments || []).forEach((p) => {
      if (p.is_advance) {
        const amount = Number(p.amount) || 0;
        totalAdvances += amount;
        if (!p.is_paid) {
          pendingAdvances += amount;
        }
      } else {
        const deliveries = Number(p.total_deliveries) || 0;
        const amount = Number(p.amount) || 0;

        totalDeliveriesCount += deliveries;
        totalGrossAmount += amount;

        if (!p.is_paid) {
          pendingDeliveriesCount += deliveries;
          totalPendingAmount += amount;
        }
      }
    });

    stats.adminStats = {
      totalDeliveriesCount,
      pendingDeliveriesCount,
      totalGross: totalGrossAmount,
      totalAdvances,
      pendingAdvances,
      totalServiceFee: pendingDeliveriesCount * 1,
      totalNet:
        totalPendingAmount - pendingDeliveriesCount * 1 - pendingAdvances,
      pendingRegisters: (allPayments || [])
        .filter((p) => !p.is_paid)
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        )
        .slice(0, 10),
    };
    // ----------------------------------------

    return {
      success: true,
      data: stats,
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
