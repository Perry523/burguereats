import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    const body = await readBody(event)

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Side category ID is required',
      })
    }

    const sides = Array.isArray(body.sides) ? body.sides : []

    const category = await prisma.sideCategory.update({
      where: { id },
      data: {
        name: body.name,
        description: body.description,
        isRequired:
          typeof body.isRequired === 'boolean' ? body.isRequired : undefined,
        maxSelections:
          typeof body.maxSelections === 'number' ? body.maxSelections : undefined,
        order: typeof body.order === 'number' ? body.order : undefined,
      },
      include: { sides: true },
    })

    const incomingIds = sides
      .map((side: any) => side?.id)
      .filter((value: unknown): value is string => typeof value === 'string')

    await prisma.sideOption.deleteMany({
      where: {
        categoryId: id,
        id: incomingIds.length ? { notIn: incomingIds } : undefined,
      },
    })

    for (const side of sides) {
      const payload = {
        name: side.name,
        description: side.description,
        priceIncrement:
          typeof side.priceIncrement === 'number'
            ? side.priceIncrement
            : parseFloat(side.priceIncrement ?? 0),
        image: side.image,
        isAvailable:
          typeof side.isAvailable === 'boolean' ? side.isAvailable : true,
        categoryId: id,
      }

      if (typeof side.id === 'string') {
        await prisma.sideOption.upsert({
          where: { id: side.id },
          update: payload,
          create: { ...payload, id: side.id },
        })
      } else {
        await prisma.sideOption.create({ data: payload })
      }
    }

    const updatedCategory = await prisma.sideCategory.findUnique({
      where: { id },
      include: { sides: true },
    })

    if (!updatedCategory) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to refresh side category',
      })
    }

    return {
      success: true,
      data: {
        id: updatedCategory.id,
        name: updatedCategory.name,
        description: updatedCategory.description,
        isRequired: updatedCategory.isRequired,
        maxSelections: updatedCategory.maxSelections,
        order: updatedCategory.order,
        companyId: updatedCategory.companyId,
        createdAt: updatedCategory.createdAt,
        updatedAt: updatedCategory.updatedAt,
        sides: updatedCategory.sides.map((side) => ({
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
    console.error('Error updating side category:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update side category',
    })
  }
})
