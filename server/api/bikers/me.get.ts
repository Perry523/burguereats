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
    };

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase configuration");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch from Entregadores table using userId
    const { data: biker, error: bikerError } = await supabase
      .from("Entregadores")
      .select("*")
      .eq("userId", decoded.id)
      .single();

    if (bikerError || !biker) {
      throw createError({
        statusCode: 404,
        statusMessage: "Biker profile not found",
      });
    }

    return {
      success: true,
      data: biker,
    };
  } catch (error) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }
});
