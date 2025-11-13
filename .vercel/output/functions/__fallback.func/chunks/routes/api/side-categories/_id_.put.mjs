import { d as defineEventHandler, g as getRouterParam, r as readBody, c as createError } from '../../../nitro/nitro.mjs';
import { D as DatabaseHelper } from '../../../_/database.mjs';
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
import 'crypto';
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

const _id__put = defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");
    const body = await readBody(event);
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: "Side category ID is required"
      });
    }
    const db = new DatabaseHelper();
    const existingCategory = await db.findById("SideCategory", id);
    if (!existingCategory) {
      throw createError({
        statusCode: 404,
        statusMessage: "Side category not found"
      });
    }
    const updateData = {};
    if (typeof body.name === "string") {
      updateData.name = body.name;
    }
    if (Object.prototype.hasOwnProperty.call(body, "description")) {
      updateData.description = body.description;
    }
    if (typeof body.isRequired === "boolean") {
      updateData.is_required = body.isRequired;
    }
    if (typeof body.maxSelections === "number") {
      updateData.max_selections = body.maxSelections;
    }
    if (typeof body.order === "number") {
      updateData.order = body.order;
    }
    const category = await db.update("SideCategory", id, updateData);
    return {
      success: true,
      data: category
    };
  } catch (error) {
    console.error("Error updating side category:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to update side category"
    });
  }
});

export { _id__put as default };
//# sourceMappingURL=_id_.put.mjs.map
