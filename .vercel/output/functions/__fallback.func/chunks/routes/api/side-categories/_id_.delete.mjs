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

const _id__delete = defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: "Side category ID is required"
      });
    }
    const db = new DatabaseHelper();
    const existingCategory = await db.findById("side_categories", id);
    if (!existingCategory) {
      throw createError({
        statusCode: 404,
        statusMessage: "Side category not found"
      });
    }
    await db.delete("side_categories", id);
    return { success: true };
  } catch (error) {
    console.error("Error deleting side category:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to delete side category"
    });
  }
});

export { _id__delete as default };
//# sourceMappingURL=_id_.delete.mjs.map
