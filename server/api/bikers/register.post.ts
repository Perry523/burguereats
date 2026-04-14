import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";
import bcrypt from "bcrypt";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    console.log("Registration request body:", body);

    const email = body.email?.trim().toLowerCase();
    const phone = body.phone?.trim();
    const password = body.password;

    if (!email || !phone || !password) {
      throw createError({
        statusCode: 400,
        statusMessage: "Email, phone, and password are required",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase configuration");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // 0. Check if email already exists in either table
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .ilike("email", email)
      .maybeSingle();

    const { data: existingEntregador } = await supabase
      .from("Entregadores")
      .select("id")
      .ilike("email", email)
      .maybeSingle();

    if (existingUser || existingEntregador) {
        throw createError({
            statusCode: 400,
            statusMessage: "Email already exists.",
        });
    }

    const name = body.name?.trim() || email.split('@')[0];

    // 1. Create record in 'users' table
    const userId = randomUUID();
    const { error: userError } = await supabase
      .from("users")
      .insert({
        id: userId,
        name: name,
        email: email,
        phone: phone,
        type: "biker",
        password_hash: hashedPassword,
        finished_register: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

    if (userError) throw userError;

    // 2. Create record in 'Entregadores' table
    const { data: biker, error: bikerError } = await supabase
      .from("Entregadores")
      .insert({
        id: randomUUID(),
        userId: userId,
        name: name,
        email: email,
        phone: phone,
        password_hash: hashedPassword,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .select()
      .single();

    if (bikerError) throw bikerError;

    return { success: true, message: "Registration received! We will contact you soon." };
  } catch (error: any) {
    console.error("Error registering biker:", error);
    
    if (error?.code === "23505") { // Unique violation
        throw createError({
            statusCode: 400,
            statusMessage: "Email already exists",
        });
    }

    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || error.message || "Failed to register biker",
    });
  }
});
