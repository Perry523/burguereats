<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Gerenciar Categorias</h1>
        <p class="text-sm text-gray-500">Organize as categorias principais do cardápio.</p>
      </div>
      <NuxtLink to="/admin/categories/create">
        <button class="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary">
          Adicionar categoria
        </button>
      </NuxtLink>
    </div>

    <div class="rounded-lg border border-gray-200 bg-white shadow-sm">
      <div v-if="isLoading" class="space-y-4 p-6">
        <div class="h-6 w-1/3 rounded-lg bg-gray-200 animate-pulse"></div>
        <div v-for="index in 4" :key="`category-skeleton-${index}`" class="h-12 w-full rounded-lg bg-gray-100 animate-pulse"></div>
      </div>

      <div v-else-if="categories.length" class="space-y-6 p-6">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Ordem</th>
                <th class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Nome</th>
                <th class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Slug</th>
                <th class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Descrição</th>
                <th class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Atualizado</th>
                <th class="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">Ações</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="category in paginatedCategories" :key="category.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 text-sm text-gray-600">
                  {{ category.order }}
                </td>
                <td class="px-6 py-4 text-sm font-medium text-gray-900">
                  {{ category.name }}
                </td>
                <td class="px-6 py-4 text-sm text-gray-600">
                  {{ category.slug }}
                </td>
                <td class="px-6 py-4 text-sm text-gray-600">
                  {{ category.description || '-' }}
                </td>
                <td class="px-6 py-4 text-sm text-gray-600">
                  {{ formatDate(category.updatedAt) }}
                </td>
                <td class="px-6 py-4 text-right">
                  <div class="flex justify-end gap-2">
                    <NuxtLink :to="`/admin/categories/edit/${category.id}`">
                      <button class="rounded-lg border border-gray-200 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-100">
                        Editar
                      </button>
                    </NuxtLink>
                    <button
                      type="button"
                      class="rounded-lg border border-red-200 px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                      @click="deleteCategory(category.id)"
                    >
                      Remover
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
        <p class="text-gray-500">Nenhuma categoria cadastrada ainda</p>
        <NuxtLink to="/admin/categories/create">
          <button class="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary">
            Adicionar primeira categoria
          </button>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";

definePageMeta({
  layout: "admin",
});

interface CategoryRecord {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  order: number;
  companyId: string;
  createdAt: string;
  updatedAt: string;
}

const auth = useAuth();
const { user } = auth;
const { getCurrentUser } = auth;
const toast = useToast();

const categories = ref<CategoryRecord[]>([]);
const isLoading = ref(false);
const page = ref(1);
const itemsPerPage = 10;

const totalPages = computed(() => Math.max(1, Math.ceil(categories.value.length / itemsPerPage)));
const paginatedCategories = computed(() => {
  const start = (page.value - 1) * itemsPerPage;
  return categories.value.slice(start, start + itemsPerPage);
});

watch(
  () => categories.value.length,
  () => {
    const maxPage = totalPages.value;
    if (page.value > maxPage) {
      page.value = maxPage;
    }
  }
);

const formatDate = (value: string | Date | null | undefined) => {
  if (!value) return "Nunca";
  const date = new Date(value);
  if (isNaN(date.getTime())) return "Data inválida";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

const fetchCategories = async () => {
  const companyId = user.value?.company?.id;
  if (!companyId) {
    return;
  }
  isLoading.value = true;
  try {
    const response = await $fetch<{ success: boolean; data?: CategoryRecord[] }>(`/api/categories?companyId=${companyId}`);
    categories.value = Array.isArray(response?.data) ? response.data : [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    categories.value = [];
  } finally {
    isLoading.value = false;
  }
};

const deleteCategory = async (id: string) => {
  if (!confirm("Tem certeza que deseja remover esta categoria?")) {
    return;
  }

  try {
    await $fetch(`/api/categories/${id}`, { method: "DELETE" });
    toast.add({ color: "success", title: "Categoria removida" });
    await fetchCategories();
  } catch (error) {
    console.error("Error deleting category:", error);
    toast.add({ color: "error", title: "Erro ao remover categoria" });
  }
};

onMounted(async () => {
  if (!user.value?.company?.id) {
    await getCurrentUser();
  }
  await fetchCategories();
});
</script>
