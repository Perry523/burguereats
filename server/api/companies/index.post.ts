import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    if (!body.name || !body.email) {
      throw createError({
        statusCode: 400,
        statusMessage: "Name and email are required",
      });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase configuration");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data: company, error } = await supabase
      .from("Company")
      .insert({
        id: randomUUID(),
        name: body.name,
        email: body.email,
        phone: body.phone,
        address: body.address,
        city: body.city,
        state: body.state,
        zipCode: body.zipCode,
      })
      .select()
      .single();

    if (error) throw error;

    return { success: true, data: company };
  } catch (error) {
    console.error("Error creating company:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to create company",
    });
  }
});
