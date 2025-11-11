import { handleServerError, sendError, sendSuccess } from '~/server/utils/http'
import prisma from '~/server/utils/prisma'

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

    if (!id) {
      return sendError(event, {
        statusCode: 400,
        code: 'CATEGORY_ID_REQUIRED',
        message: 'Category ID is required',
      })
    }

    const category = await prisma.category.findUnique({
      where: { id },
    })

    if (!category) {
      return sendError(event, {
        statusCode: 404,
        code: 'CATEGORY_NOT_FOUND',
        message: 'Category not found',
      })
    }

    return sendSuccess(event, {
      data: serializeCategory(category),
    })
  } catch (error) {
    return handleServerError(event, error, {
      statusCode: 500,
      code: 'CATEGORY_FETCH_FAILED',
      message: 'Failed to fetch category',
    })
  }
})
