import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { company_id, name, phone } = body;

    if (!company_id || !name) {
      throw createError({
        statusCode: 400,
        statusMessage: "Company ID and Name are required",
      });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase configuration");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: client, error } = await supabase
      .from("clients")
      .insert([
        {
          company_id,
          name: name.trim(),
          phone: phone?.trim() || null,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return { success: true, data: client };
  } catch (error: any) {
    console.error("Error creating client:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to create client",
    });
  }
});
