import { DatabaseHelper } from '~/utils/database'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Company ID is required',
      })
    }

    const db = new DatabaseHelper()
    const company = await db.findById('Company', id)

    if (!company) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Company not found',
      })
    }

    return { success: true, data: company }
  } catch (error) {
    console.error('Error fetching company:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch company',
    })
  }
})
