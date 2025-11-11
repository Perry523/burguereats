import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Category ID is required',
      })
    }

    const existingCategory = await prisma.category.findUnique({
      where: { id },
    })

    if (!existingCategory) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Category not found',
      })
    }

    await prisma.category.delete({
      where: { id },
    })

    return {
      success: true,
    }
  } catch (error) {
    console.error('Error deleting category:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete category',
    })
  }
})
