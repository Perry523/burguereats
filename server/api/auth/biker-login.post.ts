import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

/**
 * Dedicated biker login endpoint for the mobile app.
 * Returns the JWT token in the response body so the mobile app
 * can store it in SecureStore and send it as a Bearer token.
 */
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    const normalizedEmail = body.email?.trim().toLowerCase();

    if (!normalizedEmail || !body.password) {
      throw createError({
        statusCode: 400,
        statusMessage: "Email e senha são obrigatórios",
      });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase configuration");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Only search in users table for bikers
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("*")
      .ilike("email", normalizedEmail)
      .eq("type", "biker")
      .single();

    if (!user || userError) {
      throw createError({
        statusCode: 401,
        statusMessage: "Email ou senha inválidos",
      });
    }

    // Verify password
    const storedPassword = user.password_hash;

    if (!storedPassword) {
      throw createError({
        statusCode: 401,
        statusMessage: "Email ou senha inválidos",
      });
    }

    const isPasswordValid = await bcrypt.compare(body.password, storedPassword);

    if (!isPasswordValid) {
      throw createError({
        statusCode: 401,
        statusMessage: "Email ou senha inválidos",
      });
    }

    // Fetch the biker's Entregadores record to get companyId
    let companyId = null;
    const { data: bikerRecord } = await supabase
      .from("Entregadores")
      .select("companyId")
      .eq("userId", user.id)
      .single();

    companyId = bikerRecord?.companyId;

    // Fetch Company info
    let company = null;
    if (companyId) {
      const { data: companyData } = await supabase
        .from("Company")
        .select("*")
        .eq("id", companyId)
        .single();
      company = companyData;
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        companyId: companyId,
        role: "biker",
      },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "30d" } // Longer expiry for mobile
    );

    // Also set cookie for web compatibility
    setCookie(event, "auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });

    return {
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        companyId: companyId,
        company: company
          ? {
              id: company.id,
              name: company.name,
              email: company.email,
              type: company.type,
              logo: company.logo,
            }
          : null,
        role: "biker" as const,
        token: token,
      },
    };
  } catch (error) {
    if (error && (error as any).statusCode) {
      throw error;
    }

    console.error("Biker login error:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Falha ao fazer login",
    });
  }
});
