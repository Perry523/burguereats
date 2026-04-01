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

    const updateData: Record<string, any> = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.type !== undefined) updateData.type = body.type;
    if (body.email !== undefined) updateData.email = body.email;
    if (body.phone !== undefined) updateData.phone = body.phone;
    if (body.address !== undefined) updateData.address = body.address;
    if (body.city !== undefined) updateData.city = body.city;
    if (body.state !== undefined) updateData.state = body.state;
    if (body.ifood_merchant_id !== undefined) updateData.ifood_merchant_id = body.ifood_merchant_id;
    if (body.operating_hours !== undefined) updateData.operating_hours = body.operating_hours;

    const { data: company, error } = await supabase
      .from("Company")
      .update(updateData)
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
