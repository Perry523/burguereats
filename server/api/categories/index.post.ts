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
    const body = await readBody(event)

    const name = typeof body.name === 'string' ? body.name.trim() : ''
    const companyId = typeof body.companyId === 'string' ? body.companyId : ''
    const descriptionInput = typeof body.description === 'string' ? body.description.trim() : ''
    const slugInput = typeof body.slug === 'string' ? body.slug.trim() : ''
    const parsedOrder = Number(body.order)
    const order = Number.isFinite(parsedOrder) ? parsedOrder : 0

    if (!name || !companyId) {
      return sendError(event, {
        statusCode: 400,
        code: 'CATEGORY_VALIDATION_FAILED',
        message: 'Name and companyId are required',
      })
    }

    const slug = toSlug(slugInput || name)

    if (!slug) {
      return sendError(event, {
        statusCode: 400,
        code: 'CATEGORY_SLUG_INVALID',
        message: 'Valid slug is required',
      })
    }

    const existing = await prisma.category.findFirst({
      where: {
        companyId,
        slug,
      },
    })

    if (existing) {
      return sendError(event, {
        statusCode: 409,
        code: 'CATEGORY_DUPLICATE',
        message: 'Category slug already exists for this company',
      })
    }

    const createData = {
      name,
      slug,
      description: descriptionInput ? descriptionInput : null,
      companyId,
      order,
    }

    const category = await prisma.category.create({
      data: createData,
    })

    return sendSuccess(event, {
      statusCode: 201,
      data: serializeCategory(category),
    })
  } catch (error) {
    return handleServerError(event, error, {
      statusCode: 500,
      code: 'CATEGORY_CREATE_FAILED',
      message: 'Failed to create category',
    })
  }
})
