import { d as defineEventHandler, a as getQuery, D as DatabaseHelper, c as createError } from '../../nitro/nitro.mjs';
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

const index_get = defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const companyId = query.companyId;
    const db = new DatabaseHelper();
    let knexQuery = db.db("side_categories");
    if (companyId) {
      knexQuery = knexQuery.where("company_id", companyId);
    }
    const categories = await knexQuery.orderBy("order", "asc").orderBy("created_at", "asc");
    return {
      success: true,
      data: categories
    };
  } catch (error) {
    console.error("Error fetching side categories:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch side categories"
    });
  }
});

export { index_get as default };
//# sourceMappingURL=index.get5.mjs.map
