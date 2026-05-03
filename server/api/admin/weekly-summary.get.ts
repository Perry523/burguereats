import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  try {
    const auth = requireAuth(event);

    if (auth.role !== "admin") {
      throw createError({ statusCode: 403, statusMessage: "Admin only" });
    }

    const query = getQuery(event);
    const dateFrom = query.dateFrom as string | undefined;
    const dateTo = query.dateTo as string | undefined;
    const companyId = query.companyId as string | undefined;

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseKey) throw new Error("Missing Supabase configuration");

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Build query for biker_payments in the date range
    let paymentsQuery = supabase
      .from("biker_payments")
      .select("id, biker_id, company_id, date, amount, total_deliveries, is_paid");

    if (dateFrom && dateTo) {
      paymentsQuery = paymentsQuery.gte("date", dateFrom).lte("date", dateTo);
    }

    if (companyId) {
      paymentsQuery = paymentsQuery.eq("company_id", companyId);
    }

    const { data: payments, error: payErr } = await paymentsQuery;
    if (payErr) throw payErr;

    const allPayments = payments || [];

    // Gross total
    const grossTotal = allPayments.reduce((acc, p) => acc + (Number(p.amount) || 0), 0);

    // Get unique biker IDs
    const bikerIds = [...new Set(allPayments.map((p) => p.biker_id).filter(Boolean))];

    // Fetch biker names
    let bikerMap: Record<string, string> = {};
    if (bikerIds.length > 0) {
      const { data: bikers } = await supabase
        .from("Entregadores")
        .select("id, name")
        .in("id", bikerIds);
      if (bikers) {
        for (const b of bikers) bikerMap[b.id] = b.name;
      }
    }

    // Get unique company IDs and names
    const companyIds = [...new Set(allPayments.map((p) => p.company_id).filter(Boolean))];
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

    // Day of week mapping (0=Sun...6=Sat)
    const dayLabels = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

    // Group by biker
    const bikerGroupMap: Record<string, {
      bikerId: string;
      bikerName: string;
      gross: number;
      totalDeliveries: number;
      days: Set<string>;
      records: number;
    }> = {};

    allPayments.forEach((p) => {
      if (!bikerGroupMap[p.biker_id]) {
        bikerGroupMap[p.biker_id] = {
          bikerId: p.biker_id,
          bikerName: bikerMap[p.biker_id] || "Desconhecido",
          gross: 0,
          totalDeliveries: 0,
          days: new Set(),
          records: 0,
        };
      }
      const group = bikerGroupMap[p.biker_id];
      group.gross += Number(p.amount) || 0;
      group.totalDeliveries += Number(p.total_deliveries) || 0;
      group.records++;

      // Parse date and get day of week
      if (p.date) {
        const [y, m, d] = p.date.split("-").map(Number);
        const dateObj = new Date(y, m - 1, d);
        const dayIndex = dateObj.getDay();
        group.days.add(dayLabels[dayIndex]);
      }
    });

    // Convert to array sorted by gross descending
    const bikers = Object.values(bikerGroupMap)
      .map((g) => ({
        bikerId: g.bikerId,
        bikerName: g.bikerName,
        gross: g.gross,
        totalDeliveries: g.totalDeliveries,
        records: g.records,
        days: Array.from(g.days),
      }))
      .sort((a, b) => b.gross - a.gross);

    // Company breakdown (when no specific company filter)
    const companyBreakdown: { companyId: string; companyName: string; gross: number; bikerCount: number }[] = [];
    if (!companyId) {
      const companyGroupMap: Record<string, { companyId: string; companyName: string; gross: number; bikerIds: Set<string> }> = {};
      allPayments.forEach((p) => {
        if (!companyGroupMap[p.company_id]) {
          companyGroupMap[p.company_id] = {
            companyId: p.company_id,
            companyName: companyMap[p.company_id] || "Desconhecida",
            gross: 0,
            bikerIds: new Set(),
          };
        }
        const cg = companyGroupMap[p.company_id];
        cg.gross += Number(p.amount) || 0;
        cg.bikerIds.add(p.biker_id);
      });

      Object.values(companyGroupMap)
        .sort((a, b) => b.gross - a.gross)
        .forEach((cg) => {
          companyBreakdown.push({
            companyId: cg.companyId,
            companyName: cg.companyName,
            gross: cg.gross,
            bikerCount: cg.bikerIds.size,
          });
        });
    }

    // Fetch all companies for the filter dropdown
    const { data: allCompanies } = await supabase
      .from("Company")
      .select("id, name")
      .order("name");

    return {
      success: true,
      data: {
        grossTotal,
        totalRecords: allPayments.length,
        bikers,
        companyBreakdown,
        companies: allCompanies || [],
        selectedCompanyName: companyId ? (companyMap[companyId] || "Desconhecida") : null,
      },
    };
  } catch (error: any) {
    if (error.statusCode) throw error;
    console.error("Error fetching weekly summary:", error);
    throw createError({ statusCode: 500, statusMessage: "Failed to fetch weekly summary" });
  }
});
