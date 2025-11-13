import jwt from 'jsonwebtoken'
import { DatabaseHelper } from '../../utils/database'

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

    const db = new DatabaseHelper()
    const admin = await db.db('Admins').where('id', decoded.id).first()

    if (!admin) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Admin not found',
      })
    }

    const company = await db.findById('Company', admin.companyId)

    return {
      success: true,
      data: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        company: company,
      },
    }
  } catch (error) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }
})
