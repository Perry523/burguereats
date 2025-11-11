import jwt from 'jsonwebtoken'
import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const token = getCookie(event, 'auth_token')

    if (!token) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
      })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as {
      id: string
      email: string
      companyId: string
    }

    const admin = await prisma.admins.findUnique({
      where: { id: decoded.id },
      include: { company: true },
    })

    if (!admin) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Admin not found',
      })
    }

    return {
      success: true,
      data: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        company: admin.company,
      },
    }
  } catch (error) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }
})
