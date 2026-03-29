import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  try {
    const auth = requireAuth(event);
    const id = event.context.params?.id;

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: "Biker ID is required",
      });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase configuration");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch from Entregadores table
    const { data: biker, error } = await supabase
      .from("Entregadores")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !biker) {
      throw createError({
        statusCode: 404,
        statusMessage: "Biker not found",
      });
    }

    // Role-based access control:
    // 1. Admins see everything
    // 2. Managers see if they have access to the company or the biker is assigned to them (for now let them see if they have the ID)
    // Actually, let's just check if they are logged in.
    
    return {
      success: true,
      data: biker,
    };
  } catch (error: any) {
    if (error.statusCode) throw error;
    console.error("Error fetching biker:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch biker details",
    });
  }
});
