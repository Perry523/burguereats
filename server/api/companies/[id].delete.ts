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
    const existingCompany = await db.findById('Company', id)

    if (!existingCompany) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Company not found',
      })
    }

    await db.delete('Company', id)

    return { success: true, message: 'Company deleted successfully' }
  } catch (error) {
    console.error('Error deleting company:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete company',
    })
  }
})
