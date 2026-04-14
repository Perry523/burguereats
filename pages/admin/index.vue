<template>
  <div class="h-[calc(100vh-128px)] flex flex-col pt-0 md:pt-6 overflow-auto">
    <!-- Stat Cards + Filters -->
    <div class="shrink-0 mb-5">
      <!-- Filter Row -->
      <div class="flex items-center gap-2 mb-4">
        <select
          v-model="selectedBiker"
          class="rounded-lg border border-gray-300 bg-white p-2 text-xs sm:text-sm text-gray-700 shadow-sm focus:border-primary focus:ring-primary min-w-[130px] sm:min-w-[170px]"
          :disabled="isLoading"
        >
          <option value="all">Todos Entregadores</option>
          <option v-for="biker in bikers" :key="biker.id" :value="biker.id">
            {{ biker.name }}
          </option>
        </select>
        <select
          v-model="selectedDate"
          class="rounded-lg border border-gray-300 bg-white p-2 text-xs sm:text-sm text-gray-700 shadow-sm focus:border-primary focus:ring-primary min-w-[120px] sm:min-w-[155px]"
          :disabled="isLoading"
        >
          <option
            v-for="opt in dateRangeOptions"
            :key="opt.value"
            :value="opt.value"
          >
            {{ opt.label }}
          </option>
        </select>
        <button
          @click="fetchStats"
          class="flex items-center justify-center p-2 text-gray-500 hover:text-primary transition-colors bg-white rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
          title="Atualizar"
        >
          <UIcon
            name="i-heroicons-arrow-path"
            :class="['h-4 w-4 sm:h-5 sm:w-5', isLoading ? 'animate-spin' : '']"
          />
        </button>
      </div>

      <!-- Biker Profile Card (when specific biker selected) -->
      <div
        v-if="selectedBikerData"
        class="rounded-xl border border-primary/20 bg-primary/5 p-4 mb-5"
      >
        <div class="flex items-center gap-4">
          <div
            class="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary text-lg font-bold shrink-0"
          >
            {{ selectedBikerData.name.charAt(0).toUpperCase() }}
          </div>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-2 flex-1">
            <div>
              <p class="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Nome</p>
              <p class="text-sm font-medium text-gray-900">{{ selectedBikerData.name }}</p>
            </div>
            <div>
              <p class="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Telefone</p>
              <p class="text-sm font-medium text-gray-900">{{ selectedBikerData.phone || "N/A" }}</p>
            </div>
            <div>
              <p class="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Email</p>
              <p class="text-sm font-medium text-gray-900 truncate">{{ selectedBikerData.email || "N/A" }}</p>
            </div>
            <div>
              <p class="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Status</p>
              <span
                :class="[
                  'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mt-0.5',
                  selectedBikerData.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800',
                ]"
              >
                {{ selectedBikerData.isActive ? "Ativo" : "Inativo" }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Admin 4 Metric Cards -->
      <div
        v-if="auth.user?.role === 'admin'"
        class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
      >
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-5 hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs sm:text-sm text-gray-500 font-medium">Qtd Entregas</p>
              <p class="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
                {{ stats.adminStats?.pendingDeliveriesCount || 0 }}
              </p>
            </div>
            <div class="h-11 w-11 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
              <UIcon name="i-ph-package-duotone" class="w-6 h-6 text-blue-500" />
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-5 hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs sm:text-sm text-gray-500 font-medium">Adiantado</p>
              <p class="text-2xl sm:text-3xl font-bold text-red-600 mt-1">
                {{ formatCurrency(stats.adminStats?.totalAdvances || 0) }}
              </p>
            </div>
            <div class="h-11 w-11 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
              <UIcon name="i-ph-arrow-circle-down-duotone" class="w-6 h-6 text-red-500" />
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-5 hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs sm:text-sm text-gray-500 font-medium">Total Bruto</p>
              <p class="text-2xl sm:text-3xl font-bold text-orange-600 mt-1">
                {{ formatCurrency(stats.adminStats?.totalGross || 0) }}
              </p>
            </div>
            <div class="h-11 w-11 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
              <UIcon name="i-ph-coins-duotone" class="w-6 h-6 text-orange-500" />
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-5 hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs sm:text-sm text-gray-500 font-medium">A Pagar</p>
              <p class="text-2xl sm:text-3xl font-bold text-green-600 mt-1">
                {{ formatCurrency(stats.adminStats?.totalNet || 0) }}
              </p>
            </div>
            <div class="h-11 w-11 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
              <UIcon name="i-ph-money-duotone" class="w-6 h-6 text-green-500" />
            </div>
          </div>
        </div>
      </div>

      <!-- Manager 3 Cards -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-5 hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs sm:text-sm text-gray-500 font-medium">Pedidos Entregues</p>
              <div class="flex items-baseline gap-2 mt-1">
                <p class="text-2xl sm:text-3xl font-bold text-gray-900">
                  {{ stats.completedDeliveries }}
                </p>
                <span class="text-sm text-gray-400">/ {{ stats.totalDeliveries }}</span>
              </div>
            </div>
            <div class="h-11 w-11 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
              <UIcon name="i-ph-package-duotone" class="w-6 h-6 text-blue-500" />
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-5 hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs sm:text-sm text-gray-500 font-medium">Valor Total</p>
              <p class="text-2xl sm:text-3xl font-bold text-green-600 mt-1">
                {{ formatCurrency(stats.totalEarned || 0) }}
              </p>
            </div>
            <div class="h-11 w-11 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
              <UIcon name="i-ph-coins-duotone" class="w-6 h-6 text-green-500" />
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-5 hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs sm:text-sm text-gray-500 font-medium">Pago a Entregadores</p>
              <p class="text-2xl sm:text-3xl font-bold text-orange-600 mt-1">
                {{ formatCurrency(stats.totalSpent || 0) }}
              </p>
            </div>
            <div class="h-11 w-11 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
              <UIcon name="i-ph-credit-card-duotone" class="w-6 h-6 text-orange-500" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Table Section -->
    <div
      class="flex-1 min-h-0 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col"
    >
      <!-- Table Header -->
      <div class="px-4 sm:px-6 pt-4 pb-3 border-b border-gray-200">
        <h2 class="text-base font-semibold text-gray-900">
          {{
            auth.user?.role === "admin"
              ? "Registros Pendentes"
              : "Histórico de Entregas"
          }}
        </h2>
      </div>

      <!-- Admin Table: Pending Registers -->
      <div v-if="auth.user?.role === 'admin'" class="overflow-auto flex-1">
        <table class="min-w-full divide-y divide-gray-200 relative">
          <thead class="bg-gray-50 sm:bg-gray-100 sticky top-0 z-10 shadow-sm">
            <tr>
              <th class="px-4 py-3 sm:px-6 sm:py-4 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-500 sm:text-gray-800 text-left">Data Ref.</th>
              <th class="px-4 py-3 sm:px-6 sm:py-4 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-500 sm:text-gray-800 text-left">Entregador</th>
              <th class="px-4 py-3 sm:px-6 sm:py-4 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-500 sm:text-gray-800 text-center">Entregas</th>
              <th class="px-4 py-3 sm:px-6 sm:py-4 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-500 sm:text-gray-800 text-left">Valor</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-white">
            <tr
              v-for="reg in stats.adminStats?.pendingRegisters"
              :key="reg.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <td class="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                {{ formatDate(reg.date) }}
              </td>
              <td class="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                {{ getBikerName(reg.biker_id) || "Entregador Oculto" }}
              </td>
              <td class="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm text-center">
                <span class="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-primary">
                  {{ reg.total_deliveries }}
                </span>
              </td>
              <td class="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                {{ formatCurrency(reg.amount) }}
              </td>
            </tr>
            <tr v-if="!stats.adminStats?.pendingRegisters?.length">
              <td colspan="4" class="px-6 py-12 text-center text-sm text-gray-500">
                <UIcon
                  name="i-heroicons-check-circle"
                  class="w-10 h-10 mx-auto text-green-400 mb-2"
                />
                Nenhum registro pendente de pagamento.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Manager Table: Recent Deliveries -->
      <div v-else class="overflow-auto flex-1">
        <table class="min-w-full divide-y divide-gray-200 relative">
          <thead class="bg-gray-50 sm:bg-gray-100 sticky top-0 z-10 shadow-sm">
            <tr>
              <th class="px-4 py-3 sm:px-6 sm:py-4 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-500 sm:text-gray-800 text-left">Data</th>
              <th class="px-4 py-3 sm:px-6 sm:py-4 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-500 sm:text-gray-800 text-left">Cliente / Pedido</th>
              <th v-if="selectedBiker === 'all'" class="px-4 py-3 sm:px-6 sm:py-4 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-500 sm:text-gray-800 text-left">Entregador</th>
              <th class="px-4 py-3 sm:px-6 sm:py-4 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-500 sm:text-gray-800 text-left">Valor</th>
              <th class="px-4 py-3 sm:px-6 sm:py-4 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-500 sm:text-gray-800 text-left">Taxa</th>
              <th class="px-4 py-3 sm:px-6 sm:py-4 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-500 sm:text-gray-800 text-right">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-white">
            <tr
              v-for="delivery in stats.recentDeliveries"
              :key="delivery.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <td class="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                {{ formatDate(delivery.created_at) }}
              </td>
              <td class="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm">
                <div class="font-medium text-gray-900">{{ delivery.customer_name || "Cliente" }}</div>
                <div class="text-xs text-gray-400">#{{ delivery.id.split("-")[0] }}</div>
              </td>
              <td v-if="selectedBiker === 'all'" class="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm text-gray-700">
                {{ delivery.Entregadores?.name || "N/A" }}
              </td>
              <td class="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm font-semibold text-gray-700">
                {{ formatCurrency(delivery.total) }}
              </td>
              <td class="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm font-semibold text-orange-600">
                {{ formatCurrency(delivery.delivery_fee || 0) }}
              </td>
              <td class="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm text-right">
                <span
                  :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    statusStyles[delivery.status] || 'bg-gray-100 text-gray-800',
                  ]"
                >
                  {{ statusLabels[delivery.status] || delivery.status }}
                </span>
              </td>
            </tr>
            <tr v-if="stats.recentDeliveries && stats.recentDeliveries.length === 0">
              <td
                :colspan="selectedBiker === 'all' ? 6 : 5"
                class="px-6 py-12 text-center text-sm text-gray-500"
              >
                <UIcon name="i-heroicons-inbox" class="w-10 h-10 mx-auto text-gray-300 mb-2" />
                Nenhuma entrega encontrada.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useAuthStore } from "~/stores/auth";

definePageMeta({
  layout: "admin",
});

const auth = useAuthStore();
const companyId = computed(() => {
  if (auth.user?.role === "admin") return "";
  return auth.currentCompanyId || "";
});

const isLoading = ref(true);
const selectedBiker = ref("all");
const selectedDate = ref("all");

const dateRangeOptions = [
  { label: "Todos os períodos", value: "all" },
  { label: "Hoje", value: "today" },
  { label: "Ontem", value: "yesterday" },
  { label: "Última semana", value: "last_week" },
  { label: "Último mês", value: "last_month" },
];

const bikers = ref<any[]>([]);
const stats = ref({
  totalDeliveries: 0,
  completedDeliveries: 0,
  totalEarned: 0,
  totalSpent: 0,
  recentDeliveries: [] as any[],
  adminStats: null as any,
});

const selectedBikerData = computed(() => {
  if (selectedBiker.value === "all") return null;
  return bikers.value.find((b) => b.id === selectedBiker.value) || null;
});

const statusLabels: Record<string, string> = {
  pending: "Pendente",
  preparing: "Preparando",
  delivering: "Em entrega",
  completed: "Concluído",
  cancelled: "Cancelado",
};

const statusStyles: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  preparing: "bg-blue-100 text-blue-800",
  delivering: "bg-purple-100 text-purple-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

const formatDate = (dateString: string) => {
  if (!dateString) return "-";
  if (dateString.length === 10) {
    const [y, m, d] = dateString.split("-");
    return `${d}/${m}/${y}`;
  }
  const d = new Date(dateString);
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
};

const getBikerName = (id: string) =>
  bikers.value.find((b) => b.id === id)?.name;

const loadBikers = async () => {
  if (!companyId.value && auth.user?.role !== "admin") return;
  try {
    const res = await $fetch<{ success: boolean; data: any[] }>(
      `/api/bikers?companyId=${companyId.value}`,
    );
    if (res.success) {
      bikers.value = res.data || [];
    }
  } catch (error) {
    console.error("Error loading bikers:", error);
  }
};

const fetchStats = async () => {
  if (!companyId.value && auth.user?.role !== "admin") return;

  isLoading.value = true;
  try {
    let url = `/api/admin/biker-stats?companyId=${companyId.value}`;
    if (selectedBiker.value && selectedBiker.value !== "all") {
      url += `&bikerId=${selectedBiker.value}`;
    }
    if (selectedDate.value && selectedDate.value !== "all") {
      url += `&dateRange=${selectedDate.value}`;
    }

    const res = await $fetch<{ success: boolean; data: any }>(url);
    if (res.success && res.data) {
      stats.value = res.data;
    }
  } catch (error) {
    console.error("Error fetching stats:", error);
  } finally {
    isLoading.value = false;
  }
};

watch([selectedBiker, selectedDate], () => {
  fetchStats();
});

watch(companyId, () => {
  if (companyId.value) {
    loadBikers();
    fetchStats();
  }
});

onMounted(async () => {
  if (!auth.user) {
    await auth.getCurrentUser();
  }
  await loadBikers();
  await fetchStats();
});
</script>
