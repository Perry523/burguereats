import { d as defineEventHandler, a as getQuery, D as DatabaseHelper } from '../../nitro/nitro.mjs';
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
    let knexQuery = db.db("dishes");
    if (companyId) {
      knexQuery = knexQuery.where("company_id", companyId);
    }
    const dishes = await knexQuery.orderBy("created_at", "desc").select("*");
    return {
      success: true,
      data: dishes
    };
  } catch (error) {
    console.error("Error fetching dishes:", error);
    return { success: true, data: [] };
  }
});
const config = {
  runtime: "nodejs"
};

export { config, index_get as default };
//# sourceMappingURL=index.get4.mjs.map
