import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Admin ID is required',
      })
    }

    await prisma.admins.delete({
      where: { id },
    })

    return { success: true, message: 'Admin deleted successfully' }
  } catch (error) {
    console.error('Error deleting admin:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete admin',
    })
  }
})
