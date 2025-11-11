import { handleServerError, sendError, sendSuccess } from '~/server/utils/http'
import prisma from '~/server/utils/prisma'

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

    await prisma.category.delete({
      where: { id },
    })

    return sendSuccess(event, {
      data: null,
    })
  } catch (error) {
    return handleServerError(event, error, {
      statusCode: 500,
      code: 'CATEGORY_DELETE_FAILED',
      message: 'Failed to delete category',
    })
  }
})
