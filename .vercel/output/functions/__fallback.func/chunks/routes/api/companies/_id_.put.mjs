import { d as defineEventHandler, g as getRouterParam, r as readBody, c as createError, D as DatabaseHelper } from '../../../nitro/nitro.mjs';
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

const _id__put = defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");
    const body = await readBody(event);
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
    const company = await db.update("companies", id, {
      name: body.name,
      email: body.email,
      phone: body.phone,
      address: body.address,
      city: body.city,
      state: body.state,
      zip_code: body.zipCode
    });
    return { success: true, data: company };
  } catch (error) {
    console.error("Error updating company:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to update company"
    });
  }
});

export { _id__put as default };
//# sourceMappingURL=_id_.put.mjs.map
