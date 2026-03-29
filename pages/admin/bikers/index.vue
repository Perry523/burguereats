<template>
  <div class="h-[calc(100vh-128px)] flex flex-col gap-4 pt-0 md:pt-6">
    <TableBase
      class="flex-1 min-h-0 bg-white rounded-lg pt-2 md:pt-5 pb-0 px-0 shadow-sm border border-gray-200"
      :loading="isLoading"
      :rows="filteredBikers"
      :total-items="filteredBikers.length"
      :columns="columns"
      :actions="tableActions"
      v-model:page="page"
      v-model:per_page="itemsPerPage"
      hide-edit
      hide-delete
    >
      <template #filter>
        <div
          class="w-full px-5 pb-4 flex flex-wrap items-center justify-between gap-4"
        >
          <div class="flex flex-wrap items-center gap-4 flex-1">
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
                placeholder="Buscar entregador..."
              />
            </div>
          </div>

          <NuxtLink to="/admin/bikers/create">
            <button
              class="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 shadow-sm whitespace-nowrap"
            >
              <UIcon name="i-heroicons-plus" class="h-5 w-5" />
              Adicionar
            </button>
          </NuxtLink>
        </div>
      </template>

      <template #status="{ row }">
        <span
          :class="[
            'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium',
            row.isActive
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800',
          ]"
        >
          {{ row.isActive ? "Ativo" : "Inativo" }}
        </span>
      </template>
    </TableBase>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";

definePageMeta({
  layout: "admin",
});

interface Biker {
  id: string;
  name: string;
  email: string;
  phone: string;
  isActive: boolean;
  createdAt: string;
}

const auth = useAuthStore();
const { user, currentCompanyId } = storeToRefs(auth);

const bikers = ref<Biker[]>([]);
const isLoading = ref(false);
const search = ref("");
const page = ref(1);
const itemsPerPage = ref(10);

const companyId = computed(() => {
  if (user.value?.role === "admin") return "";
  return currentCompanyId.value || "";
});

const filteredBikers = computed(() => {
  if (!search.value) return bikers.value;
  const term = search.value.toLowerCase();
  return bikers.value.filter(
    (b) =>
      b.name.toLowerCase().includes(term) ||
      b.email.toLowerCase().includes(term),
  );
});

const columns = [
  { key: "name", label: "Nome", sm: true },
  { key: "email", label: "Email" },
  { key: "phone", label: "Telefone" },
  { key: "status", label: "Status" },
];

const tableActions: any[] = [
  {
    name: "Ver Detalhes",
    action: (row: any) => navigateTo(`/admin/bikers/${row.id}`),
  },
];

const fetchBikers = async (companyId: string) => {
  isLoading.value = true;
  try {
    const response = await $fetch<{ success: boolean; data?: Biker[] }>(
      `/api/bikers?companyId=${companyId}`,
    );
    bikers.value = Array.isArray(response?.data) ? response.data : [];
  } catch (error) {
    console.error("Error fetching bikers:", error);
    bikers.value = [];
  } finally {
    isLoading.value = false;
  }
};

watch(
  companyId,
  async (id) => {
    if (id || user.value?.role === "admin") await fetchBikers(id || "");
  },
  { immediate: true },
);
</script>
