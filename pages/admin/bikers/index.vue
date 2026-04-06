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

          <div class="flex gap-2">
            <NuxtLink to="/admin/bikers/map">
              <button
                class="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 shadow-sm whitespace-nowrap"
              >
                <UIcon name="i-ph-map-pin-line-duotone" class="h-5 w-5" />
                Mapa ao Vivo
              </button>
            </NuxtLink>
            <NuxtLink to="/admin/bikers/create">
              <button
                class="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 shadow-sm whitespace-nowrap"
              >
                <UIcon name="i-heroicons-plus" class="h-5 w-5" />
                Adicionar
              </button>
            </NuxtLink>
          </div>
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

    <!-- Vincular Empresas Modal -->
    <BaseDialog
      v-model="showVinculateModal"
      :title="'Vincular Empresas - ' + selectedBiker?.name"
      large
    >
      <div class="p-4 sm:p-6 space-y-4">
        <div class="relative">
          <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <UIcon name="i-heroicons-magnifying-glass" class="h-5 w-5 text-gray-400" />
          </div>
          <input
            v-model="companySearch"
            type="text"
            class="block w-full rounded-lg border border-gray-300 bg-white p-2.5 pl-10 text-sm focus:border-primary focus:ring-primary shadow-sm"
            placeholder="Buscar empresa..."
          />
        </div>

        <div class="max-h-96 overflow-y-auto space-y-2 border border-gray-100 rounded-xl p-3 bg-gray-50/50">
          <div v-if="filteredCompanies.length === 0" class="text-center py-8 text-sm text-gray-500">
            <UIcon name="i-heroicons-building-office" class="w-12 h-12 mx-auto mb-2 opacity-20" />
            <p>Nenhuma empresa encontrada.</p>
          </div>
          
          <div
            v-for="company in filteredCompanies"
            :key="company.id"
            class="flex items-center justify-between p-3 rounded-lg bg-white border border-gray-100 shadow-sm hover:border-primary/30 transition-all cursor-pointer group"
            @click="toggleCompanySelection(company.id)"
          >
            <div class="flex items-center gap-3">
              <input
                type="checkbox"
                :id="'company-' + company.id"
                :value="company.id"
                v-model="selectedCompanyIds"
                class="rounded border-gray-300 text-primary focus:ring-primary h-5 w-5 cursor-pointer"
                @click.stop
              />
              <label :for="'company-' + company.id" class="text-sm font-semibold text-gray-700 cursor-pointer group-hover:text-primary transition-colors">
                {{ company.name }}
              </label>
            </div>
            <UIcon 
              v-if="selectedCompanyIds.includes(company.id)" 
              name="i-heroicons-check-badge" 
              class="w-5 h-5 text-primary" 
            />
          </div>
        </div>
        
        <div class="flex flex-col gap-4 pt-4 border-t border-gray-100 mt-2">
          <p class="text-xs text-gray-500 text-center italic">
            Este entregador poderá realizar registros para todas as empresas selecionadas acima.
          </p>
          
          <div class="flex gap-3 mt-2">
            <button
              @click="showVinculateModal = false"
              class="flex-1 px-4 py-3 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              @click="saveVinculations"
              :disabled="isSavingVinculations"
              class="flex-[2] px-4 py-3 text-sm font-semibold text-white bg-primary hover:bg-primary-focus rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <UIcon v-if="isSavingVinculations" name="i-heroicons-arrow-path" class="w-5 h-5 animate-spin" />
              {{ isSavingVinculations ? 'Salvando...' : 'Salvar Vínculos' }}
            </button>
          </div>
        </div>
      </div>
    </BaseDialog>
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

// Vinculation State
const showVinculateModal = ref(false);
const isSavingVinculations = ref(false);
const selectedBiker = ref<Biker | null>(null);
const selectedCompanyIds = ref<string[]>([]);
const allCompanies = ref<{ id: string; name: string }[]>([]);
const companySearch = ref("");

const toast = useToast();

const filteredCompanies = computed(() => {
  if (!companySearch.value) return allCompanies.value;
  const term = companySearch.value.toLowerCase();
  return allCompanies.value.filter(c => c.name.toLowerCase().includes(term));
});

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
  {
    name: "Vincular Empresas",
    icon: "i-heroicons-link",
    action: (row: any) => openVinculateModal(row),
    show: () => user.value?.role === 'admin'
  }
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

const fetchAllCompanies = async () => {
  try {
    const response = await $fetch<{ success: boolean; data: any[] }>("/api/companies");
    if (response?.success) {
      allCompanies.value = response.data.map(c => ({ id: c.id, name: c.name }));
    }
  } catch (error) {
    console.error("Error fetching companies:", error);
  }
};

const openVinculateModal = async (biker: Biker) => {
  selectedBiker.value = biker;
  selectedCompanyIds.value = [];
  companySearch.value = "";
  showVinculateModal.value = true;
  
  if (allCompanies.value.length === 0) {
    await fetchAllCompanies();
  }
  
  try {
    const response = await $fetch<{ success: boolean; data: string[] }>(`/api/bikers/${biker.id}/companies`);
    if (response?.success) {
      selectedCompanyIds.value = response.data;
    }
  } catch (error) {
    console.error("Error fetching vinculations:", error);
  }
};

const toggleCompanySelection = (companyId: string) => {
  const index = selectedCompanyIds.value.indexOf(companyId);
  if (index === -1) {
    selectedCompanyIds.value.push(companyId);
  } else {
    selectedCompanyIds.value.splice(index, 1);
  }
};

const saveVinculations = async () => {
  if (!selectedBiker.value) return;
  
  isSavingVinculations.value = true;
  try {
    const response = await $fetch(`/api/bikers/${selectedBiker.value.id}/companies`, {
      method: 'post',
      body: { companyIds: selectedCompanyIds.value }
    });
    
    if (response) {
      toast.add({ color: 'primary', title: 'Vínculos atualizados com sucesso' });
      showVinculateModal.value = false;
    }
  } catch (error) {
    console.error("Error saving vinculations:", error);
    toast.add({ color: 'error', title: 'Erro ao salvar vínculos' });
  } finally {
    isSavingVinculations.value = false;
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
