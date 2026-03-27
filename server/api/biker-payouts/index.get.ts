import { createClient } from "@supabase/supabase-js";
import dayjs from "dayjs";

export default defineEventHandler(async (event) => {
  try {
    const auth = requireAuth(event);
    const q = getQuery(event);
    const dateRange = q.dateRange as string | undefined;
    const bikerId = q.bikerId as string | undefined;

    if (!auth || (auth.role !== "admin" && auth.role !== "biker")) {
      throw createError({ statusCode: 403, statusMessage: "Forbidden" });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseKey) throw new Error("Missing Supabase configuration");
    const supabase = createClient(supabaseUrl, supabaseKey);

    let query = supabase
      .from("biker_payouts")
      .select(`
        id,
        biker_id,
        amount_paid,
        discounts,
        delivery_fee_total,
        type,
        date,
        created_at,
        Entregadores (
          id,
          name,
          userId
        )
      `)
      .order("created_at", { ascending: false });

    // If role is biker, force filter by their biker record id.
    if (auth.role === "biker") {
      const { data: bikerRecord } = await supabase
        .from("Entregadores")
        .select("id")
        .eq("userId", auth.id)
        .single();
        
      if (!bikerRecord) {
        return { success: true, data: [] };
      }
      query = query.eq("biker_id", bikerRecord.id);
    } else if (bikerId && bikerId !== "all") {
        // Admin can filter by biker
        query = query.eq("biker_id", bikerId);
    }

    // Date Range Filter
    if (dateRange && dateRange !== "all") {
        const now = dayjs();
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
        }

        if (dateFrom) {
            query = query.gte("created_at", dateFrom).lte("created_at", dateTo);
        }
    }

    const { data: payouts, error } = await query;
    if (error) throw error;

    const formattedData = (payouts || []).map((p: any) => ({
      id: p.id,
      biker_id: p.biker_id,
      amount_paid: Number(p.amount_paid) || 0,
      discounts: Number(p.discounts) || 0,
      delivery_fee_total: Number(p.delivery_fee_total) || 0,
      type: p.type || "settlement",
      date: p.date,
      created_at: p.created_at,
      biker_name: p.Entregadores?.name || "Desconhecido"
    }));

    return { success: true, data: formattedData };
  } catch (error: any) {
    if (error.statusCode) throw error;
    console.error("Error fetching biker payouts:", error);
    throw createError({ statusCode: 500, statusMessage: "Failed to fetch payouts" });
  }
});
