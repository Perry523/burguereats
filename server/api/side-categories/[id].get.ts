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

    const category = await prisma.sideCategory.findUnique({
      where: { id },
      include: { sides: true },
    })

    if (!category) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Side category not found',
      })
    }

    return {
      success: true,
      data: {
        id: category.id,
        name: category.name,
        description: category.description,
        isRequired: category.isRequired,
        maxSelections: category.maxSelections,
        order: category.order,
        companyId: category.companyId,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
        sides: category.sides.map((side) => ({
          id: side.id,
          name: side.name,
          description: side.description,
          priceIncrement: side.priceIncrement,
          image: side.image,
          isAvailable: side.isAvailable,
          categoryId: side.categoryId,
          createdAt: side.createdAt,
          updatedAt: side.updatedAt,
        })),
      },
    }
  } catch (error) {
    console.error('Error fetching side category:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch side category',
    })
  }
})
