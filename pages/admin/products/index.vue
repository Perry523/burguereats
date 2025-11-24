<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-gray-800">Gerenciar Produtos</h1>
        <p class="text-sm text-gray-500">
          Gerencie o estoque e preços dos seus produtos.
        </p>
      </div>
      <button
        type="button"
        class="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary"
        @click="goToCreate"
      >
        Adicionar Produto
      </button>
    </div>

    <div class="rounded-lg border border-gray-200 bg-white shadow-sm">
      <div v-if="isLoading" class="space-y-4 p-6">
        <div class="h-6 w-1/3 rounded-lg bg-gray-200 animate-pulse"></div>
        <div
          v-for="index in 4"
          :key="`product-skeleton-${index}`"
          class="h-12 w-full rounded-lg bg-gray-100 animate-pulse"
        ></div>
      </div>

      <div v-else-if="products.length" class="space-y-6 p-6">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
                >
                  Produto
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
                >
                  Categoria
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
                >
                  Preço Venda
                </th>
                <!-- <th class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Preço Compra</th> -->
                <th
                  class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
                >
                  Estoque
                </th>
                <th
                  class="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500"
                >
                  Ações
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr
                v-for="product in paginatedProducts"
                :key="product.id"
                class="hover:bg-gray-50"
              >
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <img
                      v-if="product.image"
                      :src="product.image"
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
                        {{ product.name }}
                      </p>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <span
                    class="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700"
                  >
                    {{ product.category }}
                  </span>
                </td>
                <td class="px-6 py-4 text-sm font-semibold text-gray-900">
                  {{ currencyFormatter.format(product.sell_price) }}
                </td>
                <!-- <td class="px-6 py-4 text-sm text-gray-500">
                  {{ currencyFormatter.format(product.buy_price) }}
                </td> -->
                <td class="px-6 py-4">
                  <span
                    :class="[
                      'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                      product.stock > 10
                        ? 'bg-green-100 text-green-800'
                        : product.stock > 0
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800',
                    ]"
                  >
                    {{ product.stock }} un
                  </span>
                </td>
                <td class="px-6 py-4">
                  <div class="flex justify-end gap-2">
                    <button
                      type="button"
                      class="rounded-lg border border-gray-200 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-100"
                      @click="goToEdit(product.id)"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      class="rounded-lg border border-red-200 px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                      @click="deleteProduct(product.id)"
                    >
                      Deletar
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div
          class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
        >
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
        <p class="text-gray-500">Nenhum produto adicionado ainda</p>
        <button
          type="button"
          class="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary"
          @click="goToCreate"
        >
          Adicionar primeiro produto
        </button>
      </div>
    </div>
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
const itemsPerPage = 10;

const companyId = computed(() => user.value?.company?.id ?? "");

const totalPages = computed(() =>
  Math.max(1, Math.ceil(products.value.length / itemsPerPage))
);
const paginatedProducts = computed(() => {
  const start = (page.value - 1) * itemsPerPage;
  return products.value.slice(start, start + itemsPerPage);
});

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
    const response = await $fetch<{ success: boolean; data?: Product[] }>(
      `/api/products?companyId=${id}`
    );
    products.value = Array.isArray(response?.data) ? response.data : [];
  } catch (error) {
    console.error("Error fetching products:", error);
    products.value = [];
  } finally {
    isLoading.value = false;
  }
};

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
    const currentUser = await getCurrentUser();
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
