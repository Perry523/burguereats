import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");
    const body = await readBody(event);

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: "Company ID is required",
      });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase configuration");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data: existingCompany, error: fetchError } = await supabase
      .from("Company")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !existingCompany) {
      throw createError({
        statusCode: 404,
        statusMessage: "Company not found",
      });
    }

    const { data: company, error } = await supabase
      .from("Company")
      .update({
        name: body.name,
        email: body.email,
        phone: body.phone,
        address: body.address,
        city: body.city,
        state: body.state,
        zip_code: body.zipCode,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return { success: true, data: company };
  } catch (error) {
    console.error("Error updating company:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to update company",
    });
  }
});
