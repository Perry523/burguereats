import { d as defineEventHandler, r as readBody, c as createError, p as prisma } from '../../nitro/nitro.mjs';
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

const index_post = defineEventHandler(async (event) => {
  var _a;
  try {
    const body = await readBody(event);
    if (!body.name || !body.email || !body.password || !body.companyId) {
      throw createError({
        statusCode: 400,
        statusMessage: "Name, email, password, and companyId are required"
      });
    }
    const hashedPassword = await bcrypt.hash(body.password, 10);
    const admin = await prisma.admins.create({
      data: {
        name: body.name,
        email: body.email,
        password: hashedPassword,
        phone: body.phone,
        companyId: body.companyId,
        isActive: (_a = body.isActive) != null ? _a : true
      },
      include: { company: true }
    });
    return { success: true, data: admin };
  } catch (error) {
    console.error("Error creating admin:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to create admin"
    });
  }
});

export { index_post as default };
//# sourceMappingURL=index.post.mjs.map
