import { d as defineEventHandler, D as DatabaseHelper, c as createError } from '../../nitro/nitro.mjs';
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

const index_get = defineEventHandler(async () => {
  try {
    const db = new DatabaseHelper();
    const companies = await db.findAll("companies");
    return { success: true, data: companies };
  } catch (error) {
    console.error("Error fetching companies:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch companies"
    });
  }
});

export { index_get as default };
//# sourceMappingURL=index.get3.mjs.map
