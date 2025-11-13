import { d as defineEventHandler, g as getRouterParam, c as createError, p as prisma } from '../../../nitro/nitro.mjs';
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
        statusMessage: "Admin ID is required"
      });
    }
    const admin = await prisma.admins.findUnique({
      where: { id },
      include: { company: true }
    });
    if (!admin) {
      throw createError({
        statusCode: 404,
        statusMessage: "Admin not found"
      });
    }
    return { success: true, data: admin };
  } catch (error) {
    console.error("Error fetching admin:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch admin"
    });
  }
});

export { _id__get as default };
//# sourceMappingURL=_id_.get.mjs.map
