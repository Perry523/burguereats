import { DatabaseHelper } from '~/utils/database'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const companyId = query.companyId as string | undefined

    const db = new DatabaseHelper()
    let knexQuery = db.db('Dish')

    if (companyId) {
      knexQuery = knexQuery.where('companyId', companyId)
    }

    const dishes = await knexQuery
      .orderBy('createdAt', 'desc')
      .select('*')

    // Get all dish IDs
    const dishIds = dishes.map(dish => dish.id)

    if (dishIds.length === 0) {
      return {
        success: true,
        data: dishes,
      }
    }

    // Fetch categories for all dishes
    const dishCategories = await db.db('DishCategory')
      .join('Category', 'DishCategory.categoryId', 'Category.id')
      .whereIn('DishCategory.dishId', dishIds)
      .select('DishCategory.dishId', 'Category.*')

    // Fetch side categories for all dishes
    const dishSideCategories = await db.db('DishSideCategory')
      .join('SideCategory', 'DishSideCategory.sideCategoryId', 'SideCategory.id')
      .whereIn('DishSideCategory.dishId', dishIds)
      .select('DishSideCategory.dishId', 'SideCategory.*', 'DishSideCategory.order as dishOrder')

    // Group categories and side categories by dish ID
    const categoriesByDish = dishCategories.reduce((acc, item) => {
      if (!acc[item.dishId]) acc[item.dishId] = []
      acc[item.dishId].push({
        id: item.id,
        name: item.name,
        slug: item.slug,
        description: item.description,
        order: item.order,
        companyId: item.companyId,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
      })
      return acc
    }, {})

    const sideCategoriesByDish = dishSideCategories.reduce((acc, item) => {
      if (!acc[item.dishId]) acc[item.dishId] = []
      acc[item.dishId].push({
        id: item.id,
        name: item.name,
        description: item.description,
        isRequired: item.isRequired,
        maxSelections: item.maxSelections,
        order: item.order,
        companyId: item.companyId,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        dishOrder: item.dishOrder
      })
      return acc
    }, {})

    // Add categories and sideCategories to each dish
    const dishesWithRelations = dishes.map(dish => ({
      ...dish,
      categories: categoriesByDish[dish.id] || [],
      sideCategories: sideCategoriesByDish[dish.id] || []
    }))

    return {
      success: true,
      data: dishesWithRelations,
    }
  } catch (error) {
    console.error('Error fetching dishes:', error)
    return { success: true, data: [] }
  }
})
export const config = {
  runtime: 'nodejs'
}