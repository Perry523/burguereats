import { handleServerError, sendSuccess } from '~/server/utils/http'
import { DatabaseHelper } from '~/server/utils/database'

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

    const db = new DatabaseHelper()
    let knexQuery = db.db('Category')

    if (companyId) {
      knexQuery = knexQuery.where('companyId', companyId)
    }

    const categories = await knexQuery
      .orderBy('order', 'asc')
      .orderBy('name', 'asc')
      .orderBy('createdAt', 'asc')

    return sendSuccess(event, {
      data: categories.map((category: any) => serializeCategory(category)),
    })
  } catch (error) {
    return handleServerError(event, error, {
      statusCode: 500,
      code: 'CATEGORIES_FETCH_FAILED',
      message: 'Failed to fetch categories',
    })
  }
})
