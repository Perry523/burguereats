import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    if (!body.email || !body.password) {
      throw createError({
        statusCode: 400,
        statusMessage: "Email and password are required",
      });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase configuration");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data: admin, error: adminError } = await supabase
      .from("Admins")
      .select("*")
      .eq("email", body.email)
      .single();

    if (adminError || !admin) {
      throw createError({
        statusCode: 401,
        statusMessage: "Invalid email or password",
      });
    }

    if (!admin.isActive) {
      throw createError({
        statusCode: 403,
        statusMessage: "Admin account is inactive",
      });
    }

    const isPasswordValid = await bcrypt.compare(body.password, admin.password);

    if (!isPasswordValid) {
      throw createError({
        statusCode: 401,
        statusMessage: "Invalid email or password",
      });
    }

    const { data: company } = await supabase
      .from("Company")
      .select("*")
      .eq("id", admin.companyId)
      .single();

    const token = jwt.sign(
      {
        id: admin.id,
        email: admin.email,
        companyId: admin.companyId,
      },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "7d" }
    );

    setCookie(event, "auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return {
      success: true,
      data: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        company: company,
      },
    };
  } catch (error) {
    if (error) {
      throw error;
    }

    console.error("Login error:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to login",
    });
  }
});
