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
  try {
    const body = await readBody(event);
    if (!body.name || !body.email) {
      throw createError({
        statusCode: 400,
        statusMessage: "Name and email are required"
      });
    }
    const db = new DatabaseHelper();
    const company = await db.create("companies", {
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
    console.error("Error creating company:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to create company"
    });
  }
});

export { index_post as default };
//# sourceMappingURL=index.post3.mjs.map
