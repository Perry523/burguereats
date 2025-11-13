import { DatabaseHelper } from '../../utils/database'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Side category ID is required',
      })
    }

    const db = new DatabaseHelper()
    const existingCategory = await db.findById('SideCategory', id)

    if (!existingCategory) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Side category not found',
      })
    }

    await db.delete('SideCategory', id)

    return { success: true }
  } catch (error) {
    console.error('Error deleting side category:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete side category',
    })
  }
})
