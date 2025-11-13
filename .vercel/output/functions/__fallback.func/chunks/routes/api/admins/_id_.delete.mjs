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

const _id__delete = defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: "Admin ID is required"
      });
    }
    await prisma.admins.delete({
      where: { id }
    });
    return { success: true, message: "Admin deleted successfully" };
  } catch (error) {
    console.error("Error deleting admin:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to delete admin"
    });
  }
});

export { _id__delete as default };
//# sourceMappingURL=_id_.delete.mjs.map
