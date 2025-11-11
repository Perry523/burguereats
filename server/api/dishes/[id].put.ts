import prisma from '../../utils/prisma'
import { serializeDish } from '../../utils/dishes'

const formatCategoryName = (slug: string) =>
  slug
    .split('-')
    .filter((segment) => segment.length)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ')

const toSlug = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    const body = await readBody(event)

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Dish ID is required',
      })
    }

    const existingDish = await prisma.dish.findUnique({
      where: { id },
    })

    if (!existingDish) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Dish not found',
      })
    }

    const sideCategoryIds: string[] | undefined = Array.isArray(body.sideCategoryIds)
      ? body.sideCategoryIds.filter((value: unknown): value is string => typeof value === 'string')
      : undefined

    const hasCategoryIds = Object.prototype.hasOwnProperty.call(body, 'categoryIds')
    const hasCategorySlug = Object.prototype.hasOwnProperty.call(body, 'category')

    const incomingImage = typeof body.imageUrl === 'string' ? body.imageUrl : body.image
    const normalizedImage = typeof incomingImage === 'string' ? incomingImage.trim() : undefined

    let resolvedCategoryIds: string[] | undefined
    let resolvedPrimarySlug = hasCategorySlug && typeof body.category === 'string' ? toSlug(body.category) : undefined

    if (hasCategoryIds) {
      const categoryIds: string[] = Array.isArray(body.categoryIds)
        ? body.categoryIds.filter((value: unknown): value is string => typeof value === 'string')
        : []
      resolvedCategoryIds = [...new Set(categoryIds)]
    }

    if (!resolvedPrimarySlug && resolvedCategoryIds && resolvedCategoryIds.length) {
      const firstCategory = await prisma.category.findFirst({
        where: {
          id: {
            in: resolvedCategoryIds,
          },
        },
        orderBy: { name: 'asc' },
      })
      resolvedPrimarySlug = firstCategory?.slug
    }

    if ((resolvedCategoryIds === undefined || resolvedCategoryIds.length === 0) && resolvedPrimarySlug) {
      const existingCategory = await prisma.category.findFirst({
        where: {
          companyId: existingDish.companyId,
          slug: resolvedPrimarySlug,
        },
      })

      if (existingCategory) {
        resolvedCategoryIds = [existingCategory.id]
      } else {
        const createdCategory = await prisma.category.create({
          data: {
            name: formatCategoryName(resolvedPrimarySlug),
            slug: resolvedPrimarySlug,
            companyId: existingDish.companyId,
          },
        })
        resolvedCategoryIds = [createdCategory.id]
      }
    }

    if (resolvedCategoryIds && resolvedCategoryIds.length === 0 && !resolvedPrimarySlug) {
      throw createError({
        statusCode: 400,
        statusMessage: 'At least one category is required',
      })
    }

    const updateData: Record<string, unknown> = {}

    if (typeof body.name === 'string') {
      const trimmedName = body.name.trim()
      if (trimmedName) {
        updateData.name = trimmedName
      }
    }

    if (Object.prototype.hasOwnProperty.call(body, 'description')) {
      updateData.description = typeof body.description === 'string' ? body.description : null
    }

    if (Object.prototype.hasOwnProperty.call(body, 'price')) {
      const parsedPrice = typeof body.price !== 'undefined' ? parseFloat(body.price) : NaN
      if (Number.isNaN(parsedPrice)) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Invalid price value',
        })
      }
      updateData.price = parsedPrice
    }

    if (normalizedImage !== undefined) {
      updateData.image = normalizedImage || null
    }

    if (typeof body.isAvailable === 'boolean') {
      updateData.isAvailable = body.isAvailable
    }

    if (resolvedPrimarySlug) {
      updateData.category = resolvedPrimarySlug
    }

    const dish = await prisma.dish.update({
      where: { id },
      data: updateData,
    })

    if (sideCategoryIds) {
      await prisma.dishSideCategory.deleteMany({ where: { dishId: dish.id } })
      if (sideCategoryIds.length) {
        const sideCategoryData = sideCategoryIds.map((sideCategoryId, index) => ({
          dishId: dish.id,
          sideCategoryId,
          order: index,
        }))
        await prisma.dishSideCategory.createMany({
          data: sideCategoryData,
        })
      }
    }

    if (resolvedCategoryIds) {
      await prisma.dishCategory.deleteMany({ where: { dishId: dish.id } })
      if (resolvedCategoryIds.length) {
        const categoryData = resolvedCategoryIds.map((categoryId) => ({
          dishId: dish.id,
          categoryId,
        }))
        await prisma.dishCategory.createMany({
          data: categoryData,
          skipDuplicates: true,
        })
      }
    }

    const dishWithRelations = await prisma.dish.findUnique({
      where: { id: dish.id },
      include: {
        sideCategories: {
          include: {
            sideCategory: {
              include: { sides: true },
            },
          },
        },
        categories: {
          include: {
            category: true,
          },
        },
      },
    })

    if (!dishWithRelations) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to load dish after update',
      })
    }

    return { success: true, data: serializeDish(dishWithRelations) }
  } catch (error) {
    console.error('Error updating dish:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update dish',
    })
  }
})
