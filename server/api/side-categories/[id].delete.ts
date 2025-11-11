import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Side category ID is required',
      })
    }

    await prisma.dishSideCategory.deleteMany({ where: { sideCategoryId: id } })
    await prisma.sideOption.deleteMany({ where: { categoryId: id } })
    await prisma.sideCategory.delete({ where: { id } })

    return { success: true }
  } catch (error) {
    console.error('Error deleting side category:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete side category',
    })
  }
})
