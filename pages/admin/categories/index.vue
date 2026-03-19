<template>
  <div class="h-[calc(100vh-140px)] flex flex-col gap-4 pt-6">
    <TableBase
      class="flex-1 min-h-0 bg-white rounded-lg pt-5 pb-0 px-0 shadow-sm border border-gray-200"
      :loading="isLoading"
      :rows="paginatedCategories"
      :total-items="categories.length"
      :columns="columns"
      v-model:page="page"
      v-model:per_page="itemsPerPage"
      @edit="goToEdit($event.id)"
      @delete="deleteCategory($event.id)"
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
                placeholder="Buscar categorias por nome..."
              />
            </div>

            <!-- Order By -->
            <select
              v-model="orderBy"
              class="rounded-lg border border-gray-300 bg-white p-2 text-sm text-gray-700 shadow-sm focus:border-primary focus:ring-primary min-w-[150px]"
            >
              <option value="order_asc">Ordem (Crescente)</option>
              <option value="order_desc">Ordem (Decrescente)</option>
              <option value="name_asc">Nome (A-Z)</option>
              <option value="name_desc">Nome (Z-A)</option>
              <option value="newest">Mais Recentes</option>
              <option value="oldest">Mais Antigos</option>
            </select>
          </div>

          <NuxtLink to="/admin/categories/create">
            <button
              type="button"
              class="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary shadow-sm whitespace-nowrap"
            >
              Adicionar categoria
            </button>
          </NuxtLink>
        </div>
      </template>

      <template #description="{ row }">
        <span class="text-sm text-gray-600">
          {{ row.description || '-' }}
        </span>
      </template>

      <template #updatedAt="{ row }">
        <span class="text-sm text-gray-600">
          {{ formatDate(row.updatedAt) }}
        </span>
      </template>
    </TableBase>
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
const itemsPerPage = ref(10);

const search = ref("");
const orderBy = ref("order_asc");

const filteredCategories = computed(() => {
  let filtered = [...categories.value];

  // Apply Search
  if (search.value) {
    const term = search.value.toLowerCase();
    filtered = filtered.filter(c => c.name.toLowerCase().includes(term));
  }

  // Apply Sort
  filtered.sort((a, b) => {
    switch (orderBy.value) {
      case "name_asc":
        return a.name.localeCompare(b.name);
      case "name_desc":
        return b.name.localeCompare(a.name);
      case "order_asc":
        return a.order - b.order;
      case "order_desc":
        return b.order - a.order;
      case "oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      default:
        return 0;
    }
  });

  return filtered;
});

const totalPages = computed(() => Math.max(1, Math.ceil(filteredCategories.value.length / itemsPerPage.value)));
const paginatedCategories = computed(() => {
  const start = (page.value - 1) * itemsPerPage.value;
  return filteredCategories.value.slice(start, start + itemsPerPage.value);
});

watch([search, orderBy], () => {
  page.value = 1;
});

const columns = [
  { key: "order", label: "Ordem", sm: true },
  { key: "name", label: "Nome" },
  { key: "slug", label: "Slug", sm: true },
  { key: "description", label: "Descrição", sm: true },
  { key: "updatedAt", label: "Atualizado", sm: true },
];

const goToEdit = (id: string) => {
  navigateTo(`/admin/categories/edit/${id}`);
};

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
