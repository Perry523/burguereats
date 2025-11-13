import { d as defineEventHandler, r as readBody, c as createError } from '../../nitro/nitro.mjs';
import { D as DatabaseHelper } from '../../_/database.mjs';
import { randomUUID } from 'crypto';
import 'events';
import 'timers';
import 'util';
import 'lodash/cloneDeep';
import 'lodash/defaults';
import 'lodash/uniqueId';
import 'stream';
import 'lodash/differenceWith';
import 'lodash/get';
import 'lodash/isEmpty';
import 'lodash/max';
import 'path';
import 'lodash/template';
import 'fs';
import 'lodash/flatten';
import 'lodash/sortBy';
import 'get-package-type';
import 'url';
import 'colorette';
import 'lodash/includes';
import 'lodash/merge';
import 'lodash/chunk';
import 'assert';
import 'lodash/assign';
import 'lodash/clone';
import 'lodash/each';
import 'lodash/isPlainObject';
import 'lodash/last';
import 'lodash/reject';
import 'lodash/tail';
import 'lodash/toArray';
import 'lodash/isTypedArray';
import 'lodash/reduce';
import 'lodash/transform';
import 'lodash/compact';
import 'lodash/groupBy';
import 'lodash/has';
import 'lodash/map';
import 'lodash/omitBy';
import 'lodash/extend';
import 'lodash/indexOf';
import 'lodash/first';
import 'lodash/constant';
import 'lodash/identity';
import 'lodash/some';
import 'lodash/filter';
import 'lodash/values';
import 'sqlite3';
import 'better-sqlite3';
import 'postgres-array';
import 'postgres-date';
import 'postgres-interval';
import 'postgres-bytea';
import 'dns';
import 'net';
import 'tls';
import 'split2';
import 'pg-query-stream';
import 'lodash/isNil';
import 'tedious';
import 'lodash/defer';
import 'mysql';
import 'mysql2';
import 'lodash/uniq';
import 'oracledb';
import '@supabase/supabase-js';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '@iconify/utils';
import 'consola';
import 'node:url';
import 'ipx';

const index_post = defineEventHandler(async (event) => {
  var _a;
  try {
    const body = await readBody(event);
    if (!body.name || !body.companyId) {
      throw createError({
        statusCode: 400,
        statusMessage: "Name and companyId are required"
      });
    }
    const db = new DatabaseHelper();
    const category = await db.create("SideCategory", {
      id: randomUUID(),
      name: body.name,
      description: body.description,
      isRequired: (_a = body.isRequired) != null ? _a : false,
      maxSelections: typeof body.maxSelections === "number" ? body.maxSelections : null,
      order: typeof body.order === "number" ? body.order : 0,
      companyId: body.companyId
    });
    return {
      success: true,
      data: category
    };
  } catch (error) {
    console.error("Error creating side category:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to create side category"
    });
  }
});

export { index_post as default };
//# sourceMappingURL=index.post5.mjs.map
