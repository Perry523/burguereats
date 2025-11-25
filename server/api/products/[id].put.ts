import { handleServerError, sendError, sendSuccess } from "~/server/utils/http";
import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  try {
    const id = event.context.params?.id;
    const body = await readBody(event);

    if (!id) {
      return sendError(event, {
        statusCode: 400,
        code: "PRODUCT_ID_REQUIRED",
        message: "Product ID is required",
      });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase configuration");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Prepare update data
    const updateData: any = {};
    if (body.name) updateData.name = body.name;
    if (body.category !== undefined) updateData.category = body.category;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.buy_price !== undefined) updateData.buy_price = Number(body.buy_price);
    if (body.sell_price !== undefined) updateData.sell_price = Number(body.sell_price);
    if (body.stock !== undefined) updateData.stock = Number(body.stock);
    if (body.image !== undefined) updateData.image = body.image;
    if (body.is_active !== undefined) updateData.is_active = body.is_active;
    if (body.variants) updateData.variants = body.variants;

    const { data: product, error } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return sendSuccess(event, {
      data: product,
    });
  } catch (error) {
    return handleServerError(event, error, {
      statusCode: 500,
      code: "PRODUCT_UPDATE_FAILED",
      message: "Failed to update product",
    });
  }
});
