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
      role: string;
    };

    const body = await readBody(event);
    const { name, email, phone } = body;

    if (!name?.trim() || !email?.trim()) {
      throw createError({ statusCode: 400, statusMessage: "Name and email are required" });
    }

    const supabaseUrl = process.env.SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_ANON_KEY!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const updateData: Record<string, any> = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
    };

    if (decoded.role === "biker") {
      if (phone !== undefined) updateData.phone = phone?.trim() || null;
      const { error } = await supabase
        .from("users")
        .update(updateData)
        .eq("id", decoded.id);

      if (error) throw error;
    } else {
      if (phone !== undefined) updateData.phone = phone?.trim() || null;
      const { error } = await supabase
        .from("Admins")
        .update(updateData)
        .eq("id", decoded.id);

      if (error) throw error;
    }

    return { success: true, message: "Profile updated successfully" };
  } catch (error: any) {
    if (error?.statusCode) throw error;
    console.error("Profile update error:", error);
    throw createError({ statusCode: 500, statusMessage: "Failed to update profile" });
  }
});
