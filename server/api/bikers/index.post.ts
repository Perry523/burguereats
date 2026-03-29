import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcrypt";
import { randomUUID } from "crypto";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    const normalizedEmail = body.email?.trim().toLowerCase();

    if (!body.name || !normalizedEmail || !body.password) {
      throw createError({
        statusCode: 400,
        statusMessage: "Name, email, and password are required",
      });
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase configuration");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // 1. Create record in 'users' table
    const userId = randomUUID();
    const { error: userError } = await supabase
      .from("users")
      .insert({
        id: userId,
        name: body.name,
        email: normalizedEmail,
        phone: body.phone,
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
        companyId: body.companyId,
        name: body.name,
        email: normalizedEmail,
        phone: body.phone,
        password_hash: hashedPassword,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .select()
      .single();

    if (bikerError) throw bikerError;

    return { success: true, data: biker };
  } catch (error: any) {
    console.error("Error creating biker:", error);
    
    if (error?.code === "23505") { // Unique violation
        throw createError({
            statusCode: 400,
            statusMessage: "Email already exists",
        });
    }

    throw createError({
      statusCode: 500,
      statusMessage: error.message || "Failed to create biker",
    });
  }
});
