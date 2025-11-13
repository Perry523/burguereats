import { d as defineEventHandler, e as getCookie, c as createError, D as DatabaseHelper } from '../../../nitro/nitro.mjs';
import jwt from 'jsonwebtoken';
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

const me_get = defineEventHandler(async (event) => {
  try {
    const token = getCookie(event, "auth_token");
    if (!token) {
      throw createError({
        statusCode: 401,
        statusMessage: "Unauthorized"
      });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    const db = new DatabaseHelper();
    const admin = await db.db("admins").where("id", decoded.id).first();
    if (!admin) {
      throw createError({
        statusCode: 401,
        statusMessage: "Admin not found"
      });
    }
    const company = await db.findById("companies", admin.company_id);
    return {
      success: true,
      data: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        company
      }
    };
  } catch (error) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized"
    });
  }
});

export { me_get as default };
//# sourceMappingURL=me.get.mjs.map
