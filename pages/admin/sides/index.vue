<template>
  <div>
    <div class="mb-8 flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-gray-800">Gerenciar Acompanhamentos</h1>
        <p class="text-sm text-gray-500">Organize categorias e itens de acompanhamentos para os pratos.</p>
      </div>
      <NuxtLink to="/admin/sides/create" rel="noopener noreferrer">
        <UButton color="primary">
          Adicionar Categoria
        </UButton>
      </NuxtLink>
    </div>

    <UCard class="bg-white shadow-md overflow-hidden">
      <div v-if="isLoading" class="space-y-4 p-6">
        <USkeleton class="h-6 w-1/3" />
        <USkeleton v-for="index in 4" :key="index" class="h-12 w-full" />
      </div>
      <div v-else-if="sideCategories.length > 0" class="space-y-6 ">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="border-b border-gray-200 bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Nome</th>
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Descrição</th>
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Itens</th>
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Obrigatório</th>
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Max. Seleções</th>
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Ordem</th>
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Ações</th>
              </tr>
            </thead>
            <tbody class="divide-y">
              <tr v-for="category in paginatedSideCategories" :key="category.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 text-sm font-medium text-gray-900">
                  {{ category.name }}
                </td>
                <td class="px-6 py-4 text-sm text-gray-600">
                  {{ category.description || '-' }}
                </td>
                <td class="px-6 py-4 text-sm text-gray-600">
                  <UBadge color="gray">
                    {{ category.sides?.length || 0 }} itens
                  </UBadge>
                </td>
                <td class="px-6 py-4 text-sm">
                  <UBadge :color="category.isRequired ? 'warning' : 'gray'">
                    {{ category.isRequired ? 'Sim' : 'Não' }}
                  </UBadge>
                </td>
                <td class="px-6 py-4 text-sm text-gray-600">
                  {{ category.maxSelections || 'Ilimitado' }}
                </td>
                <td class="px-6 py-4 text-sm text-gray-600">
                  {{ category.order }}
                </td>
                <td class="px-6 py-4 text-sm space-x-2">
                  <NuxtLink :to="`/admin/sides/edit/${category.id}`" rel="noopener noreferrer">
                    <UButton
                      size="xs"
                      color="primary"
                      variant="soft"
                    >
                      Editar
                    </UButton>
                  </NuxtLink>
                  <UButton
                    @click="deleteCategory(category.id)"
                    size="xs"
                    color="error"
                    variant="soft"
                  >
                    Deletar
                  </UButton>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p class="text-sm text-gray-500">
            Página {{ page }} de {{ totalPages }}
          </p>
          <UPagination v-model:page="page" :total="sideCategories.length" :items-per-page="itemsPerPage" />
        </div>
      </div>
      <div v-else class="py-12 text-center">
        <p class="text-gray-500">Nenhuma categoria de acompanhamento adicionada ainda</p>
        <NuxtLink to="/admin/sides/create" rel="noopener noreferrer">
          <UButton class="mt-4" color="primary">
            Adicionar primeira categoria
          </UButton>
        </NuxtLink>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
})

interface SideItem {
  id: string
  name: string
  description?: string | null
  priceIncrement: number
  image?: string | null
  isAvailable: boolean
  categoryId: string
  createdAt: Date
  updatedAt: Date
}

interface SideCategoryRecord {
  id: string
  name: string
  description?: string | null
  isRequired: boolean
  maxSelections?: number | null
  order: number
  companyId: string
  createdAt: Date
  updatedAt: Date
  sides?: SideItem[]
}

const auth = useAuth()
const { user } = auth
const { getCurrentUser } = auth

const sideCategories = ref<SideCategoryRecord[]>([])
const isLoading = ref(false)

const page = ref(1)
const itemsPerPage = 10

const totalPages = computed(() => Math.max(1, Math.ceil(sideCategories.value.length / itemsPerPage)))
const paginatedSideCategories = computed(() => {
  const start = (page.value - 1) * itemsPerPage
  return sideCategories.value.slice(start, start + itemsPerPage)
})

watch(() => sideCategories.value.length, () => {
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

const fetchSideCategories = async () => {
  const companyId = user.value?.company?.id
  if (!companyId) {
    return
  }
  
  isLoading.value = true
  try {
    const response = await $fetch<{ success: boolean; data?: SideCategoryRecord[] }>(`/api/side-categories?companyId=${companyId}`)
    sideCategories.value = Array.isArray(response?.data) ? response.data : []
  } catch (error) {
    console.error('Error fetching side categories:', error)
    sideCategories.value = []
  } finally {
    isLoading.value = false
  }
}

const deleteCategory = async (id: string) => {
  if (!confirm('Tem certeza que deseja deletar esta categoria? Todos os itens associados também serão removidos.')) {
    return
  }
  
  try {
    await $fetch(`/api/side-categories/${id}`, { method: 'DELETE' })
    await fetchSideCategories()
  } catch (error) {
    console.error('Error deleting side category:', error)
    alert('Erro ao deletar categoria. Tente novamente.')
  }
}

onMounted(async () => {
  if (!user.value?.company?.id) {
    await getCurrentUser()
  }
  await fetchSideCategories()
})
</script>
