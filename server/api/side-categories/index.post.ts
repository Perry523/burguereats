import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    if (!body.name || !body.companyId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Name and companyId are required',
      })
    }

    const sides = Array.isArray(body.sides) ? body.sides : []

    const category = await prisma.sideCategory.create({
      data: {
        name: body.name,
        description: body.description,
        isRequired: body.isRequired ?? false,
        maxSelections:
          typeof body.maxSelections === 'number' ? body.maxSelections : null,
        order: typeof body.order === 'number' ? body.order : 0,
        companyId: body.companyId,
        sides: {
          create: sides.map((side: any) => ({
            name: side.name,
            description: side.description,
            priceIncrement:
              typeof side.priceIncrement === 'number'
                ? side.priceIncrement
                : parseFloat(side.priceIncrement ?? 0),
            image: side.image,
            isAvailable:
              typeof side.isAvailable === 'boolean'
                ? side.isAvailable
                : true,
          })),
        },
      },
      include: { sides: true },
    })

    return {
      success: true,
      data: {
        id: category.id,
        name: category.name,
        description: category.description,
        isRequired: category.isRequired,
        maxSelections: category.maxSelections,
        order: category.order,
        companyId: category.companyId,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
        sides: category.sides.map((side) => ({
          id: side.id,
          name: side.name,
          description: side.description,
          priceIncrement: side.priceIncrement,
          image: side.image,
          isAvailable: side.isAvailable,
          categoryId: side.categoryId,
          createdAt: side.createdAt,
          updatedAt: side.updatedAt,
        })),
      },
    }
  } catch (error) {
    console.error('Error creating side category:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create side category',
    })
  }
})
