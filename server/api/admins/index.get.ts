import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const companyId = query.companyId as string

    if (companyId) {
      const admins = await prisma.admins.findMany({
        where: { companyId },
        include: { company: true },
      })
      return { success: true, data: admins }
    }

    const admins = await prisma.admins.findMany({
      include: { company: true },
    })
    return { success: true, data: admins }
  } catch (error) {
    console.error('Error fetching admins:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch admins',
    })
  }
})
