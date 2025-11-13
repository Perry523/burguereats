import { DatabaseHelper } from '../../utils/database'

export default defineEventHandler(async (event) => {
  try {
    const db = new DatabaseHelper()
    const categories = await db.db('SideCategory')
      .leftJoin('SideOption', 'SideCategory.id', 'SideOption.categoryId')
      .select(
        'SideCategory.*',
        db.db.raw('COALESCE(json_agg("SideOption".*) FILTER (WHERE "SideOption"."id" IS NOT NULL), \'[]\') as sides')
      )
      .groupBy('SideCategory.id')

    return {
      success: true,
      data: categories,
    }
  } catch (error) {
    console.error('Error fetching side categories:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch side categories',
    })
  }
})
