import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    if (!body.name || !body.companyId) {
      throw createError({
        statusCode: 400,
        statusMessage: "Name and companyId are required",
      });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase configuration");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data: category, error } = await supabase
      .from("SideCategory")
      .insert({
        id: randomUUID(),
        name: body.name,
        description: body.description,
        isRequired: body.isRequired ?? false,
        maxSelections:
          typeof body.maxSelections === "number" ? body.maxSelections : null,
        order: typeof body.order === "number" ? body.order : 0,
        companyId: body.companyId,
      })
      .select()
      .single();

    if (error) throw error;

    return {
      success: true,
      data: category,
    };
  } catch (error) {
    console.error("Error creating side category:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to create side category",
    });
  }
});
