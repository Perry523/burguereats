import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcrypt";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");
    const body = await readBody(event);

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: "Admin ID is required",
      });
    }

    const updateData: any = {
      name: body.name,
      email: body.email,
      phone: body.phone,
      isActive: body.isActive,
    };

    if (body.password) {
      updateData.password = await bcrypt.hash(body.password, 10);
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase configuration");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data: admin, error } = await supabase
      .from("Admins")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return { success: true, data: admin };
  } catch (error) {
    console.error("Error updating admin:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to update admin",
    });
  }
});
