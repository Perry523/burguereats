import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  try {
    const id = event.context.params?.id;
    const body = await readBody(event);

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: "Client ID is required",
      });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase configuration");
    }

    // Prepare update data
    const updateData: any = {};
    if (body.name !== undefined) updateData.name = body.name.trim();
    if (body.phone !== undefined) updateData.phone = body.phone?.trim() || null;

    if (Object.keys(updateData).length === 0) {
      throw createError({
         statusCode: 400,
         statusMessage: "No valid fields provided for update",
      });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: client, error } = await supabase
      .from("clients")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return { success: true, data: client };
  } catch (error: any) {
    console.error("Error updating client:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to update client",
    });
  }
});
