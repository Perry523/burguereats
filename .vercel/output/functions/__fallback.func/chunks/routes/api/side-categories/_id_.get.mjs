import { d as defineEventHandler, g as getRouterParam, c as createError, D as DatabaseHelper } from '../../../nitro/nitro.mjs';
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

const _id__get = defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: "Side category ID is required"
      });
    }
    const db = new DatabaseHelper();
    const category = await db.findById("side_categories", id);
    if (!category) {
      throw createError({
        statusCode: 404,
        statusMessage: "Side category not found"
      });
    }
    return {
      success: true,
      data: category
    };
  } catch (error) {
    console.error("Error fetching side category:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch side category"
    });
  }
});

export { _id__get as default };
//# sourceMappingURL=_id_.get.mjs.map
