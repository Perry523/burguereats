<template>
  <div>
    <h1 class="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <UCard class="bg-white shadow-md">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-500 text-sm">Total de Pratos</p>
            <p class="text-3xl font-bold text-primary">{{ dishes.length }}</p>
          </div>
          <UIcon
            name="i-heroicons-document"
            class="w-12 h-12 text-orange-200"
          />
        </div>
      </UCard>

      <UCard class="bg-white shadow-md">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-500 text-sm">Pratos Disponíveis</p>
            <p class="text-3xl font-bold text-green-500">
              {{ availableDishes }}
            </p>
          </div>
          <UIcon name="i-heroicons-check" class="w-12 h-12 text-green-200" />
        </div>
      </UCard>

      <UCard class="bg-white shadow-md">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-500 text-sm">Total de Produtos</p>
            <p class="text-3xl font-bold text-blue-500">
              {{ products.length }}
            </p>
          </div>
          <UIcon name="i-heroicons-cube" class="w-12 h-12 text-blue-200" />
        </div>
      </UCard>

      <UCard class="bg-white shadow-md">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-500 text-sm">Estoque Baixo</p>
            <p class="text-3xl font-bold text-red-500">
              {{ lowStockProducts }}
            </p>
          </div>
          <UIcon
            name="i-heroicons-exclamation-triangle"
            class="w-12 h-12 text-red-200"
          />
        </div>
      </UCard>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <UCard class="bg-white shadow-md">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">
          Últimos Pratos Adicionados
        </h2>
        <div v-if="dishes.length > 0" class="space-y-2">
          <div
            v-for="dish in recentDishes"
            :key="dish.id"
            class="flex items-center justify-between p-3 bg-gray-50 rounded"
          >
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

      <UCard class="bg-white shadow-md">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">
          Últimos Produtos Adicionados
        </h2>
        <div v-if="products.length > 0" class="space-y-2">
          <div
            v-for="product in recentProducts"
            :key="product.id"
            class="flex items-center justify-between p-3 bg-gray-50 rounded"
          >
            <div>
              <p class="font-medium text-gray-800">{{ product.name }}</p>
              <p class="text-sm text-gray-500">Estoque: {{ product.stock }}</p>
            </div>
            <p class="font-bold text-blue-600">
              R$ {{ product.sell_price.toFixed(2) }}
            </p>
          </div>
        </div>
        <div v-else class="text-center py-8">
          <p class="text-gray-500">Nenhum produto adicionado ainda</p>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "admin",
});

type Dish = {
  id: string;
  name: string;
  category: string;
  price: number;
  isAvailable: boolean;
};

type Product = {
  id: string;
  name: string;
  category: string;
  sell_price: number;
  stock: number;
};

const { user } = useAuthStore();
const dishes = ref<Dish[]>([]);
const products = ref<Product[]>([]);
const isLoading = ref(true);

const availableDishes = computed(
  () => dishes.value.filter((d) => d.isAvailable).length
);
const recentDishes = computed(() => dishes.value.slice(0, 5));

const lowStockProducts = computed(
  () => products.value.filter((p) => p.stock < 10).length
);
const recentProducts = computed(() => products.value.slice(0, 5));

onMounted(async () => {
  try {
    if (!user?.company?.id) {
      await useAuth().getCurrentUser();
    }
    const companyId = user?.company?.id;
    if (companyId) {
      const [dishesResponse, productsResponse] = await Promise.all([
        $fetch<{ data: Dish[] }>(`/api/dishes?companyId=${companyId}`),
        $fetch<{ data: Product[] }>(`/api/products?companyId=${companyId}`),
      ]);

      dishes.value = dishesResponse.data || [];
      products.value = productsResponse.data || [];
    }
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
  } finally {
    isLoading.value = false;
  }
});
</script>
