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
    const body = await readBody(event)

    const name = typeof body.name === 'string' ? body.name.trim() : ''
    const companyId = typeof body.companyId === 'string' ? body.companyId : ''
    const parsedPrice = typeof body.price !== 'undefined' ? parseFloat(body.price) : NaN
    const sideCategoryIds: string[] = Array.isArray(body.sideCategoryIds)
      ? body.sideCategoryIds.filter((value: unknown): value is string => typeof value === 'string')
      : []
    const providedCategoryIds: string[] = Array.isArray(body.categoryIds)
      ? body.categoryIds.filter((value: unknown): value is string => typeof value === 'string')
      : []
    const primaryCategorySlug = typeof body.category === 'string' ? toSlug(body.category) : ''
    const incomingImage = typeof body.imageUrl === 'string' ? body.imageUrl : body.image
    const normalizedImage = typeof incomingImage === 'string' ? incomingImage.trim() : ''

    if (!name || !companyId || Number.isNaN(parsedPrice) || (!primaryCategorySlug && providedCategoryIds.length === 0)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Name, price, category or categoryIds, and companyId are required',
      })
    }

    let resolvedCategoryIds: string[] = [...new Set(providedCategoryIds)]
    let resolvedPrimarySlug = primaryCategorySlug

    if (!resolvedCategoryIds.length && resolvedPrimarySlug) {
      const existingCategory = await prisma.category.findFirst({
        where: {
          companyId,
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
            companyId,
          },
        })
        resolvedCategoryIds = [createdCategory.id]
      }
    }

    if (!resolvedPrimarySlug && resolvedCategoryIds.length) {
      const firstCategory = await prisma.category.findFirst({
        where: {
          id: {
            in: resolvedCategoryIds,
          },
        },
        orderBy: { name: 'asc' },
      })
      resolvedPrimarySlug = firstCategory?.slug ?? ''
    }

    if (!resolvedPrimarySlug) {
      throw createError({
        statusCode: 400,
        statusMessage: 'At least one category is required',
      })
    }

    const dish = await prisma.dish.create({
      data: {
        name,
        description: typeof body.description === 'string' ? body.description : null,
        price: parsedPrice,
        category: resolvedPrimarySlug,
        image: normalizedImage || null,
        isAvailable: typeof body.isAvailable === 'boolean' ? body.isAvailable : true,
        companyId,
      },
    })

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
        statusMessage: 'Failed to load dish after creation',
      })
    }

    return { success: true, data: serializeDish(dishWithRelations) }
  } catch (error) {
    console.error('Error creating dish:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create dish',
    })
  }
})
