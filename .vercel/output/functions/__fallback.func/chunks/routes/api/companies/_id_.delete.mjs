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
        statusMessage: "Company ID is required"
      });
    }
    const db = new DatabaseHelper();
    const existingCompany = await db.findById("companies", id);
    if (!existingCompany) {
      throw createError({
        statusCode: 404,
        statusMessage: "Company not found"
      });
    }
    await db.delete("companies", id);
    return { success: true, message: "Company deleted successfully" };
  } catch (error) {
    console.error("Error deleting company:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to delete company"
    });
  }
});

export { _id__delete as default };
//# sourceMappingURL=_id_.delete.mjs.map
