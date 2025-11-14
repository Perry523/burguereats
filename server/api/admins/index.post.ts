import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcrypt";
import { randomUUID } from "crypto";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    if (!body.name || !body.email || !body.password || !body.companyId) {
      throw createError({
        statusCode: 400,
        statusMessage: "Name, email, password, and companyId are required",
      });
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase configuration");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data: admin, error } = await supabase
      .from("Admins")
      .insert({
        id: randomUUID(),
        name: body.name,
        email: body.email,
        password: hashedPassword,
        phone: body.phone,
        companyId: body.companyId,
        isActive: body.isActive ?? true,
      })
      .select()
      .single();

    if (error) throw error;

    return { success: true, data: admin };
  } catch (error) {
    console.error("Error creating admin:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to create admin",
    });
  }
});
