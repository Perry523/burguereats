import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    const normalizedEmail = body.email.trim().toLowerCase();

    if (!normalizedEmail || !body.password) {
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
    let userData = null;
    let userType: 'admin' | 'biker' = 'admin';

    // 1. Try finding in Admins table first
    const { data: admin, error: adminError } = await supabase
      .from("Admins")
      .select("*")
      .ilike("email", normalizedEmail)
      .single();

    if (admin && !adminError) {
      userData = admin;
      userType = 'admin';
    } else {
      // 2. Try finding in users table (for bikers)
      const { data: user, error: userError } = await supabase
        .from("users")
        .select("*")
        .ilike("email", normalizedEmail)
        .eq("type", "biker")
        .single();

      if (user && !userError) {
        userData = user;
        userType = 'biker';
      }
    }

    if (!userData) {
      throw createError({
        statusCode: 401,
        statusMessage: "Invalid email or password",
      });
    }

    // Check if account is active (Admins have isActive, users might not have it yet or we check finished_register)
    if (userType === 'admin' && !userData.isActive) {
      throw createError({
        statusCode: 403,
        statusMessage: "Admin account is inactive",
      });
    }

    // 3. Verify password
    // Admins use 'password', bikers (users table) use 'password_hash'
    const storedPassword = userType === 'admin' ? userData.password : userData.password_hash;
    
    if (!storedPassword) {
      throw createError({
        statusCode: 401,
        statusMessage: "Invalid email or password",
      });
    }

    const isPasswordValid = await bcrypt.compare(body.password, storedPassword);

    if (!isPasswordValid) {
      throw createError({
        statusCode: 401,
        statusMessage: "Invalid email or password",
      });
    }

    // 4. Fetch Company
    let company = null;
    let companyId = null;

    if (userType === 'admin') {
      companyId = userData.companyId;
    } else {
      // For bikers, we need to find their Entregadores record to get the companyId
      const { data: bikerRecord } = await supabase
        .from("Entregadores")
        .select("companyId")
        .eq("userId", userData.id)
        .single();
      
      companyId = bikerRecord?.companyId;
    }

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
        id: userData.id,
        email: userData.email,
        companyId: companyId,
        role: userType === 'admin' ? 'admin' : 'biker',
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
        id: userData.id,
        email: userData.email,
        name: userData.name,
        company: company,
        role: userType,
      },
    };
  } catch (error) {
    if (error && (error as any).statusCode) {
      throw error;
    }

    console.error("Login error:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to login",
    });
  }
});
