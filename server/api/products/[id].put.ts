import { handleServerError, sendError, sendSuccess } from "~/server/utils/http";
import { ProductModel } from "~/models/ProductModel";

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

    const productModel = new ProductModel();
    
    // Prepare update data
    const updateData: any = {};
    if (body.name) updateData.name = body.name;
    if (body.category_id !== undefined) updateData.category_id = body.category_id;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.buy_price !== undefined) updateData.buy_price = Number(body.buy_price);
    if (body.sell_price !== undefined) updateData.sell_price = Number(body.sell_price);
    if (body.quantity !== undefined) updateData.quantity = Number(body.quantity);
    if (body.image !== undefined) updateData.image = body.image;
    if (body.is_active !== undefined) updateData.is_active = body.is_active;
    if (body.variants) updateData.variants = JSON.stringify(body.variants);

    const product = await productModel.update(id, updateData);

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
