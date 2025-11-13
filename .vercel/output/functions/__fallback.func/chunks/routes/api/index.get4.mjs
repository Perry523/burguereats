import { d as defineEventHandler, a as getQuery } from '../../nitro/nitro.mjs';
import { D as DatabaseHelper } from '../../_/database.mjs';
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

const index_get = defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const companyId = query.companyId;
    const db = new DatabaseHelper();
    let knexQuery = db.db("Dish");
    if (companyId) {
      knexQuery = knexQuery.where("companyId", companyId);
    }
    const dishes = await knexQuery.orderBy("createdAt", "desc").select("*");
    const dishIds = dishes.map((dish) => dish.id);
    if (dishIds.length === 0) {
      return {
        success: true,
        data: dishes
      };
    }
    const dishCategories = await db.db("DishCategory").join("Category", "DishCategory.categoryId", "Category.id").whereIn("DishCategory.dishId", dishIds).select("DishCategory.dishId", "Category.*");
    const dishSideCategories = await db.db("DishSideCategory").join("SideCategory", "DishSideCategory.sideCategoryId", "SideCategory.id").whereIn("DishSideCategory.dishId", dishIds).select("DishSideCategory.dishId", "SideCategory.*", "DishSideCategory.order as dishOrder");
    const categoriesByDish = dishCategories.reduce((acc, item) => {
      if (!acc[item.dishId]) acc[item.dishId] = [];
      acc[item.dishId].push({
        id: item.id,
        name: item.name,
        slug: item.slug,
        description: item.description,
        order: item.order,
        companyId: item.companyId,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
      });
      return acc;
    }, {});
    const sideCategoriesByDish = dishSideCategories.reduce((acc, item) => {
      if (!acc[item.dishId]) acc[item.dishId] = [];
      acc[item.dishId].push({
        id: item.id,
        name: item.name,
        description: item.description,
        isRequired: item.isRequired,
        maxSelections: item.maxSelections,
        order: item.order,
        companyId: item.companyId,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        dishOrder: item.dishOrder
      });
      return acc;
    }, {});
    const dishesWithRelations = dishes.map((dish) => ({
      ...dish,
      categories: categoriesByDish[dish.id] || [],
      sideCategories: sideCategoriesByDish[dish.id] || []
    }));
    return {
      success: true,
      data: dishesWithRelations
    };
  } catch (error) {
    console.error("Error fetching dishes:", error);
    return { success: true, data: [] };
  }
});
const config = {
  runtime: "nodejs"
};

export { config, index_get as default };
//# sourceMappingURL=index.get4.mjs.map
