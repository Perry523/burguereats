import { DatabaseHelper } from '~/utils/database'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Admin ID is required',
      })
    }

    const db = new DatabaseHelper()
    await db.delete('Admins', id)

    return { success: true, message: 'Admin deleted successfully' }
  } catch (error) {
    console.error('Error deleting admin:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete admin',
    })
  }
})
