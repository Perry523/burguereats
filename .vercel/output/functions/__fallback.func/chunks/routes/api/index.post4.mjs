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
  try {
    const body = await readBody(event);
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const companyId = typeof body.companyId === "string" ? body.companyId : "";
    const parsedPrice = typeof body.price !== "undefined" ? parseFloat(body.price) : NaN;
    const categoryIds = Array.isArray(body.categoryIds) ? body.categoryIds.filter((id) => typeof id === "string") : [];
    const sideCategoryIds = Array.isArray(body.sideCategoryIds) ? body.sideCategoryIds.filter((id) => typeof id === "string") : [];
    const incomingImage = typeof body.imageUrl === "string" ? body.imageUrl : body.image;
    const normalizedImage = typeof incomingImage === "string" ? incomingImage.trim() : "";
    if (!name || !companyId || Number.isNaN(parsedPrice)) {
      throw createError({
        statusCode: 400,
        statusMessage: "Name, price, and companyId are required"
      });
    }
    if (categoryIds.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: "At least one category is required"
      });
    }
    const db = new DatabaseHelper();
    const dishId = randomUUID();
    const dish = await db.create("Dish", {
      id: dishId,
      name,
      description: typeof body.description === "string" ? body.description : null,
      price: parsedPrice,
      category: "",
      // Keep for backward compatibility, but we'll use junction table
      image: normalizedImage || null,
      isAvailable: typeof body.isAvailable === "boolean" ? body.isAvailable : true,
      companyId
    });
    if (categoryIds.length > 0) {
      const dishCategories = categoryIds.map((categoryId) => ({
        id: randomUUID(),
        dishId,
        categoryId
      }));
      await db.db("DishCategory").insert(dishCategories);
    }
    if (sideCategoryIds.length > 0) {
      const dishSideCategories = sideCategoryIds.map((sideCategoryId, index) => ({
        id: randomUUID(),
        dishId,
        sideCategoryId,
        order: index
      }));
      await db.db("DishSideCategory").insert(dishSideCategories);
    }
    return { success: true, data: dish };
  } catch (error) {
    console.error("Error creating dish:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to create dish"
    });
  }
});

export { index_post as default };
//# sourceMappingURL=index.post4.mjs.map
