import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const companyId = query.companyId as string | undefined

    const categories = await prisma.sideCategory.findMany({
      where: companyId ? { companyId } : undefined,
      include: { sides: true },
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
    })

    return {
      success: true,
      data: categories.map((category) => ({
        id: category.id,
        name: category.name,
        description: category.description,
        isRequired: category.isRequired,
        maxSelections: category.maxSelections,
        order: category.order,
        companyId: category.companyId,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
        sides: category.sides
          .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
          .map((side) => ({
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
      })),
    }
  } catch (error) {
    console.error('Error fetching side categories:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch side categories',
    })
  }
})
