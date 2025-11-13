import { DatabaseHelper } from '~/utils/database'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Dish ID is required',
      })
    }

    const db = new DatabaseHelper()
    const dish = await db.findById('Dish', id)

    if (!dish) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Dish not found',
      })
    }

    // Fetch related categories
    const dishCategories = await db.db('DishCategory')
      .join('Category', 'DishCategory.categoryId', 'Category.id')
      .where('DishCategory.dishId', id)
      .select('Category.*')

    // Fetch related side categories
    const dishSideCategories = await db.db('DishSideCategory')
      .join('SideCategory', 'DishSideCategory.sideCategoryId', 'SideCategory.id')
      .where('DishSideCategory.dishId', id)
      .select('SideCategory.*', 'DishSideCategory.order as dishOrder')

    return {
      success: true,
      data: {
        ...dish,
        categories: dishCategories,
        sideCategories: dishSideCategories
      }
    }
  } catch (error) {
    console.error('Error fetching dish:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch dish',
    })
  }
})
