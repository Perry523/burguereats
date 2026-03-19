<template>
  <div class="h-[calc(100vh-140px)] flex flex-col gap-4 pt-6">
    <TableBase
      class="flex-1 min-h-0 bg-white rounded-lg pt-5 pb-0 px-0 shadow-sm border border-gray-200"
      :loading="isLoading"
      :rows="paginatedProducts"
      :total-items="products.length"
      :columns="columns"
      v-model:page="page"
      v-model:per_page="perPage"
      @new="goToCreate"
      @edit="goToEdit($event.id)"
      @delete="deleteProduct($event.id)"
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
                placeholder="Buscar produtos por nome..."
              />
            </div>

            <!-- Category Filter -->
            <select
              v-model="categoryFilter"
              class="rounded-lg border border-gray-300 bg-white p-2 text-sm text-gray-700 shadow-sm focus:border-primary focus:ring-primary min-w-[150px]"
            >
              <option value="">Todas Categorias</option>
              <option v-for="cat in uniqueCategories" :key="cat" :value="cat">{{ cat }}</option>
            </select>

            <!-- Stock Filter -->
            <select
              v-model="stockFilter"
              class="rounded-lg border border-gray-300 bg-white p-2 text-sm text-gray-700 shadow-sm focus:border-primary focus:ring-primary min-w-[150px]"
            >
              <option value="all">Todo Estoque</option>
              <option value="low">Baixo Estoque (≤ 10)</option>
              <option value="out">Sem Estoque (0)</option>
              <option value="in_stock">Em Estoque (> 0)</option>
            </select>

            <!-- Order By -->
            <select
              v-model="orderBy"
              class="rounded-lg border border-gray-300 bg-white p-2 text-sm text-gray-700 shadow-sm focus:border-primary focus:ring-primary min-w-[150px]"
            >
              <option value="newest">Mais Recentes</option>
              <option value="oldest">Mais Antigos</option>
              <option value="name_asc">Nome (A-Z)</option>
              <option value="name_desc">Nome (Z-A)</option>
              <option value="price_desc">Maior Preço</option>
              <option value="price_asc">Menor Preço</option>
            </select>
          </div>

          <!-- Add Button moved inline with filters -->
          <button
            type="button"
            class="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary shadow-sm whitespace-nowrap"
            @click="goToCreate"
          >
            Adicionar Produto
          </button>
        </div>
      </template>



      <template #name="{ row }">
        <div class="flex items-center gap-3">
          <img
            v-if="row.image"
            :src="row.image"
            alt="Produto"
            class="h-10 w-10 rounded-lg object-cover"
          />
          <div
            v-else
            class="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center text-gray-500"
          >
            <UIcon name="i-heroicons-photo" class="h-6 w-6" />
          </div>
          <div>
            <p class="text-sm font-medium text-gray-900">
              {{ row.name }}
            </p>
          </div>
        </div>
      </template>

      <template #category="{ row }">
        <span
          class="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700"
        >
          {{ row.category }}
        </span>
      </template>

      <template #stock="{ row }">
        <span
          :class="[
            'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
            row.stock > 10
              ? 'bg-green-100 text-green-800'
              : row.stock > 0
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800',
          ]"
        >
          {{ row.stock }} un
        </span>
      </template>

      <template #sell_price="{ row }">
        <span class="font-semibold text-gray-900">
          {{ currencyFormatter.format(row.sell_price) }}
        </span>
      </template>
    </TableBase>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { storeToRefs } from "pinia";

definePageMeta({
  layout: "admin",
});

interface Product {
  id: string;
  company_id: string;
  name: string;
  category: string;
  sell_price: number;
  buy_price: number;
  stock: number;
  image?: string;
}

const auth = useAuthStore();
const { user } = storeToRefs(auth);
const { getCurrentUser } = auth;

const router = useRouter();

const products = ref<Product[]>([]);
const isLoading = ref(false);

const page = ref(1);
const perPage = ref(10);
const search = ref("");
const categoryFilter = ref("");
const stockFilter = ref("all");
const orderBy = ref("newest");

const uniqueCategories = computed(() => {
  const categories = new Set(products.value.map(p => p.category).filter(Boolean));
  return Array.from(categories).sort();
});

const companyId = computed(() => user.value?.company?.id ?? "");

const filteredProducts = computed(() => {
  let filtered = [...products.value];

  // Apply Search
  if (search.value) {
    const term = search.value.toLowerCase();
    filtered = filtered.filter(p => p.name.toLowerCase().includes(term));
  }

  // Apply Category Filter
  if (categoryFilter.value) {
    filtered = filtered.filter(p => p.category === categoryFilter.value);
  }

  // Apply Stock Filter
  if (stockFilter.value !== "all") {
    if (stockFilter.value === "low") {
      filtered = filtered.filter(p => p.stock > 0 && p.stock <= 10);
    } else if (stockFilter.value === "out") {
      filtered = filtered.filter(p => p.stock === 0);
    } else if (stockFilter.value === "in_stock") {
      filtered = filtered.filter(p => p.stock > 0);
    }
  }

  // Apply Sort
  filtered.sort((a, b) => {
    switch (orderBy.value) {
      case "name_asc":
        return a.name.localeCompare(b.name);
      case "name_desc":
        return b.name.localeCompare(a.name);
      case "price_asc":
        return a.sell_price - b.sell_price;
      case "price_desc":
        return b.sell_price - a.sell_price;
      case "oldest":
        // Fallback to original order (which is usually chronological if not sorted)
        // Since we can't reliably know creation date here unless we add it, we do a stable reverse.
        return 1; 
      case "newest":
      default:
        // By default the API returns newest first, so stable sort.
        return 0;
    }
  });

  return filtered;
});

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredProducts.value.length / perPage.value))
);

const paginatedProducts = computed(() => {
  const start = (page.value - 1) * perPage.value;
  return filteredProducts.value.slice(start, start + perPage.value);
});

const columns = [
  { key: "name", label: "Produto" },
  { key: "category", label: "Categoria" },
  { key: "sell_price", label: "Preço Venda", type: "currency" },
  { key: "stock", label: "Estoque" },
];

watch(
  () => products.value.length,
  () => {
    const maxPage = totalPages.value;
    if (page.value > maxPage) {
      page.value = maxPage;
    }
  }
);

watch(page, (value) => {
  if (value < 1) {
    page.value = 1;
  }
});

const goToCreate = () => {
  router.push("/admin/products/create");
};

const goToEdit = (id: string) => {
  router.push(`/admin/products/edit/${id}`);
};

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const fetchProducts = async (id: string | undefined) => {
  if (!id) {
    products.value = [];
    isLoading.value = false;
    return;
  }
  isLoading.value = true;
  try {
    const query = new URLSearchParams({ companyId: id, _t: Date.now().toString() });
    if (search.value) {
      query.append('search', search.value);
    }
    const response = await $fetch<{ success: boolean; data?: Product[] }>(
      `/api/products?${query.toString()}`
    );
    products.value = Array.isArray(response?.data) ? response.data : [];
  } catch (error) {
    console.error("Error fetching products:", error);
    products.value = [];
  } finally {
    isLoading.value = false;
  }
};

watch([search, categoryFilter, stockFilter, orderBy], () => {
  page.value = 1;
});

const deleteProduct = async (id: string) => {
  if (!confirm("Tem certeza que deseja deletar este produto?")) {
    return;
  }
  try {
    await $fetch(`/api/products/${id}`, { method: "DELETE" });
    await fetchProducts(companyId.value);
  } catch (error) {
    console.error("Error deleting product:", error);
  }
};

const ensureResources = async () => {
  let id = companyId.value;
  if (!id) {
    const currentUser = await getCurrentUser() as any;
    id = currentUser?.company?.id;
  }
  await fetchProducts(id);
};

watch(
  companyId,
  (id) => {
    if (id) {
      fetchProducts(id);
    }
  },
  { immediate: false }
);

onMounted(async () => {
  await ensureResources();
});
</script>
