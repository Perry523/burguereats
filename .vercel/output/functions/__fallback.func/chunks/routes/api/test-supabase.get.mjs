import { d as defineEventHandler, j as supabase } from '../../nitro/nitro.mjs';
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

const testSupabase_get = defineEventHandler(async (event) => {
  try {
    const { data, error } = await supabase.from("companies").select("count").limit(1);
    if (error) {
      console.error("Supabase error:", error);
      return {
        success: false,
        error: error.message,
        message: "Supabase connection failed"
      };
    }
    return {
      success: true,
      message: "Supabase connection successful",
      data
    };
  } catch (error) {
    console.error("Test Supabase error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      message: "Failed to test Supabase connection"
    };
  }
});

export { testSupabase_get as default };
//# sourceMappingURL=test-supabase.get.mjs.map
