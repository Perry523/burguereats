import { d as defineEventHandler, r as readBody, f as sendError, D as DatabaseHelper, h as sendSuccess, i as handleServerError } from '../../nitro/nitro.mjs';
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
    const existing = await db.db("categories").where("company_id", companyId).where("slug", slug).first();
    if (existing) {
      return sendError(event, {
        statusCode: 409,
        code: "CATEGORY_DUPLICATE",
        message: "Category slug already exists for this company"
      });
    }
    const createData = {
      name,
      slug,
      description: descriptionInput ? descriptionInput : null,
      company_id: companyId,
      order
    };
    const category = await db.create("categories", createData);
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
