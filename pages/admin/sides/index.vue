<template>
  <div class="h-[calc(100vh-128px)] flex flex-col gap-4 pt-0 md:pt-6">
    <TableBase
      class="flex-1 min-h-0 bg-white rounded-lg pt-2 md:pt-5 pb-0 px-0 shadow-sm border border-gray-200"
      :loading="isLoading"
      :rows="paginatedSideCategories"
      :total-items="sideCategories.length"
      :columns="columns"
      v-model:page="page"
      v-model:per_page="itemsPerPage"
      @edit="goToEdit($event.id)"
      @delete="deleteCategory($event.id)"
    >
      <template #filter>
        <div
          class="w-full px-5 pb-4 flex flex-wrap items-center justify-between gap-4"
        >
          <div class="flex flex-wrap items-center gap-4 flex-1">
            <!-- Search by Name -->
            <div class="relative w-full max-w-sm">
              <div
                class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
              >
                <UIcon
                  name="i-heroicons-magnifying-glass"
                  class="h-5 w-5 text-gray-400"
                />
              </div>
              <input
                id="search"
                v-model="search"
                type="text"
                class="block w-full rounded-lg border border-gray-300 bg-white p-2 pl-10 text-sm focus:border-primary focus:ring-primary shadow-sm"
                placeholder="Buscar categorias por nome..."
              />
            </div>

            <!-- Required Filter -->
            <select
              v-model="requiredFilter"
              class="rounded-lg border border-gray-300 bg-white p-2 text-sm text-gray-700 shadow-sm focus:border-primary focus:ring-primary min-w-[150px]"
            >
              <option value="all">Todos (Obrigatórios e Não)</option>
              <option value="yes">Obrigatórios Apenas</option>
              <option value="no">Opcionais Apenas</option>
            </select>

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

          <NuxtLink to="/admin/sides/create" rel="noopener noreferrer">
            <button
              class="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary shadow-sm whitespace-nowrap"
            >
              Adicionar Categoria
            </button>
          </NuxtLink>
        </div>
      </template>

      <template #description="{ row }">
        <span class="text-sm text-gray-600">
          {{ row.description || "-" }}
        </span>
      </template>

      <template #items="{ row }">
        <span
          class="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700"
        >
          {{ row.sides?.length || 0 }} itens
        </span>
      </template>

      <template #required="{ row }">
        <span
          :class="[
            'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium',
            row.isRequired
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-gray-100 text-gray-700',
          ]"
        >
          {{ row.isRequired ? "Sim" : "Não" }}
        </span>
      </template>

      <template #max_selections="{ row }">
        <span class="text-sm text-gray-600">
          {{ row.maxSelections || "Ilimitado" }}
        </span>
      </template>

      <template #order="{ row }">
        <span class="text-sm text-gray-600">
          {{ row.order }}
        </span>
      </template>
    </TableBase>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "admin",
});

interface SideItem {
  id: string;
  name: string;
  description?: string | null;
  priceIncrement: number;
  image?: string | null;
  isAvailable: boolean;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface SideCategoryRecord {
  id: string;
  name: string;
  description?: string | null;
  isRequired: boolean;
  maxSelections?: number | null;
  order: number;
  companyId: string;
  createdAt: Date;
  updatedAt: Date;
  sides?: SideItem[];
}

const auth = useAuth();
const { user } = auth;
const { getCurrentUser } = auth;

const sideCategories = ref<SideCategoryRecord[]>([]);
const isLoading = ref(false);

const page = ref(1);
const itemsPerPage = ref(10);

const search = ref("");
const requiredFilter = ref("all");
const orderBy = ref("order_asc");

const filteredSideCategories = computed(() => {
  let filtered = [...sideCategories.value];

  // Apply Search
  if (search.value) {
    const term = search.value.toLowerCase();
    filtered = filtered.filter(
      (c) =>
        c.name.toLowerCase().includes(term) ||
        (c.description && c.description.toLowerCase().includes(term)),
    );
  }

  // Apply Required Filter
  if (requiredFilter.value !== "all") {
    const isReq = requiredFilter.value === "yes";
    filtered = filtered.filter((c) => c.isRequired === isReq);
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
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      case "newest":
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      default:
        return 0;
    }
  });

  return filtered;
});

const totalPages = computed(() =>
  Math.max(
    1,
    Math.ceil(filteredSideCategories.value.length / itemsPerPage.value),
  ),
);
const paginatedSideCategories = computed(() => {
  const start = (page.value - 1) * itemsPerPage.value;
  return filteredSideCategories.value.slice(start, start + itemsPerPage.value);
});

watch([search, requiredFilter, orderBy], () => {
  page.value = 1;
});

const columns = [
  { key: "name", label: "Nome" },
  { key: "description", label: "Descrição", sm: true },
  { key: "items", label: "Itens" },
  { key: "required", label: "Obrigatório" },
  { key: "max_selections", label: "Max. Seleções", sm: true },
  { key: "order", label: "Ordem", sm: true },
];

const goToEdit = (id: string) => {
  navigateTo(`/admin/sides/edit/${id}`);
};

watch(
  () => sideCategories.value.length,
  () => {
    const maxPage = totalPages.value;
    if (page.value > maxPage) {
      page.value = maxPage;
    }
  },
);

watch(page, (value) => {
  if (value < 1) {
    page.value = 1;
  }
});

const fetchSideCategories = async () => {
  const companyId = user.value?.company?.id;
  if (!companyId) {
    return;
  }

  isLoading.value = true;
  try {
    const response = await $fetch<{
      success: boolean;
      data?: SideCategoryRecord[];
    }>(`/api/side-categories?companyId=${companyId}`);
    sideCategories.value = Array.isArray(response?.data) ? response.data : [];
  } catch (error) {
    console.error("Error fetching side categories:", error);
    sideCategories.value = [];
  } finally {
    isLoading.value = false;
  }
};

const deleteCategory = async (id: string) => {
  if (
    !confirm(
      "Tem certeza que deseja deletar esta categoria? Todos os itens associados também serão removidos.",
    )
  ) {
    return;
  }

  try {
    await $fetch(`/api/side-categories/${id}`, { method: "DELETE" });
    await fetchSideCategories();
  } catch (error) {
    console.error("Error deleting side category:", error);
    alert("Erro ao deletar categoria. Tente novamente.");
  }
};

onMounted(async () => {
  if (!user.value?.company?.id) {
    await getCurrentUser();
  }
  await fetchSideCategories();
});
</script>
