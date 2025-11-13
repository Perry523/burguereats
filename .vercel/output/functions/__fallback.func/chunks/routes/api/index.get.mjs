import { d as defineEventHandler, a as getQuery, p as prisma, c as createError } from '../../nitro/nitro.mjs';
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

const index_get = defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const companyId = query.companyId;
    if (companyId) {
      const admins2 = await prisma.admins.findMany({
        where: { companyId },
        include: { company: true }
      });
      return { success: true, data: admins2 };
    }
    const admins = await prisma.admins.findMany({
      include: { company: true }
    });
    return { success: true, data: admins };
  } catch (error) {
    console.error("Error fetching admins:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch admins"
    });
  }
});

export { index_get as default };
//# sourceMappingURL=index.get.mjs.map
