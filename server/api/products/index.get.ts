import { handleServerError, sendSuccess } from "~/server/utils/http";
import { ProductModel } from "~/models/ProductModel";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const companyId = typeof query.companyId === "string" ? query.companyId : undefined;
    const activeOnly = query.activeOnly === 'true';

    if (!companyId) {
      throw createError({
        statusCode: 400,
        statusMessage: "Company ID is required",
      });
    }

    const productModel = new ProductModel();
    let products;

    if (activeOnly) {
      products = await productModel.findActiveByCompany(companyId);
    } else {
      products = await productModel.findByCompany(companyId);
    }

    return sendSuccess(event, {
      data: products,
    });
  } catch (error) {
    return handleServerError(event, error, {
      statusCode: 500,
      code: "PRODUCTS_FETCH_FAILED",
      message: "Failed to fetch products",
    });
  }
});
