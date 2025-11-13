import { d as defineEventHandler, g as getRouterParam, r as readBody, c as createError, D as DatabaseHelper } from '../../../nitro/nitro.mjs';
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
    const existingCategory = await db.findById("side_categories", id);
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
    const category = await db.update("side_categories", id, updateData);
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
