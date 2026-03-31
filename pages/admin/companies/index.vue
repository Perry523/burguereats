<template>
  <div class="h-[calc(100vh-128px)] flex flex-col gap-4 pt-0 md:pt-6">
    <TableBase
      class="flex-1 min-h-0 bg-white rounded-lg pt-2 md:pt-5 pb-0 px-0 shadow-sm border border-gray-200"
      :loading="isLoading"
      :rows="paginatedCompanies"
      :total-items="companies.length"
      :columns="columns"
      :actions="tableActions"
      v-model:page="page"
      v-model:per_page="itemsPerPage"
      @edit="goToEdit($event.id)"
      hide-delete
    >
      <template #filter>
        <div class="w-full px-5 pb-4 flex items-center justify-between gap-2">
          <!-- Search Bar -->
          <div class="relative flex-1 max-w-sm">
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
              class="block w-full rounded-lg border border-gray-300 bg-white p-2.5 pl-10 text-sm focus:border-primary focus:ring-primary shadow-sm"
              placeholder="Buscar empresa por nome ou email..."
            />
          </div>

          <!-- Action Buttons -->
          <div class="flex items-center gap-2 shrink-0">
            <NuxtLink to="/admin/companies/create">
              <button
                class="flex items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2.5 sm:px-4 text-sm font-medium text-white transition-colors hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 shadow-sm whitespace-nowrap"
                title="Adicionar Empresa"
              >
                <UIcon name="i-heroicons-plus" class="h-5 w-5" />
                <span class="hidden sm:inline">Adicionar</span>
              </button>
            </NuxtLink>
          </div>
        </div>
      </template>

      <template #logo="{ row }">
        <div class="flex items-center gap-3">
          <UAvatar :src="row.logo" :alt="row.name" size="sm" />
          <span class="font-medium text-gray-900">{{ row.name }}</span>
        </div>
      </template>

      <template #type="{ row }">
        <span
          :class="[
            'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium',
            row.type === 'restaurant'
              ? 'bg-orange-100 text-orange-800'
              : 'bg-purple-100 text-purple-800',
          ]"
        >
          {{ row.type === "restaurant" ? "Restaurante" : "Delivery" }}
        </span>
      </template>

      <template #created_at="{ row }">
        <span class="text-sm text-gray-500">
          {{ formatDate(row.createdAt) }}
        </span>
      </template>
    </TableBase>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "~/stores/auth";

definePageMeta({
  layout: "admin",
});

const auth = useAuthStore();
const router = useRouter();

interface Company {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: string;
  logo: string;
  createdAt: string;
}

const companies = ref<Company[]>([]);
const isLoading = ref(false);

const page = ref(1);
const itemsPerPage = ref(10);
const search = ref("");

const filteredCompanies = computed(() => {
  let filtered = [...companies.value];

  if (search.value) {
    const term = search.value.toLowerCase();
    filtered = filtered.filter(
      (c) =>
        c.name?.toLowerCase().includes(term) ||
        c.email?.toLowerCase().includes(term),
    );
  }

  // Sort by newest
  filtered.sort(
    (a, b) =>
      new Date(b.createdAt || 0).getTime() -
      new Date(a.createdAt || 0).getTime(),
  );

  return filtered;
});

const paginatedCompanies = computed(() => {
  const start = (page.value - 1) * itemsPerPage.value;
  return filteredCompanies.value.slice(start, start + itemsPerPage.value);
});

watch(search, () => {
  page.value = 1;
});

const columns = [
  { key: "logo", label: "Empresa", sm: true },
  { key: "email", label: "Email", sm: true },
  { key: "type", label: "Tipo" },
  { key: "created_at", label: "Data de Criação" },
];

const goToEdit = (id: string) => {
  router.push(`/admin/companies/${id}`);
};

const tableActions: any[] = [];

const formatDate = (dateString: string) => {
  if (!dateString) return "-";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(dateString));
};

const fetchCompanies = async () => {
  isLoading.value = true;
  try {
    const response = await $fetch<{ success: boolean; data?: Company[] }>(
      "/api/companies",
    );
    if (response?.success && Array.isArray(response.data)) {
      companies.value = response.data;
    }
  } catch (error) {
    console.error("Error fetching companies:", error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  if (auth.user?.role !== "admin") {
    router.replace("/admin");
    return;
  }
  fetchCompanies();
});
</script>
