import { DatabaseHelper } from '~/utils/database'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
// import { H3Error } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    if (!body.email || !body.password) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Email and password are required',
      })
    }

    const db = new DatabaseHelper()
    const admin = await db.db('Admins').where('email', body.email).first()

    if (!admin) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid email or password',
      })
    }

    if (!admin.isActive) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Admin account is inactive',
      })
    }

    const isPasswordValid = await bcrypt.compare(body.password, admin.password)

    if (!isPasswordValid) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid email or password',
      })
    }

    const company = await db.findById('Company', admin.companyId)

    const token = jwt.sign(
      {
        id: admin.id,
        email: admin.email,
        companyId: admin.companyId,
      },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    )

    setCookie(event, 'auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    })

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
    if (error) {
      throw error
    }

    console.error('Login error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to login',
    })
  }
})
