import { handleServerError, sendError, sendSuccess } from '~/server/utils/http'
import prisma from '~/server/utils/prisma'

const toSlug = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

const serializeCategory = (category: { id: string; name: string; slug: string; description: string | null; order: number; companyId: string; createdAt: Date; updatedAt: Date }) => ({
  id: category.id,
  name: category.name,
  slug: category.slug,
  description: category.description,
  order: category.order,
  companyId: category.companyId,
  createdAt: category.createdAt,
  updatedAt: category.updatedAt,
})

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    const body = await readBody(event)

    if (!id) {
      return sendError(event, {
        statusCode: 400,
        code: 'CATEGORY_ID_REQUIRED',
        message: 'Category ID is required',
      })
    }

    const existingCategory = await prisma.category.findUnique({
      where: { id },
    })

    if (!existingCategory) {
      return sendError(event, {
        statusCode: 404,
        code: 'CATEGORY_NOT_FOUND',
        message: 'Category not found',
      })
    }

    const data: Record<string, unknown> = {}

    if (Object.prototype.hasOwnProperty.call(body, 'name')) {
      const name = typeof body.name === 'string' ? body.name.trim() : ''
      if (!name) {
        return sendError(event, {
          statusCode: 400,
          code: 'CATEGORY_VALIDATION_FAILED',
          message: 'Name cannot be empty',
        })
      }
      data.name = name
    }

    if (Object.prototype.hasOwnProperty.call(body, 'description')) {
      const descriptionInput = typeof body.description === 'string' ? body.description.trim() : ''
      data.description = descriptionInput ? descriptionInput : null
    }

    let resolvedSlug: string | undefined
    if (Object.prototype.hasOwnProperty.call(body, 'slug')) {
      const slugInput = typeof body.slug === 'string' ? body.slug.trim() : ''
      resolvedSlug = toSlug(slugInput || (typeof body.name === 'string' ? body.name : existingCategory.name))
      if (!resolvedSlug) {
        return sendError(event, {
          statusCode: 400,
          code: 'CATEGORY_SLUG_INVALID',
          message: 'Valid slug is required',
        })
      }
    }

    if (Object.prototype.hasOwnProperty.call(body, 'order')) {
      const parsedOrder = Number(body.order)
      data.order = Number.isFinite(parsedOrder) ? parsedOrder : 0
    }

    if (resolvedSlug) {
      const conflict = await prisma.category.findFirst({
        where: {
          companyId: existingCategory.companyId,
          slug: resolvedSlug,
          id: { not: id },
        },
      })

      if (conflict) {
        return sendError(event, {
          statusCode: 409,
          code: 'CATEGORY_DUPLICATE',
          message: 'Category slug already exists for this company',
        })
      }

      data.slug = resolvedSlug
    }

    if (Object.keys(data).length === 0) {
      return {
        success: true,
        data: serializeCategory(existingCategory),
      }
    }

    const category = await prisma.category.update({
      where: { id },
      data,
    })

    return {
      success: true,
      data: serializeCategory(category),
    }
  } catch (error) {
    console.error('Error updating category:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update category',
    })
  }
})
