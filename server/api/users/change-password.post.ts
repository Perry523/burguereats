import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
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
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      throw createError({ statusCode: 400, statusMessage: "Current and new password are required" });
    }

    if (newPassword.length < 6) {
      throw createError({ statusCode: 400, statusMessage: "New password must be at least 6 characters" });
    }

    const supabaseUrl = process.env.SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_ANON_KEY!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    let storedPassword: string | null = null;
    const table = decoded.role === "biker" ? "users" : "Admins";
    const passwordField = decoded.role === "biker" ? "password_hash" : "password";

    const { data: userData, error: fetchError } = await supabase
      .from(table)
      .select(passwordField)
      .eq("id", decoded.id)
      .single();

    if (fetchError || !userData) {
      throw createError({ statusCode: 404, statusMessage: "User not found" });
    }

    storedPassword = (userData as any)[passwordField];

    if (!storedPassword) {
      throw createError({ statusCode: 400, statusMessage: "No password set" });
    }

    const isValid = await bcrypt.compare(currentPassword, storedPassword);
    if (!isValid) {
      throw createError({ statusCode: 401, statusMessage: "Current password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const { error: updateError } = await supabase
      .from(table)
      .update({ [passwordField]: hashedPassword })
      .eq("id", decoded.id);

    if (updateError) throw updateError;

    return { success: true, message: "Password changed successfully" };
  } catch (error: any) {
    if (error?.statusCode) throw error;
    console.error("Change password error:", error);
    throw createError({ statusCode: 500, statusMessage: "Failed to change password" });
  }
});
