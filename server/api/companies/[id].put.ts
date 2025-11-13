import { DatabaseHelper } from '../../utils/database'

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

    const db = new DatabaseHelper()
    const existingCompany = await db.findById('Company', id)

    if (!existingCompany) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Company not found',
      })
    }

    const company = await db.update('Company', id, {
      name: body.name,
      email: body.email,
      phone: body.phone,
      address: body.address,
      city: body.city,
      state: body.state,
      zip_code: body.zipCode,
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
