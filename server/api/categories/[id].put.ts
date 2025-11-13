import { handleServerError, sendError, sendSuccess } from "~/server/utils/http";
import { DatabaseHelper } from "~/utils/database";

const toSlug = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const serializeCategory = (category: {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  order: number;
  companyId: string;
  createdAt: Date;
  updatedAt: Date;
}) => ({
  id: category.id,
  name: category.name,
  slug: category.slug,
  description: category.description,
  order: category.order,
  companyId: category.companyId,
  createdAt: category.createdAt,
  updatedAt: category.updatedAt,
});

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");
    const body = await readBody(event);

    if (!id) {
      return sendError(event, {
        statusCode: 400,
        code: "CATEGORY_ID_REQUIRED",
        message: "Category ID is required",
      });
    }

    const db = new DatabaseHelper();
    const existingCategory = await db.findById("Category", id);

    if (!existingCategory) {
      return sendError(event, {
        statusCode: 404,
        code: "CATEGORY_NOT_FOUND",
        message: "Category not found",
      });
    }

    const data: Record<string, unknown> = {};

    if (
      typeof Object.prototype?.hasOwnProperty?.call === "function" &&
      Object.prototype?.hasOwnProperty?.call(body, "name")
    ) {
      const name = typeof body.name === "string" ? body.name.trim() : "";
      if (!name) {
        return sendError(event, {
          statusCode: 400,
          code: "CATEGORY_VALIDATION_FAILED",
          message: "Name cannot be empty",
        });
      }
      data.name = name;
    }

    if (
      typeof Object.prototype?.hasOwnProperty?.call === "function" &&
      Object.prototype?.hasOwnProperty?.call(body, "description")
    ) {
      const descriptionInput =
        typeof body.description === "string" ? body.description.trim() : "";
      data.description = descriptionInput ? descriptionInput : null;
    }

    let resolvedSlug: string | undefined;
    if (
      typeof Object.prototype?.hasOwnProperty?.call === "function" &&
      Object.prototype?.hasOwnProperty?.call(body, "slug")
    ) {
      const slugInput = typeof body.slug === "string" ? body.slug.trim() : "";
      resolvedSlug = toSlug(
        slugInput ||
          (typeof body.name === "string" ? body.name : existingCategory.name)
      );
      if (!resolvedSlug) {
        return sendError(event, {
          statusCode: 400,
          code: "CATEGORY_SLUG_INVALID",
          message: "Valid slug is required",
        });
      }
    }

    if (
      typeof Object.prototype?.hasOwnProperty?.call === "function" &&
      Object.prototype?.hasOwnProperty?.call(body, "order")
    ) {
      const parsedOrder = Number(body.order);
      data.order = Number.isFinite(parsedOrder) ? parsedOrder : 0;
    }

    if (resolvedSlug) {
      const conflict = await db
        .db("Category")
        .where("companyId", existingCategory.companyId)
        .where("slug", resolvedSlug)
        .whereNot("id", id)
        .first();

      if (conflict) {
        return sendError(event, {
          statusCode: 409,
          code: "CATEGORY_DUPLICATE",
          message: "Category slug already exists for this company",
        });
      }

      data.slug = resolvedSlug;
    }

    if (Object.keys(data).length === 0) {
      return sendSuccess(event, {
        data: serializeCategory(existingCategory),
      });
    }

    const category = await db.update("Category", id, data);

    return sendSuccess(event, {
      data: serializeCategory(category),
    });
  } catch (error) {
    return handleServerError(event, error, {
      statusCode: 500,
      code: "CATEGORY_UPDATE_FAILED",
      message: "Failed to update category",
    });
  }
});
