import jwt from "jsonwebtoken";
import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  try {
    const token = getCookie(event, "auth_token");

    if (!token) {
      throw createError({
        statusCode: 401,
        statusMessage: "Unauthorized",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret") as {
      id: string;
      email: string;
      companyId: string;
    };

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase configuration");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    let userData = null;
    let userType: 'admin' | 'manager' | 'biker' = 'admin';

    // 1. Try finding in Admins table first
    const { data: admin, error: adminError } = await supabase
      .from("Admins")
      .select("*")
      .eq("id", decoded.id)
      .single();

    if (admin && !adminError) {
      userData = admin;
      userType = admin.role || 'manager';
    } else {
      // 2. Try finding in users table (for bikers)
      const { data: user, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", decoded.id)
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
        statusMessage: "User not found",
      });
    }

    // 3. Fetch Company
    let company = null;
    let companyId = null;

    if (userType === 'admin' || userType === 'manager') {
      companyId = userData.companyId;
    } else {
      const { data: bikerRecord } = await supabase
        .from("Entregadores")
        .select("companyId, wallet")
        .eq("userId", userData.id)
        .single();
      
      companyId = bikerRecord?.companyId;
      userData.wallet = Number(bikerRecord?.wallet) || 0;
    }

    if (companyId) {
      const { data: companyData } = await supabase
        .from("Company")
        .select("*")
        .eq("id", companyId)
        .single();
      company = companyData;
    }

    return {
      success: true,
      data: {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        phone: userData.phone || null,
        companyId: companyId,
        company: company,
        role: userType,
        wallet: userData.wallet,
      },
    };
  } catch (error) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }
});
