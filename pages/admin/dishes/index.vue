<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-gray-800">Gerenciar Pratos</h1>
        <p class="text-sm text-gray-500">Mantenha categorias e acompanhamentos atualizados para cada prato.</p>
      </div>
      <button
        type="button"
        class="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary"
        @click="goToCreate"
      >
        Adicionar Prato
      </button>
    </div>

    <div class="rounded-lg border border-gray-200 bg-white shadow-sm">
      <div v-if="isLoading" class="space-y-4 p-6">
        <div class="h-6 w-1/3 rounded-lg bg-gray-200 animate-pulse"></div>
        <div
          v-for="index in 4"
          :key="`dish-skeleton-${index}`"
          class="h-12 w-full rounded-lg bg-gray-100 animate-pulse"
        ></div>
      </div>

      <div v-else-if="dishes.length" class="space-y-6 p-6">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Prato</th>
                <th class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Categorias</th>
                <th class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Preço</th>
                <th class="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">Ações</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="dish in paginatedDishes" :key="dish.id" class="hover:bg-gray-50">
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <img
                      v-if="dish.image"
                      :src="dish.image"
                      alt="Prato"
                      class="h-10 w-10 rounded-lg object-cover"
                    />
                    <div>
                      <p class="text-sm font-medium text-gray-900">{{ dish.name }}</p>
                      <p v-if="dish.description" class="text-xs text-gray-500">
                        {{ dish.description }}
                      </p>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="category in dish.categories"
                      :key="category.id || category.slug"
                      class="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700"
                    >
                      {{ category.name }}
                    </span>
                    <span
                      v-if="dish.categories.length === 0"
                      class="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700"
                    >
                      {{ dish.category ? formatCategoryLabel(dish.category) : 'Sem categoria' }}
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4 text-sm font-semibold text-gray-900">
                  {{ currencyFormatter.format(dish.price) }}
                </td>
                <td class="px-6 py-4">
                  <div class="flex justify-end gap-2">
                    <button
                      type="button"
                      class="rounded-lg border border-gray-200 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-100"
                      @click="goToEdit(dish.id)"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      class="rounded-lg border border-red-200 px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                      @click="deleteDish(dish.id)"
                    >
                      Deletar
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p class="text-sm text-gray-500">
            Página {{ page }} de {{ totalPages }}
          </p>
          <div class="flex items-center gap-2">
            <button
              type="button"
              class="rounded-lg border border-gray-200 px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
              :disabled="page === 1"
              @click="page = Math.max(1, page - 1)"
            >
              Anterior
            </button>
            <button
              type="button"
              class="rounded-lg border border-gray-200 px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
              :disabled="page === totalPages"
              @click="page = Math.min(totalPages, page + 1)"
            >
              Próxima
            </button>
          </div>
        </div>
      </div>

      <div v-else class="py-12 text-center">
        <p class="text-gray-500">Nenhum prato adicionado ainda</p>
        <button
          type="button"
          class="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary"
          @click="goToCreate"
        >
          Adicionar primeiro prato
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

definePageMeta({
  layout: 'admin',
})

interface DishCategoryTag {
  id: string
  name: string
  slug: string
  description?: string | null
}

interface DishSideCategory {
  id: string
  name: string
  description?: string | null
  isRequired: boolean
  maxSelections?: number | null
  order: number
}

interface DishRecord {
  id: string
  name: string
  description?: string | null
  price: number
  category: string
  isAvailable: boolean
  categories: DishCategoryTag[]
  sideCategories: DishSideCategory[]
}

interface SideCategoryRecord {
  id: string
  name: string
  description?: string | null
  isRequired: boolean
  maxSelections?: number | null
  order: number
}

interface CategoryOption {
  label: string
  value: string
  slug: string
}

interface SelectOption {
  label: string
  value: string
}

const auth = useAuthStore()
const { user } = storeToRefs(auth)
const { getCurrentUser } = auth

const router = useRouter()

const dishes = ref<DishRecord[]>([])
const categoryOptions = ref<CategoryOption[]>([])
const sideCategoryOptions = ref<SelectOption[]>([])
const isLoading = ref(false)

const page = ref(1)
const itemsPerPage = 10

const companyId = computed(() => user.value?.company?.id ?? '')

const totalPages = computed(() => Math.max(1, Math.ceil(dishes.value.length / itemsPerPage)))
const paginatedDishes = computed(() => {
  const start = (page.value - 1) * itemsPerPage
  return dishes.value.slice(start, start + itemsPerPage)
})

watch(() => dishes.value.length, () => {
  const maxPage = totalPages.value
  if (page.value > maxPage) {
    page.value = maxPage
  }
})

watch(page, (value) => {
  if (value < 1) {
    page.value = 1
  }
})
const goToCreate = () => {
  router.push('/admin/dishes/create')
}

const goToEdit = (id: string) => {
  router.push(`/admin/dishes/edit/${id}`)
}

const currencyFormatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

const defaultCategoryOptions: CategoryOption[] = [
  { label: 'Entradas', value: 'cat-entradas', slug: 'entradas' },
  { label: 'Pratos Principais', value: 'cat-pratos-principais', slug: 'pratos-principais' },
  { label: 'Sobremesas', value: 'cat-sobremesas', slug: 'sobremesas' },
  { label: 'Bebidas', value: 'cat-bebidas', slug: 'bebidas' },
  { label: 'Destaques do Chef', value: 'cat-destaques', slug: 'destaques' },
  { label: 'Opções Vegetarianas', value: 'cat-vegetariano', slug: 'vegetariano' },
]

const formatCategoryLabel = (slug: string) =>
  slug
    .split('-')
    .filter((segment) => segment.length)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ')

const syncCategoryOptions = (records: DishRecord[]) => {
  const map = new Map<string, CategoryOption>()
  for (const option of defaultCategoryOptions) {
    map.set(option.value, { ...option })
  }
  for (const record of records) {
    if (Array.isArray(record.categories) && record.categories.length) {
      for (const category of record.categories) {
        const value = category.id || category.slug
        if (!value) {
          continue
        }
        const slug = category.slug || category.id
        const label = category.name || formatCategoryLabel(slug)
        map.set(value, { value, label, slug })
      }
    } else if (record.category) {
      const slug = record.category
      const existing = defaultCategoryOptions.find((option) => option.slug === slug)
      if (existing) {
        map.set(existing.value, { ...existing })
      } else {
        const value = slug
        map.set(value, { value, label: formatCategoryLabel(slug), slug })
      }
    }
  }
  categoryOptions.value = Array.from(map.values()).sort((a, b) => a.label.localeCompare(b.label))
}

const normalizeDish = (dish: DishRecord): DishRecord => {
  const categories = Array.isArray(dish.categories)
    ? [...dish.categories]
        .map((category) => ({
          id: category.id,
          name: category.name ?? formatCategoryLabel(category.slug ?? category.id),
          slug: category.slug ?? category.id,
          description: category.description ?? null,
        }))
        .sort((a, b) => a.name.localeCompare(b.name))
    : []
  const sideCategories = Array.isArray(dish.sideCategories)
    ? [...dish.sideCategories].sort((a, b) => a.order - b.order)
    : []
  return {
    ...dish,
    categories,
    sideCategories,
  }
}

const fetchResources = async (id: string | undefined) => {
  if (!id) {
    dishes.value = []
    isLoading.value = false
    return
  }
  isLoading.value = true
  try {
    const [dishResponse, sideResponse] = await Promise.all([
      $fetch<{ success: boolean; data?: DishRecord[] }>(`/api/dishes?companyId=${id}`),
      $fetch<{ success: boolean; data?: SideCategoryRecord[] }>(`/api/side-categories?companyId=${id}`),
    ])
    const fetchedDishes = Array.isArray(dishResponse?.data) ? dishResponse.data.map(normalizeDish) : []
    dishes.value = fetchedDishes
    syncCategoryOptions(fetchedDishes)
    const fetchedSides = Array.isArray(sideResponse?.data) ? sideResponse.data : []
    sideCategoryOptions.value = fetchedSides
      .sort((a, b) => a.order - b.order)
      .map((category) => ({
        value: category.id,
        label: category.name,
      }))
  } catch (error) {
    console.error('Error fetching admin dishes resources:', error)
    dishes.value = []
  } finally {
    isLoading.value = false
  }
}



const deleteDish = async (id: string) => {
  if (!confirm('Tem certeza que deseja deletar este prato?')) {
    return
  }
  try {
    await $fetch(`/api/dishes/${id}`, { method: 'DELETE' })
    await fetchResources(companyId.value)
  } catch (error) {
    console.error('Error deleting dish:', error)
  }
}

const ensureResources = async () => {
  let id = companyId.value
  if (!id) {
    const currentUser = await getCurrentUser()
    id = currentUser?.company?.id
  }
  await fetchResources(id)
}

watch(
  companyId,
  (id) => {
    if (id) {
      fetchResources(id)
    }
  },
  { immediate: false }
)

onMounted(async () => {
  await ensureResources()
})
</script>
