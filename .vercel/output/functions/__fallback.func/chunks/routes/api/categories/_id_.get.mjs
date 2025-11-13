import { d as defineEventHandler, g as getRouterParam, f as sendError, D as DatabaseHelper, h as sendSuccess, i as handleServerError } from '../../../nitro/nitro.mjs';
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

const serializeCategory = (category) => ({
  id: category.id,
  name: category.name,
  slug: category.slug,
  description: category.description,
  order: category.order,
  companyId: category.companyId,
  createdAt: category.createdAt,
  updatedAt: category.updatedAt
});
const _id__get = defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");
    if (!id) {
      return sendError(event, {
        statusCode: 400,
        code: "CATEGORY_ID_REQUIRED",
        message: "Category ID is required"
      });
    }
    const db = new DatabaseHelper();
    const category = await db.findById("Category", id);
    if (!category) {
      return sendError(event, {
        statusCode: 404,
        code: "CATEGORY_NOT_FOUND",
        message: "Category not found"
      });
    }
    return sendSuccess(event, {
      data: serializeCategory(category)
    });
  } catch (error) {
    return handleServerError(event, error, {
      statusCode: 500,
      code: "CATEGORY_FETCH_FAILED",
      message: "Failed to fetch category"
    });
  }
});

export { _id__get as default };
//# sourceMappingURL=_id_.get.mjs.map
