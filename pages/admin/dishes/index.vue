<template>
  <div class="h-[calc(100vh-140px)] flex flex-col gap-4 pt-6">
    <TableBase
      class="flex-1 min-h-0 bg-white rounded-lg pt-5 pb-0 px-0 shadow-sm border border-gray-200"
      :loading="isLoading"
      :rows="paginatedDishes"
      :total-items="dishes.length"
      :columns="columns"
      v-model:page="page"
      v-model:per_page="itemsPerPage"
      @edit="goToEdit($event.id)"
      @delete="deleteDish($event.id)"
    >
      <template #filter>
        <div class="w-full px-5 pb-4 flex flex-wrap items-center justify-between gap-4">
          <div class="flex flex-wrap items-center gap-4 flex-1">
            <!-- Search by Name -->
            <div class="relative w-full max-w-sm">
              <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <UIcon name="i-heroicons-magnifying-glass" class="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="search"
                v-model="search"
                type="text"
                class="block w-full rounded-lg border border-gray-300 bg-white p-2 pl-10 text-sm focus:border-primary focus:ring-primary shadow-sm"
                placeholder="Buscar pratos por nome..."
              />
            </div>

            <!-- Category Filter -->
            <select
              v-model="categoryFilter"
              class="rounded-lg border border-gray-300 bg-white p-2 text-sm text-gray-700 shadow-sm focus:border-primary focus:ring-primary min-w-[150px]"
            >
              <option value="">Todas Categorias</option>
              <option v-for="cat in categoryOptions" :key="cat.value" :value="cat.value">{{ cat.label }}</option>
            </select>

            <!-- Order By -->
            <select
              v-model="orderBy"
              class="rounded-lg border border-gray-300 bg-white p-2 text-sm text-gray-700 shadow-sm focus:border-primary focus:ring-primary min-w-[150px]"
            >
              <option value="name_asc">Nome (A-Z)</option>
              <option value="name_desc">Nome (Z-A)</option>
              <option value="price_desc">Maior Preço</option>
              <option value="price_asc">Menor Preço</option>
              <option value="newest">Mais Recentes</option>
              <option value="oldest">Mais Antigos</option>
            </select>
          </div>

          <button
            type="button"
            class="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary shadow-sm whitespace-nowrap"
            @click="goToCreate"
          >
            Adicionar Prato
          </button>
        </div>
      </template>

      <template #dish="{ row }">
        <div class="flex items-center gap-3">
          <img
            v-if="row.image"
            :src="row.image"
            alt="Prato"
            class="h-10 w-10 rounded-lg object-cover"
          />
          <div>
            <p class="text-sm font-medium text-gray-900">{{ row.name }}</p>
            <p v-if="row.description" class="text-xs text-gray-500 truncate max-w-xs">
              {{ row.description }}
            </p>
          </div>
        </div>
      </template>

      <template #categories="{ row }">
        <div class="flex flex-wrap gap-2">
          <span
            v-for="category in row.categories"
            :key="category.id || category.slug"
            class="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700"
          >
            {{ category.name }}
          </span>
          <span
            v-if="row.categories.length === 0"
            class="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700"
          >
            {{ row.category ? formatCategoryLabel(row.category) : 'Sem categoria' }}
          </span>
        </div>
      </template>
    </TableBase>
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
const itemsPerPage = ref(10)
const search = ref("")
const categoryFilter = ref("")
const orderBy = ref("newest")

const companyId = computed(() => user.value?.company?.id ?? '')

const filteredDishes = computed(() => {
  let filtered = [...dishes.value]

  // Apply Search
  if (search.value) {
    const term = search.value.toLowerCase()
    filtered = filtered.filter(d => 
      d.name.toLowerCase().includes(term) || 
      (d.description && d.description.toLowerCase().includes(term))
    )
  }

  // Apply Category Filter
  if (categoryFilter.value) {
    filtered = filtered.filter(d => {
      // Check if it's in the categories array
      if (d.categories && d.categories.length > 0) {
        return d.categories.some(c => c.id === categoryFilter.value || c.slug === categoryFilter.value)
      }
      // Or fallback to direct category matches
      return d.category === categoryFilter.value
    })
  }

  // Apply Sort
  filtered.sort((a, b) => {
    switch (orderBy.value) {
      case "name_asc":
        return a.name.localeCompare(b.name)
      case "name_desc":
        return b.name.localeCompare(a.name)
      case "price_asc":
        return a.price - b.price
      case "price_desc":
        return b.price - a.price
      case "oldest":
        return 1
      case "newest":
      default:
        return 0
    }
  })

  return filtered
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredDishes.value.length / itemsPerPage.value)))
const paginatedDishes = computed(() => {
  const start = (page.value - 1) * itemsPerPage.value
  return filteredDishes.value.slice(start, start + itemsPerPage.value)
})

watch([search, categoryFilter, orderBy], () => {
  page.value = 1
})

const columns = [
  { key: "dish", label: "Prato" },
  { key: "categories", label: "Categorias" },
  { key: "price", label: "Preço", type: "currency" },
];

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
    await getCurrentUser()
    id = user.value?.company?.id ?? ''
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
