import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Dish ID is required',
      })
    }

    await prisma.dish.delete({
      where: { id },
    })

    return { success: true, message: 'Dish deleted successfully' }
  } catch (error) {
    console.error('Error deleting dish:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete dish',
    })
  }
})
