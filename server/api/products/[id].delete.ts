import { handleServerError, sendError, sendSuccess } from "~/server/utils/http";
import { ProductModel } from "~/models/ProductModel";

export default defineEventHandler(async (event) => {
  try {
    const id = event.context.params?.id;

    if (!id) {
      return sendError(event, {
        statusCode: 400,
        code: "PRODUCT_ID_REQUIRED",
        message: "Product ID is required",
      });
    }

    const productModel = new ProductModel();
    await productModel.delete(id);

    return sendSuccess(event, {
      statusCode: 204,
      data: null,
    });
  } catch (error) {
    return handleServerError(event, error, {
      statusCode: 500,
      code: "PRODUCT_DELETE_FAILED",
      message: "Failed to delete product",
    });
  }
});
