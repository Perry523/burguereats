<template>
  <div
    class="h-[calc(100vh-128px)] flex flex-col pt-0 md:pt-6 max-w-6xl mx-auto w-full px-2 sm:px-6 lg:px-8 overflow-auto"
  >
    <div
      class="flex flex-row items-center justify-between mt-2 mb-6 gap-2"
    >
      <div class="hidden lg:block">
        <h1 class="text-3xl font-bold text-gray-800">
          {{ isBikerRole ? "Meu Painel" : "Painel de Entregadores" }}
        </h1>
        <p class="text-sm text-gray-500 mt-1">
          {{
            isBikerRole
              ? "Acompanhe suas métricas"
              : "Acompanhe métricas, lucro e informações dos entregadores"
          }}
        </p>
      </div>

      <div class="flex items-center gap-2 flex-1 lg:flex-initial lg:ml-auto">
        <select
          v-if="!isBikerRole"
          v-model="selectedBiker"
          class="flex-1 lg:flex-initial rounded-lg border border-gray-300 bg-white p-2 text-xs sm:text-sm text-gray-700 shadow-sm focus:border-primary focus:ring-primary min-w-[120px] sm:min-w-[200px]"
          :disabled="isLoading"
        >
          <option value="all">Todos</option>
          <option v-for="biker in bikers" :key="biker.id" :value="biker.id">
            {{ biker.name }}
          </option>
        </select>

        <select
          v-model="selectedDate"
          class="flex-1 lg:flex-initial rounded-lg border border-gray-300 bg-white p-2 text-xs sm:text-sm text-gray-700 shadow-sm focus:border-primary focus:ring-primary min-w-[120px] sm:min-w-[180px]"
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
      </div>
    </div>

    <div v-if="isLoading" class="flex justify-center items-center py-20">
      <UIcon
        name="i-heroicons-arrow-path"
        class="w-10 h-10 animate-spin text-primary"
      />
    </div>

    <div v-else class="space-y-6">
      <!-- Biker Profile Info (if a specific biker is selected) -->
      <!-- <UCard
        v-if="selectedBikerData"
        class="bg-primary/5 border border-primary/20 shadow-sm mb-6"
      >
        <div class="flex flex-col sm:flex-row items-center gap-6">
          <div
            class="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xl font-bold shrink-0"
          >
            {{ selectedBikerData.name.charAt(0).toUpperCase() }}
          </div>
          <div
            class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full"
          >
            <div>
              <p
                class="text-xs text-gray-500 uppercase font-semibold tracking-wider"
              >
                Nome
              </p>
              <p class="font-medium text-gray-900">
                {{ selectedBikerData.name }}
              </p>
            </div>
            <div>
              <p
                class="text-xs text-gray-500 uppercase font-semibold tracking-wider"
              >
                Telefone
              </p>
              <p class="font-medium text-gray-900">
                {{ selectedBikerData.phone || "Não informado" }}
              </p>
            </div>
            <div>
              <p
                class="text-xs text-gray-500 uppercase font-semibold tracking-wider"
              >
                Email
              </p>
              <p class="font-medium text-gray-900">
                {{ selectedBikerData.email || "Não informado" }}
              </p>
            </div>
            <div>
              <p
                class="text-xs text-gray-500 uppercase font-semibold tracking-wider"
              >
                Status
              </p>
              <span
                :class="[
                  'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mt-1',
                  selectedBikerData.isActive
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800',
                ]"
              >
                {{ selectedBikerData.isActive ? "Ativo" : "Inativo" }}
              </span>
            </div>
          </div>
        </div>
      </UCard>

      <UCard v-else class="bg-gray-50 shadow-sm border border-gray-200 mb-6">
        <p class="text-gray-600 font-medium">
          Você está visualizando as estatísticas e os gastos de
          <strong class="text-gray-900">todos os entregadores</strong>.
          Selecione um entregador no filtro acima para ver suas informações
          específicas.
        </p>
      </UCard> -->

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Meus ganhos / Saldo total -->
        <UCard class="bg-white shadow-sm border border-gray-200">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-500 text-sm font-medium">Saldo Total (Bruto)</p>
              <div class="flex items-baseline gap-2 mt-1">
                <p class="text-3xl font-bold text-gray-900">
                  {{ stats.financial ? formatCurrency(stats.financial.wallet) : formatCurrency(0) }}
                </p>
              </div>
            </div>
            <div class="p-3 bg-gray-50 rounded-lg">
              <UIcon name="i-ph-bank-duotone" class="w-8 h-8 text-gray-400" />
            </div>
          </div>
        </UCard>

        <!-- Descontos pendentes -->
        <UCard class="bg-white shadow-sm border border-gray-200">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-500 text-sm font-medium">Descontos Pendentes</p>
              <div class="mt-1">
                <p class="text-3xl font-bold text-red-600">
                  {{ stats.financial ? formatCurrency(stats.financial.advances + stats.financial.totalFees) : formatCurrency(0) }}
                </p>
                <p class="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-wider" v-if="stats.financial">
                  {{ formatCurrency(stats.financial.advances) }} vales + {{ formatCurrency(stats.financial.totalFees) }} taxas
                </p>
              </div>
            </div>
            <div class="p-3 bg-red-50 rounded-lg">
              <UIcon name="i-ph-trend-down-duotone" class="w-8 h-8 text-red-400" />
            </div>
          </div>
        </UCard>

        <!-- Lucro Líquido -->
        <UCard class="bg-white shadow-sm border border-gray-200">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-500 text-sm font-medium">Líquido Disponível</p>
              <p class="text-3xl font-bold text-green-600 mt-1 shrink-0">
                {{ stats.financial ? formatCurrency(stats.financial.netPay) : formatCurrency(0) }}
              </p>
            </div>
            <div class="p-3 bg-green-50 rounded-lg shrink-0 ml-2">
              <UIcon name="i-ph-money-duotone" class="w-8 h-8 text-green-600" />
            </div>
          </div>
        </UCard>
      </div>

      <UCard class="bg-white shadow-sm border border-gray-200 mt-8">
        <h2 class="text-xl font-semibold text-gray-800 mb-4 px-1">
          Histórico de Entregas
        </h2>
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left text-gray-500">
            <thead
              class="text-xs text-gray-700 uppercase bg-gray-50 rounded-t-lg border-b"
            >
              <tr>
                <th scope="col" class="px-4 py-3">Data</th>
                <th scope="col" class="px-4 py-3">Cliente / Pedido</th>
                <th
                  scope="col"
                  class="px-4 py-3"
                  v-if="selectedBiker === 'all'"
                >
                  Entregador
                </th>
                <th scope="col" class="px-4 py-3">Valor do Pedido</th>
                <th scope="col" class="px-4 py-3">Taxa do Entregador</th>
                <th scope="col" class="px-4 py-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="delivery in stats.recentDeliveries"
                :key="delivery.id"
                class="border-b hover:bg-gray-50 transition-colors"
              >
                <td class="px-4 py-3 font-medium whitespace-nowrap">
                  {{ formatDate(delivery.created_at) }}
                </td>
                <td class="px-4 py-3">
                  <div class="font-medium text-gray-900">
                    {{ delivery.customer_name || "Cliente Oculto" }}
                  </div>
                  <div
                    class="text-xs text-gray-500 max-w-[150px] truncate"
                    :title="delivery.id"
                  >
                    #{{ delivery.id.split("-")[0] }}
                  </div>
                </td>
                <td class="px-4 py-3" v-if="selectedBiker === 'all'">
                  {{ delivery.Entregadores?.name || "Não atribuído" }}
                </td>
                <td class="px-4 py-3 font-semibold text-gray-700">
                  {{ formatCurrency(delivery.total) }}
                </td>
                <td class="px-4 py-3 font-semibold text-orange-600">
                  {{ formatCurrency(delivery.delivery_fee || 0) }}
                </td>
                <td class="px-4 py-3 text-right">
                  <span
                    :class="[
                      'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
                      statusStyles[delivery.status] ||
                        'bg-gray-100 text-gray-800',
                    ]"
                  >
                    {{ statusLabels[delivery.status] || delivery.status }}
                  </span>
                </td>
              </tr>
              <tr v-if="stats.recentDeliveries.length === 0">
                <td
                  :colspan="selectedBiker === 'all' ? 6 : 5"
                  class="px-4 py-12 text-center text-gray-500"
                >
                  <UIcon
                    name="i-heroicons-inbox"
                    class="w-12 h-12 mx-auto text-gray-300 mb-2"
                  />
                  Nenhuma entrega encontrada para este filtro.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </UCard>
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
const isBikerRole = ref(false);
const bikerProfileId = ref<string | null>(null);

const companyId = computed(() => {
  // If user is a biker, we might need to rely on the companyId from their profile
  // but auth.user.company.id should also be populated.
  return auth.user?.company?.id;
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
  financial: null as {
    wallet: number;
    advances: number;
    totalFees: number;
    netPay: number;
  } | null,
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
  const d = new Date(dateString);
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
};

const loadBikerProfile = async () => {
  try {
    const res = await $fetch<{
      success: boolean;
      data: {
        id: string;
        name: string;
        phone: string;
        email: string;
        isActive: boolean;
      };
    }>("/api/bikers/me");
    if (res.success && res.data) {
      isBikerRole.value = true;
      bikerProfileId.value = res.data.id;
      selectedBiker.value = res.data.id;
      // Pre-populate 'bikers' with just this user so the profile card works
      bikers.value = [res.data];
    }
  } catch (error) {
    // 401/403 expected if not a biker
    isBikerRole.value = false;
  }
};

const loadBikers = async () => {
  if (!companyId.value) return;
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
  if (!companyId.value && !isBikerRole.value) return;

  isLoading.value = true;
  try {
    // If the user is a biker, they MUST only query their own ID
    const effectiveBikerId = isBikerRole.value
      ? bikerProfileId.value
      : selectedBiker.value;

    let url = `/api/admin/biker-stats?companyId=${companyId.value || ""}`;
    if (effectiveBikerId && effectiveBikerId !== "all") {
      url += `&bikerId=${effectiveBikerId}`;
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

onMounted(async () => {
  if (!auth.user) {
    await auth.getCurrentUser();
  }

  // First determine if the user is a biker
  await loadBikerProfile();

  // If not a biker, load the full list of bikers for the admin dropdown
  if (!isBikerRole.value) {
    await loadBikers();
  }

  await fetchStats();
});
</script>
