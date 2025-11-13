import { d as defineEventHandler, r as readBody, c as createError, D as DatabaseHelper } from '../../nitro/nitro.mjs';
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

const index_post = defineEventHandler(async (event) => {
  var _a;
  try {
    const body = await readBody(event);
    if (!body.name || !body.companyId) {
      throw createError({
        statusCode: 400,
        statusMessage: "Name and companyId are required"
      });
    }
    const db = new DatabaseHelper();
    const category = await db.create("side_categories", {
      name: body.name,
      description: body.description,
      is_required: (_a = body.isRequired) != null ? _a : false,
      max_selections: typeof body.maxSelections === "number" ? body.maxSelections : null,
      order: typeof body.order === "number" ? body.order : 0,
      company_id: body.companyId
    });
    return {
      success: true,
      data: category
    };
  } catch (error) {
    console.error("Error creating side category:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to create side category"
    });
  }
});

export { index_post as default };
//# sourceMappingURL=index.post5.mjs.map
