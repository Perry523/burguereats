import type { Category, Dish, DishCategory as DishCategoryRelation, DishSideCategory, SideCategory, SideOption } from '../../generated/prisma/client'

type DishWithRelations = Dish & {
  sideCategories: Array<
    DishSideCategory & {
      sideCategory: SideCategory & {
        sides: SideOption[]
      }
    }
  >
  categories: Array<
    DishCategoryRelation & {
      category: Category
    }
  >
}

export const serializeDish = (dish: DishWithRelations) => {
  const categories = dish.categories
    .map((relation) => ({
      id: relation.category.id,
      name: relation.category.name,
      slug: relation.category.slug,
      description: relation.category.description,
    }))
    .sort((a, b) => a.name.localeCompare(b.name))

  return {
    id: dish.id,
    name: dish.name,
    description: dish.description,
    price: dish.price,
    category: dish.category,
    image: dish.image,
    isAvailable: dish.isAvailable,
    companyId: dish.companyId,
    createdAt: dish.createdAt,
    updatedAt: dish.updatedAt,
    categories,
    sideCategories: dish.sideCategories
      .sort((a, b) => a.order - b.order)
      .map((relation) => ({
        id: relation.sideCategory.id,
        name: relation.sideCategory.name,
        description: relation.sideCategory.description,
        isRequired: relation.sideCategory.isRequired,
        maxSelections: relation.sideCategory.maxSelections,
        order: relation.sideCategory.order,
        sides: relation.sideCategory.sides
          .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
          .map((side) => ({
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
      })),
  }
}
