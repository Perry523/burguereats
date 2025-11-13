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
        statusMessage: "Dish ID is required"
      });
    }
    const db = new DatabaseHelper();
    const existingDish = await db.findById("dishes", id);
    if (!existingDish) {
      throw createError({
        statusCode: 404,
        statusMessage: "Dish not found"
      });
    }
    await db.delete("dishes", id);
    return { success: true, message: "Dish deleted successfully" };
  } catch (error) {
    console.error("Error deleting dish:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to delete dish"
    });
  }
});

export { _id__delete as default };
//# sourceMappingURL=_id_.delete.mjs.map
