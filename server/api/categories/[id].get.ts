import prisma from '../../utils/prisma'

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
      throw createError({
        statusCode: 400,
        statusMessage: 'Category ID is required',
      })
    }

    const category = await prisma.category.findUnique({
      where: { id },
    })

    if (!category) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Category not found',
      })
    }

    return {
      success: true,
      data: serializeCategory(category),
    }
  } catch (error) {
    console.error('Error fetching category:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch category',
    })
  }
})
