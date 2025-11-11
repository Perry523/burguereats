import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    const body = await readBody(event)

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Company ID is required',
      })
    }

    const company = await prisma.company.update({
      where: { id },
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
    console.error('Error updating company:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update company',
    })
  }
})
