import { DatabaseHelper } from '~/utils/database'
import { randomUUID } from 'crypto'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    const name = typeof body.name === 'string' ? body.name.trim() : ''
    const companyId = typeof body.companyId === 'string' ? body.companyId : ''
    const parsedPrice = typeof body.price !== 'undefined' ? parseFloat(body.price) : NaN
    const categoryIds = Array.isArray(body.categoryIds) ? body.categoryIds.filter(id => typeof id === 'string') : []
    const sideCategoryIds = Array.isArray(body.sideCategoryIds) ? body.sideCategoryIds.filter(id => typeof id === 'string') : []
    const incomingImage = typeof body.imageUrl === 'string' ? body.imageUrl : body.image
    const normalizedImage = typeof incomingImage === 'string' ? incomingImage.trim() : ''

    if (!name || !companyId || Number.isNaN(parsedPrice)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Name, price, and companyId are required',
      })
    }

    if (categoryIds.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'At least one category is required',
      })
    }

    const db = new DatabaseHelper()
    const dishId = randomUUID()

    // Create the dish
    const dish = await db.create('Dish', {
      id: dishId,
      name,
      description: typeof body.description === 'string' ? body.description : null,
      price: parsedPrice,
      category: '', // Keep for backward compatibility, but we'll use junction table
      image: normalizedImage || null,
      isAvailable: typeof body.isAvailable === 'boolean' ? body.isAvailable : true,
      companyId: companyId,
    })

    // Create dish-category relationships
    if (categoryIds.length > 0) {
      const dishCategories = categoryIds.map(categoryId => ({
        id: randomUUID(),
        dishId,
        categoryId,
      }))
      await db.db('DishCategory').insert(dishCategories)
    }

    // Create dish-side-category relationships
    if (sideCategoryIds.length > 0) {
      const dishSideCategories = sideCategoryIds.map((sideCategoryId, index) => ({
        id: randomUUID(),
        dishId,
        sideCategoryId,
        order: index,
      }))
      await db.db('DishSideCategory').insert(dishSideCategories)
    }

    return { success: true, data: dish }
  } catch (error) {
    console.error('Error creating dish:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create dish',
    })
  }
})
