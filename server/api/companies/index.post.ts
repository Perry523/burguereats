import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    if (!body.name || !body.email) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Name and email are required',
      })
    }

    const company = await prisma.company.create({
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone,
        address: body.address,
        city: body.city,
        state: body.state,
        zipCode: body.zipCode,
      },
    })

    return { success: true, data: company }
  } catch (error) {
    console.error('Error creating company:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create company',
    })
  }
})
