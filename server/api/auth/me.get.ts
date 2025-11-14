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
    const { data: admin, error: adminError } = await supabase
      .from("Admins")
      .select("*")
      .eq("id", decoded.id)
      .single();

    if (adminError || !admin) {
      throw createError({
        statusCode: 401,
        statusMessage: "Admin not found",
      });
    }

    const { data: company } = await supabase
      .from("Company")
      .select("*")
      .eq("id", admin.companyId)
      .single();

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
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }
});
