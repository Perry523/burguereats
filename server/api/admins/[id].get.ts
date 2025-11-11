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

    const admin = await prisma.admins.findUnique({
      where: { id },
      include: { company: true },
    })

    if (!admin) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Admin not found',
      })
    }

    return { success: true, data: admin }
  } catch (error) {
    console.error('Error fetching admin:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch admin',
    })
  }
})
