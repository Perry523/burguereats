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
        statusMessage: "Dish ID is required"
      });
    }
    const db = new DatabaseHelper();
    const existingDish = await db.findById("dishes", id);
    if (!existingDish) {
      throw createError({
        statusCode: 404,
        statusMessage: "Dish not found"
      });
    }
    const updateData = {};
    if (typeof body.name === "string") {
      const trimmedName = body.name.trim();
      if (trimmedName) {
        updateData.name = trimmedName;
      }
    }
    if (Object.prototype.hasOwnProperty.call(body, "description")) {
      updateData.description = typeof body.description === "string" ? body.description : null;
    }
    if (Object.prototype.hasOwnProperty.call(body, "price")) {
      const parsedPrice = typeof body.price !== "undefined" ? parseFloat(body.price) : NaN;
      if (Number.isNaN(parsedPrice)) {
        throw createError({
          statusCode: 400,
          statusMessage: "Invalid price value"
        });
      }
      updateData.price = parsedPrice;
    }
    const incomingImage = typeof body.imageUrl === "string" ? body.imageUrl : body.image;
    const normalizedImage = typeof incomingImage === "string" ? incomingImage.trim() : void 0;
    if (normalizedImage !== void 0) {
      updateData.image = normalizedImage || null;
    }
    if (typeof body.isAvailable === "boolean") {
      updateData.is_available = body.isAvailable;
    }
    if (typeof body.category === "string") {
      updateData.category = body.category;
    }
    const dish = await db.update("dishes", id, updateData);
    return { success: true, data: dish };
  } catch (error) {
    console.error("Error updating dish:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to update dish"
    });
  }
});

export { _id__put as default };
//# sourceMappingURL=_id_.put.mjs.map
