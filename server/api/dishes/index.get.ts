import prisma from '../../utils/prisma'
import { serializeDish } from '../../utils/dishes'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const companyId = query.companyId as string | undefined

    const dishes = await prisma.dish.findMany({
      where: companyId ? { companyId } : undefined,
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
      orderBy: { createdAt: 'desc' },
    })

    return {
      success: true,
      data: dishes.map(serializeDish),
    }
  } catch (error) {
    console.error('Error fetching dishes:', error)
    return { success: true, data: [] }
  }
})
export const config = {
  runtime: 'nodejs'
}