import { handleServerError, sendError, sendSuccess } from "~/server/utils/http";
import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");

    if (!id) {
      return sendError(event, {
        statusCode: 400,
        code: "CATEGORY_ID_REQUIRED",
        message: "Category ID is required",
      });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase configuration");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data: existingCategory, error: fetchError } = await supabase
      .from("Category")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !existingCategory) {
      return sendError(event, {
        statusCode: 404,
        code: "CATEGORY_NOT_FOUND",
        message: "Category not found",
      });
    }

    const { error } = await supabase.from("Category").delete().eq("id", id);

    if (error) throw error;

    return sendSuccess(event, {
      data: null,
    });
  } catch (error) {
    return handleServerError(event, error, {
      statusCode: 500,
      code: "CATEGORY_DELETE_FAILED",
      message: "Failed to delete category",
    });
  }
});
