import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");
    const body = await readBody(event);

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: "Side category ID is required",
      });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase configuration");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data: existingCategory, error: fetchError } = await supabase
      .from("SideCategory")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !existingCategory) {
      throw createError({
        statusCode: 404,
        statusMessage: "Side category not found",
      });
    }

    const updateData: Record<string, unknown> = {};

    if (typeof body.name === "string") {
      updateData.name = body.name;
    }

    if (
      typeof Object.prototype?.hasOwnProperty?.call === "function" &&
      Object.prototype?.hasOwnProperty?.call(body, "description")
    ) {
      updateData.description = body.description;
    }

    if (typeof body.isRequired === "boolean") {
      updateData.isRequired = body.isRequired;
    }

    if (typeof body.maxSelections === "number") {
      updateData.maxSelections = body.maxSelections;
    }

    if (typeof body.order === "number") {
      updateData.order = body.order;
    }

    const { data: category, error } = await supabase
      .from("SideCategory")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return {
      success: true,
      data: category,
    };
  } catch (error) {
    console.error("Error updating side category:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to update side category",
    });
  }
});
