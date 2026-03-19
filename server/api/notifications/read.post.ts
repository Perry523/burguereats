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

    const body = await readBody(event);
    const { notificationId } = body;

    const supabaseUrl = process.env.SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_ANON_KEY!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    if (notificationId) {
      // Mark a single notification as read
      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("id", notificationId)
        .eq("user_id", decoded.id);

      if (error) throw error;
    } else {
      // Mark all notifications as read
      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("user_id", decoded.id)
        .eq("read", false);

      if (error) throw error;
    }

    return { success: true };
  } catch (error: any) {
    if (error?.statusCode) throw error;
    console.error("Mark read error:", error);
    throw createError({ statusCode: 500, statusMessage: "Failed to mark notification(s) as read" });
  }
});
