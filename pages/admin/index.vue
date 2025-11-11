<template>
  <div>
    <h1 class="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <UCard class="bg-white shadow-md">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-500 text-sm">Total de Pratos</p>
            <p class="text-3xl font-bold text-primary">{{ dishes.length }}</p>
          </div>
          <UIcon name="i-heroicons-document" class="w-12 h-12 text-orange-200" />
        </div>
      </UCard>

      <UCard class="bg-white shadow-md">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-500 text-sm">Pratos Disponíveis</p>
            <p class="text-3xl font-bold text-green-500">{{ availableDishes }}</p>
          </div>
          <UIcon name="i-heroicons-check" class="w-12 h-12 text-green-200" />
        </div>
      </UCard>

      <UCard class="bg-white shadow-md">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-500 text-sm">Pratos Indisponíveis</p>
            <p class="text-3xl font-bold text-red-500">{{ unavailableDishes }}</p>
          </div>
          <UIcon name="i-heroicons-x-mark" class="w-12 h-12 text-red-200" />
        </div>
      </UCard>
    </div>

    <UCard class="bg-white shadow-md">
      <h2 class="text-xl font-semibold text-gray-800 mb-4">Últimos Pratos Adicionados</h2>
      <div v-if="dishes.length > 0" class="space-y-2">
        <div v-for="dish in recentDishes" :key="dish.id" class="flex items-center justify-between p-3 bg-gray-50 rounded">
          <div>
            <p class="font-medium text-gray-800">{{ dish.name }}</p>
            <p class="text-sm text-gray-500">{{ dish.category }}</p>
          </div>
          <p class="font-bold text-primary">R$ {{ dish.price.toFixed(2) }}</p>
        </div>
      </div>
      <div v-else class="text-center py-8">
        <p class="text-gray-500">Nenhum prato adicionado ainda</p>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
})

type Dish = {
  id: string
  name: string
  category: string
  price: number
  isAvailable: boolean
}

const { user } = useAuthStore()
const dishes = ref<Dish[]>([])
const isLoading = ref(true)

const availableDishes = computed(() => dishes.value.filter((d: any) => d.isAvailable).length)
const unavailableDishes = computed(() => dishes.value.filter((d: any) => !d.isAvailable).length)
const recentDishes = computed(() => dishes.value.slice(0, 5))

onMounted(async () => {
  console.log('opa')
  try {
    if (!user?.company?.id) {
      await useAuth().getCurrentUser()
    }
    const { data } = await $fetch(`/api/dishes?companyId=${user?.company.id}`)
    console.log('data', data)
    dishes.value = data 
  } catch (error) {
    console.error('Error fetching dishes:', error)
  } finally {
    isLoading.value = false
  }
})
</script>
