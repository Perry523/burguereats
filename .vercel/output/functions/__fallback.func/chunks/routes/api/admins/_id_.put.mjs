import { d as defineEventHandler, g as getRouterParam, r as readBody, c as createError, p as prisma } from '../../../nitro/nitro.mjs';
import bcrypt from 'bcrypt';
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
        statusMessage: "Admin ID is required"
      });
    }
    const updateData = {
      name: body.name,
      email: body.email,
      phone: body.phone,
      isActive: body.isActive
    };
    if (body.password) {
      updateData.password = await bcrypt.hash(body.password, 10);
    }
    const admin = await prisma.admins.update({
      where: { id },
      data: updateData,
      include: { company: true }
    });
    return { success: true, data: admin };
  } catch (error) {
    console.error("Error updating admin:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to update admin"
    });
  }
});

export { _id__put as default };
//# sourceMappingURL=_id_.put.mjs.map
