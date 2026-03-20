import jwt from "jsonwebtoken";
import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  try {
    const token = getCookie(event, "auth_token");
    if (!token) {
      throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret") as {
      id: string;
    };

    const supabaseUrl = process.env.SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_ANON_KEY!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(decoded.id);

    let query = supabase
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (isUuid) {
      query = query.eq("user_id", decoded.id);
    } else {
      // Decode.companyId exists for admins (from auth token)
      if (!(decoded as any).companyId) {
        return { success: true, data: [] };
      }
      query = query.eq("company_id", (decoded as any).companyId);
    }

    const { data, error } = await query;

    if (error) throw error;

    return { success: true, data: data || [] };
  } catch (error: any) {
    if (error?.statusCode) throw error;
    console.error("Notifications fetch error:", error);
    throw createError({ statusCode: 500, statusMessage: "Failed to fetch notifications" });
  }
});
