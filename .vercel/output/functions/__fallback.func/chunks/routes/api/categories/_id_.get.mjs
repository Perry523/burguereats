import { d as defineEventHandler, g as getRouterParam, f as sendError, D as DatabaseHelper, h as sendSuccess, i as handleServerError } from '../../../nitro/nitro.mjs';
import 'knex';
import 'node:process';
import 'node:path';
import 'node:url';
import 'node:module';
import 'node:fs';
import 'node:child_process';
import 'node:fs/promises';
import 'node:os';
import 'node:util';
import 'node:async_hooks';
import 'node:events';
import '@supabase/supabase-js';
import 'node:http';
import 'node:https';
import 'node:buffer';
import 'node:crypto';
import '@iconify/utils';
import 'consola';
import 'ipx';

const serializeCategory = (category) => ({
  id: category.id,
  name: category.name,
  slug: category.slug,
  description: category.description,
  order: category.order,
  companyId: category.company_id,
  createdAt: category.created_at,
  updatedAt: category.updated_at
});
const _id__get = defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");
    if (!id) {
      return sendError(event, {
        statusCode: 400,
        code: "CATEGORY_ID_REQUIRED",
        message: "Category ID is required"
      });
    }
    const db = new DatabaseHelper();
    const category = await db.findById("categories", id);
    if (!category) {
      return sendError(event, {
        statusCode: 404,
        code: "CATEGORY_NOT_FOUND",
        message: "Category not found"
      });
    }
    return sendSuccess(event, {
      data: serializeCategory(category)
    });
  } catch (error) {
    return handleServerError(event, error, {
      statusCode: 500,
      code: "CATEGORY_FETCH_FAILED",
      message: "Failed to fetch category"
    });
  }
});

export { _id__get as default };
//# sourceMappingURL=_id_.get.mjs.map
