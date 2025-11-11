import prisma from '../../utils/prisma'
import { serializeDish } from '../../utils/dishes'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Dish ID is required',
      })
    }

    const dish = await prisma.dish.findUnique({
      where: { id },
      include: {
        sideCategories: {
          include: {
            sideCategory: {
              include: { sides: true },
            },
          },
        },
        categories: {
          include: {
            category: true,
          },
        },
      },
    })

    if (!dish) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Dish not found',
      })
    }

    return { success: true, data: serializeDish(dish) }
  } catch (error) {
    console.error('Error fetching dish:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch dish',
    })
  }
})
