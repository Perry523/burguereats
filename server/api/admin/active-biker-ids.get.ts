import { createClient } from "@supabase/supabase-js";
import dayjs from "dayjs";

export default defineEventHandler(async (event) => {
  try {
    const auth = requireAuth(event);
    
    if (auth.role === 'admin') {
      return { success: true, mode: 'all' };
    }

    if (auth.role !== 'manager') {
       throw createError({ statusCode: 403, statusMessage: "Forbidden" });
    }

    const companyId = auth.companyId as string;
    if (!companyId) {
       throw createError({ statusCode: 400, statusMessage: "Company ID required" });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase configuration");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get today's start and end date
    const now = dayjs();
    const dateToday = now.format("YYYY-MM-DD");

    // Fetch allowed biker IDs that are assigned to this company today
    const { data: assignments, error } = await supabase
      .from("biker_assignments")
      .select("biker_id")
      .eq("company_id", companyId)
      .eq("date", dateToday);

    if (error) throw error;

    const allowedIds = [...new Set((assignments || []).map(a => a.biker_id))];

    // Fetch the raw user ID inside Entregadores because the generic 'biker_id' on Presence is the 'user.id' not the 'Entregadores.id'
    let allowedUserIds: string[] = [];
    if (allowedIds.length > 0) {
      const { data: bikers } = await supabase
        .from("Entregadores")
        .select("id, userId")
        .in("id", allowedIds);
        
      allowedUserIds = (bikers || []).map(b => b.userId);
    }

    return { 
      success: true, 
      mode: 'restricted', 
      allowedIds: allowedUserIds 
    };

  } catch (error: any) {
    if (error.statusCode) throw error;
    console.error("Error fetching active bikers IDs:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch active bikers",
    });
  }
});
