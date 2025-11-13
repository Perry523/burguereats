import { d as defineEventHandler, r as readBody, c as createError, D as DatabaseHelper } from '../../nitro/nitro.mjs';
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

const index_post = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const companyId = typeof body.companyId === "string" ? body.companyId : "";
    const parsedPrice = typeof body.price !== "undefined" ? parseFloat(body.price) : NaN;
    const primaryCategorySlug = typeof body.category === "string" ? body.category : "";
    const incomingImage = typeof body.imageUrl === "string" ? body.imageUrl : body.image;
    const normalizedImage = typeof incomingImage === "string" ? incomingImage.trim() : "";
    if (!name || !companyId || Number.isNaN(parsedPrice) || !primaryCategorySlug) {
      throw createError({
        statusCode: 400,
        statusMessage: "Name, price, category, and companyId are required"
      });
    }
    const db = new DatabaseHelper();
    const dish = await db.create("dishes", {
      name,
      description: typeof body.description === "string" ? body.description : null,
      price: parsedPrice,
      category: primaryCategorySlug,
      image: normalizedImage || null,
      is_available: typeof body.isAvailable === "boolean" ? body.isAvailable : true,
      company_id: companyId
    });
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
