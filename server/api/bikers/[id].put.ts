import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcrypt";

export default defineEventHandler(async (event) => {
  try {
    const auth = requireAuth(event);
    const id = event.context.params?.id;
    const body = await readBody(event);

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: "Biker ID is required",
      });
    }

    const normalizedEmail = body.email?.trim().toLowerCase();

    if (!body.name || !normalizedEmail) {
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

    // 1. Get the current Biker to find its userId
    const { data: currentBiker, error: fetchError } = await supabase
      .from("Entregadores")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !currentBiker) {
      throw createError({
        statusCode: 404,
        statusMessage: "Biker not found",
      });
    }

    // 2. If email changed, check if it already exists
    if (normalizedEmail !== currentBiker.email?.toLowerCase()) {
      const { data: existingUser } = await supabase
        .from("users")
        .select("id")
        .ilike("email", normalizedEmail)
        .maybeSingle();

      const { data: existingEntregador } = await supabase
        .from("Entregadores")
        .select("id")
        .ilike("email", normalizedEmail)
        .maybeSingle();

      if (existingUser || existingEntregador) {
        throw createError({
          statusCode: 400,
          statusMessage: "Email already in use by another account",
        });
      }
    }

    // 3. Prepare updates
    let hashedPassword = undefined;
    if (body.password) {
      hashedPassword = await bcrypt.hash(body.password, 10);
    }

    const userUpdatePayload: any = {
      name: body.name,
      email: normalizedEmail,
      phone: body.phone,
      updated_at: new Date().toISOString(),
    };
    if (hashedPassword) {
      userUpdatePayload.password_hash = hashedPassword;
    }

    const bikerUpdatePayload: any = {
      name: body.name,
      email: normalizedEmail,
      phone: body.phone,
      pix_key: body.pix_key || null,
      updatedAt: new Date().toISOString(),
    };
    if (hashedPassword) {
      bikerUpdatePayload.password_hash = hashedPassword;
    }

    // 4. Update both tables
    // Update users table (if userId exists)
    if (currentBiker.userId) {
      const { error: userError } = await supabase
        .from("users")
        .update(userUpdatePayload)
        .eq("id", currentBiker.userId);

      if (userError) throw userError;
    }

    // Update Entregadores table
    const { data: updatedBiker, error: bikerError } = await supabase
      .from("Entregadores")
      .update(bikerUpdatePayload)
      .eq("id", id)
      .select()
      .single();

    if (bikerError) throw bikerError;

    return { success: true, data: updatedBiker };
  } catch (error: any) {
    console.error("Error updating biker:", error);

    if (error?.code === "23505") { // Unique violation
      throw createError({
        statusCode: 400,
        statusMessage: "Email already in use",
      });
    }

    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || "Failed to update biker",
    });
  }
});
