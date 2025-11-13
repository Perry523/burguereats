import { d as defineEventHandler, r as readBody, f as sendError, D as DatabaseHelper, h as sendSuccess, i as handleServerError } from '../../nitro/nitro.mjs';
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
const index_post = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const companyId = typeof body.companyId === "string" ? body.companyId : "";
    const descriptionInput = typeof body.description === "string" ? body.description.trim() : "";
    const slugInput = typeof body.slug === "string" ? body.slug.trim() : "";
    const parsedOrder = Number(body.order);
    const order = Number.isFinite(parsedOrder) ? parsedOrder : 0;
    if (!name || !companyId) {
      return sendError(event, {
        statusCode: 400,
        code: "CATEGORY_VALIDATION_FAILED",
        message: "Name and companyId are required"
      });
    }
    const slug = toSlug(slugInput || name);
    if (!slug) {
      return sendError(event, {
        statusCode: 400,
        code: "CATEGORY_SLUG_INVALID",
        message: "Valid slug is required"
      });
    }
    const db = new DatabaseHelper();
    const existing = await db.db("Category").where("companyId", companyId).where("slug", slug).first();
    if (existing) {
      return sendError(event, {
        statusCode: 409,
        code: "CATEGORY_DUPLICATE",
        message: "Category slug already exists for this company"
      });
    }
    const createData = {
      id: randomUUID(),
      name,
      slug,
      description: descriptionInput ? descriptionInput : null,
      companyId,
      order
    };
    const category = await db.create("Category", createData);
    return sendSuccess(event, {
      statusCode: 201,
      data: serializeCategory(category)
    });
  } catch (error) {
    return handleServerError(event, error, {
      statusCode: 500,
      code: "CATEGORY_CREATE_FAILED",
      message: "Failed to create category"
    });
  }
});

export { index_post as default };
//# sourceMappingURL=index.post2.mjs.map
