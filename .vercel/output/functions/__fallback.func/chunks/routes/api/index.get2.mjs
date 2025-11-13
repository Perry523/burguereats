import { d as defineEventHandler, a as getQuery, D as DatabaseHelper, h as sendSuccess, i as handleServerError } from '../../nitro/nitro.mjs';
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
const index_get = defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const companyId = typeof query.companyId === "string" ? query.companyId : void 0;
    const db = new DatabaseHelper();
    let knexQuery = db.db("categories");
    if (companyId) {
      knexQuery = knexQuery.where("company_id", companyId);
    }
    const categories = await knexQuery.orderBy("order", "asc").orderBy("name", "asc").orderBy("created_at", "asc");
    return sendSuccess(event, {
      data: categories.map((category) => serializeCategory(category))
    });
  } catch (error) {
    return handleServerError(event, error, {
      statusCode: 500,
      code: "CATEGORIES_FETCH_FAILED",
      message: "Failed to fetch categories"
    });
  }
});

export { index_get as default };
//# sourceMappingURL=index.get2.mjs.map
