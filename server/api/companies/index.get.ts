import { DatabaseHelper } from '../../utils/database'

export default defineEventHandler(async () => {
  try {
    const db = new DatabaseHelper()
    const companies = await db.findAll('Company')
    return { success: true, data: companies }
  } catch (error) {
    console.error('Error fetching companies:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch companies',
    })
  }
})
