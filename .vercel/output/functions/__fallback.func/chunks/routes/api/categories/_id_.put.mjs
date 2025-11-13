import { d as defineEventHandler, g as getRouterParam, r as readBody, f as sendError, D as DatabaseHelper, h as sendSuccess, i as handleServerError } from '../../../nitro/nitro.mjs';
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

const toSlug = (value) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
const serializeCategory = (category) => ({
  id: category.id,
  name: category.name,
  slug: category.slug,
  description: category.description,
  order: category.order,
  companyId: category.company_id,
  createdAt: category.created_at,
  updatedAt: category.updated_at
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
    const existingCategory = await db.findById("categories", id);
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
      const conflict = await db.db("categories").where("company_id", existingCategory.company_id).where("slug", resolvedSlug).whereNot("id", id).first();
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
    const category = await db.update("categories", id, data);
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
