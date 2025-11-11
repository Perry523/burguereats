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
    const query = getQuery(event)
    const companyId = typeof query.companyId === 'string' ? query.companyId : undefined

    const categories = await prisma.category.findMany({
      where: companyId ? { companyId } : undefined,
      orderBy: [{ order: 'asc' }, { name: 'asc' }, { createdAt: 'asc' }],
    })

    return {
      success: true,
      data: categories.map((category) => serializeCategory(category)),
    }
  } catch (error) {
    console.error('Error fetching categories:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch categories',
    })
  }
})
