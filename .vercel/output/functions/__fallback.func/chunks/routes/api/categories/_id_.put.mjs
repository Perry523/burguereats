import { d as defineEventHandler, g as getRouterParam, r as readBody, f as sendError, D as DatabaseHelper, h as sendSuccess, i as handleServerError } from '../../../nitro/nitro.mjs';
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

const toSlug = (value) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
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
const _id__put = defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");
    const body = await readBody(event);
    if (!id) {
      return sendError(event, {
        statusCode: 400,
        code: "CATEGORY_ID_REQUIRED",
        message: "Category ID is required"
      });
    }
    const db = new DatabaseHelper();
    const existingCategory = await db.findById("Category", id);
    if (!existingCategory) {
      return sendError(event, {
        statusCode: 404,
        code: "CATEGORY_NOT_FOUND",
        message: "Category not found"
      });
    }
    const data = {};
    if (Object.prototype.hasOwnProperty.call(body, "name")) {
      const name = typeof body.name === "string" ? body.name.trim() : "";
      if (!name) {
        return sendError(event, {
          statusCode: 400,
          code: "CATEGORY_VALIDATION_FAILED",
          message: "Name cannot be empty"
        });
      }
      data.name = name;
    }
    if (Object.prototype.hasOwnProperty.call(body, "description")) {
      const descriptionInput = typeof body.description === "string" ? body.description.trim() : "";
      data.description = descriptionInput ? descriptionInput : null;
    }
    let resolvedSlug;
    if (Object.prototype.hasOwnProperty.call(body, "slug")) {
      const slugInput = typeof body.slug === "string" ? body.slug.trim() : "";
      resolvedSlug = toSlug(slugInput || (typeof body.name === "string" ? body.name : existingCategory.name));
      if (!resolvedSlug) {
        return sendError(event, {
          statusCode: 400,
          code: "CATEGORY_SLUG_INVALID",
          message: "Valid slug is required"
        });
      }
    }
    if (Object.prototype.hasOwnProperty.call(body, "order")) {
      const parsedOrder = Number(body.order);
      data.order = Number.isFinite(parsedOrder) ? parsedOrder : 0;
    }
    if (resolvedSlug) {
      const conflict = await db.db("Category").where("companyId", existingCategory.companyId).where("slug", resolvedSlug).whereNot("id", id).first();
      if (conflict) {
        return sendError(event, {
          statusCode: 409,
          code: "CATEGORY_DUPLICATE",
          message: "Category slug already exists for this company"
        });
      }
      data.slug = resolvedSlug;
    }
    if (Object.keys(data).length === 0) {
      return sendSuccess(event, {
        data: serializeCategory(existingCategory)
      });
    }
    const category = await db.update("Category", id, data);
    return sendSuccess(event, {
      data: serializeCategory(category)
    });
  } catch (error) {
    return handleServerError(event, error, {
      statusCode: 500,
      code: "CATEGORY_UPDATE_FAILED",
      message: "Failed to update category"
    });
  }
});

export { _id__put as default };
//# sourceMappingURL=_id_.put.mjs.map
