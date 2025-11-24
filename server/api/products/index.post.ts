import { handleServerError, sendError, sendSuccess } from "~/server/utils/http";
import { ProductModel } from "~/models/ProductModel";
import { randomUUID } from "crypto";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    // Validation
    if (!body.name || !body.company_id || !body.sell_price) {
      return sendError(event, {
        statusCode: 400,
        code: "PRODUCT_VALIDATION_FAILED",
        message: "Name, company_id and sell_price are required",
      });
    }

    const productModel = new ProductModel();

    const createData = {
      id: randomUUID(),
      company_id: body.company_id,
      category_id: body.category_id || null,
      name: body.name,
      description: body.description || null,
      buy_price: Number(body.buy_price) || 0,
      sell_price: Number(body.sell_price),
      quantity: Number(body.quantity) || 0,
      image: body.image || null,
      is_active: body.is_active !== undefined ? body.is_active : true,
      variants: body.variants ? JSON.stringify(body.variants) : '[]'
    };

    const product = await productModel.create(createData);

    return sendSuccess(event, {
      statusCode: 201,
      data: product,
    });
  } catch (error) {
    return handleServerError(event, error, {
      statusCode: 500,
      code: "PRODUCT_CREATE_FAILED",
      message: "Failed to create product",
    });
  }
});
