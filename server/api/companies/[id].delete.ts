import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Company ID is required',
      })
    }

    await prisma.company.delete({
      where: { id },
    })

    return { success: true, message: 'Company deleted successfully' }
  } catch (error) {
    console.error('Error deleting company:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete company',
    })
  }
})
