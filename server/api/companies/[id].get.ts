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

    const company = await prisma.company.findUnique({
      where: { id },
      include: {
        admins: true,
        dishes: true,
      },
    })

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
