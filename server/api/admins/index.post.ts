import prisma from '../../utils/prisma'
import bcrypt from 'bcrypt'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    if (!body.name || !body.email || !body.password || !body.companyId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Name, email, password, and companyId are required',
      })
    }

    const hashedPassword = await bcrypt.hash(body.password, 10)

    const admin = await prisma.admins.create({
      data: {
        name: body.name,
        email: body.email,
        password: hashedPassword,
        phone: body.phone,
        companyId: body.companyId,
        isActive: body.isActive ?? true,
      },
      include: { company: true },
    })

    return { success: true, data: admin }
  } catch (error) {
    console.error('Error creating admin:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create admin',
    })
  }
})
