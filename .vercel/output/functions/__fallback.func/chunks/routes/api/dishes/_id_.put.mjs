import { d as defineEventHandler, g as getRouterParam, r as readBody, c as createError } from '../../../nitro/nitro.mjs';
import { D as DatabaseHelper } from '../../../_/database.mjs';
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
    const existingDish = await db.findById("Dish", id);
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
      updateData.isAvailable = body.isAvailable;
    }
    const dish = await db.update("Dish", id, updateData);
    if (Array.isArray(body.categoryIds)) {
      const categoryIds = body.categoryIds.filter((id2) => typeof id2 === "string");
      await db.db("DishCategory").where("dishId", id).del();
      if (categoryIds.length > 0) {
        const dishCategories = categoryIds.map((categoryId) => ({
          id: randomUUID(),
          dishId: id,
          categoryId
        }));
        await db.db("DishCategory").insert(dishCategories);
      }
    }
    if (Array.isArray(body.sideCategoryIds)) {
      const sideCategoryIds = body.sideCategoryIds.filter((id2) => typeof id2 === "string");
      await db.db("DishSideCategory").where("dishId", id).del();
      if (sideCategoryIds.length > 0) {
        const dishSideCategories = sideCategoryIds.map((sideCategoryId, index) => ({
          id: randomUUID(),
          dishId: id,
          sideCategoryId,
          order: index
        }));
        await db.db("DishSideCategory").insert(dishSideCategories);
      }
    }
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
