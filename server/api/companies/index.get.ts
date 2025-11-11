import prisma from '../../utils/prisma'

export default defineEventHandler(async () => {
  try {
    const companies = await prisma.company.findMany({
      include: {
        admins: true,
        dishes: true,
      },
    })
    return { success: true, data: companies }
  } catch (error) {
    console.error('Error fetching companies:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch companies',
    })
  }
})
