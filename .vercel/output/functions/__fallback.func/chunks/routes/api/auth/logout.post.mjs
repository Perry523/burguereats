import { d as defineEventHandler, b as deleteCookie } from '../../../nitro/nitro.mjs';
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

const logout_post = defineEventHandler((event) => {
  deleteCookie(event, "auth_token", { path: "/" });
  return { success: true, message: "Logged out successfully" };
});

export { logout_post as default };
//# sourceMappingURL=logout.post.mjs.map
