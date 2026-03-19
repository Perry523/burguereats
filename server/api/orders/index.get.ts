import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const companyId = query.companyId as string | undefined;
    const status = query.status as string | undefined;
    const clientId = query.clientId as string | undefined;
    const bikerId = query.bikerId as string | undefined;
    const dateFrom = query.dateFrom as string | undefined;
    const dateTo = query.dateTo as string | undefined;

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase configuration");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    let ordersQuery = supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (companyId) {
      ordersQuery = ordersQuery.eq("company_id", companyId);
    }

    if (clientId) {
      ordersQuery = ordersQuery.eq("client_id", clientId);
    }

    if (bikerId) {
      ordersQuery = ordersQuery.eq("biker_id", bikerId);
    }

    if (status) {
      ordersQuery = ordersQuery.eq("status", status);
    }

    if (dateFrom) {
      ordersQuery = ordersQuery.gte("created_at", dateFrom);
    }

    if (dateTo) {
      ordersQuery = ordersQuery.lte("created_at", dateTo);
    }

    const { data: orders, error } = await ordersQuery;

    if (error) throw error;

    return {
      success: true,
      data: orders || [],
    };
  } catch (error) {
    console.error("Error fetching orders:", error);
    return { success: false, data: [] };
  }
});
