<template>
  <div class="h-[calc(100vh-128px)] flex flex-col gap-4 pt-0 md:pt-6">
    <TableBase
      class="flex-1 min-h-0 bg-white rounded-lg pt-2 md:pt-5 pb-0 px-0 shadow-sm border border-gray-200"
      :loading="isLoading"
      :rows="payouts"
      :total-items="payouts.length"
      :columns="columns"
      v-model:page="page"
      v-model:per_page="itemsPerPage"
      hide-edit
      hide-delete
    >
      <template #filter>
        <div
          class="w-full px-3 sm:px-5 pb-1 md:pb-4 flex items-center justify-between gap-2"
        >
          <h1 class="text-xl font-bold text-gray-900 hidden lg:block mr-2">
            Histórico de Pagamentos
          </h1>

          <div class="flex items-center gap-2 flex-1 lg:flex-initial lg:ml-auto">
            <!-- Biker Filter (Admin only) -->
            <select
              v-if="isAdmin"
              v-model="selectedBiker"
              class="flex-1 lg:flex-initial rounded-lg border border-gray-300 bg-white p-2 text-xs sm:text-sm text-gray-700 shadow-sm focus:border-primary focus:ring-primary min-w-[120px] sm:min-w-[180px]"
              :disabled="isLoading"
            >
              <option value="all">Todos Entregadores</option>
              <option v-for="biker in bikers" :key="biker.id" :value="biker.id">
                {{ biker.name }}
              </option>
            </select>

            <!-- Date range filter -->
            <select
              v-model="selectedDate"
              class="flex-1 lg:flex-initial rounded-lg border border-gray-300 bg-white p-2 text-xs sm:text-sm text-gray-700 shadow-sm focus:border-primary focus:ring-primary min-w-[120px] sm:min-w-[160px]"
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
              @click="fetchPayouts"
              class="flex items-center justify-center p-2 text-gray-500 hover:text-primary transition-colors bg-white rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
              title="Atualizar"
            >
              <UIcon
                name="i-heroicons-arrow-path"
                :class="['h-4 w-4 sm:h-5 sm:w-5', isLoading ? 'animate-spin' : '']"
              />
            </button>
          </div>
        </div>
      </template>

      <!-- Date -->
      <template #date="{ row }">
        <span class="text-gray-900">{{ formatDateBR(row.created_at) }}</span>
      </template>

      <!-- Type (Tipo) -->
      <template #type="{ row }">
        <span
          class="inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-semibold shadow-sm"
          :class="
            row.type === 'advance'
              ? 'bg-orange-100 text-orange-700'
              : 'bg-blue-100 text-blue-700'
          "
        >
          {{ row.type === "advance" ? "Adiantamento" : "Liquidação" }}
        </span>
      </template>

      <!-- Entregador -->
      <template #biker_name="{ row }">
        <span class="font-medium text-gray-900">{{ row.biker_name }}</span>
      </template>

      <!-- Amount -->
      <template #amount_paid="{ row }">
        <span class="font-bold text-green-600"
          >+ {{ formatCurrency(row.amount_paid) }}</span
        >
      </template>

      <!-- Discounts Overview -->
      <template #discounts_total="{ row }">
        <div class="flex flex-col" v-if="row.type === 'settlement'">
          <span
            class="text-xs text-red-500 font-medium whitespace-nowrap"
            v-if="row.discounts > 0"
          >
            - {{ formatCurrency(row.discounts) }} (Vales)
          </span>
          <span
            class="text-xs text-red-500 font-medium whitespace-nowrap"
            v-if="row.delivery_fee_total > 0"
          >
            - {{ formatCurrency(row.delivery_fee_total) }} (Taxas)
          </span>
          <span
            class="text-xs text-gray-400"
            v-if="!row.discounts && !row.delivery_fee_total"
            >Sem descontos</span
          >
        </div>
        <span class="text-xs text-gray-400" v-else>-</span>
      </template>

      <!-- Ver mais action -->
      <template #additional-actions="{ item }">
        <li @click="viewDetails(item)">
          <a
            class="flex items-center gap-3 text-base py-2.5 px-4 font-medium text-primary hover:text-primary-focus hover:bg-primary/5 rounded-lg transition-colors duration-150 cursor-pointer"
          >
            <UIcon name="i-heroicons-eye" class="w-5 h-5 text-primary" />
            Ver mais
          </a>
        </li>
      </template>
    </TableBase>

    <!-- Details Modal -->
    <BaseDialog v-model="showDetailsModal" title="Detalhes do Pagamento">
      <div class="p-4 space-y-6" v-if="selectedPayout">
        <div
          class="flex items-center justify-between border-b border-gray-100 pb-4"
        >
          <div>
            <p class="text-xs text-gray-500 uppercase font-bold tracking-wider">
              Data e Hora
            </p>
            <p class="text-gray-900 font-medium">
              {{ formatDateBR(selectedPayout.created_at) }}
            </p>
          </div>
          <div class="text-right">
            <span
              class="inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-semibold shadow-sm"
              :class="
                selectedPayout.type === 'advance'
                  ? 'bg-orange-100 text-orange-700'
                  : 'bg-blue-100 text-blue-700'
              "
            >
              {{
                selectedPayout.type === "advance"
                  ? "Adiantamento"
                  : "Liquidação"
              }}
            </span>
          </div>
        </div>

        <div v-if="isAdmin" class="border-b border-gray-100 pb-4">
          <p class="text-xs text-gray-500 uppercase font-bold tracking-wider">
            Entregador
          </p>
          <p class="text-lg font-semibold text-gray-900">
            {{ selectedPayout.biker_name }}
          </p>
        </div>

        <div class="space-y-3 bg-gray-50 rounded-xl p-4 border border-gray-200">
          <div class="flex justify-between items-center">
            <span class="text-gray-600 font-medium">Valor Recebido:</span>
            <span class="text-lg font-bold text-green-600"
              >+ {{ formatCurrency(selectedPayout.amount_paid) }}</span
            >
          </div>

          <template v-if="selectedPayout.type === 'settlement'">
            <div
              v-if="selectedPayout.discounts > 0"
              class="flex justify-between items-center pt-2 border-t border-gray-200"
            >
              <span class="text-gray-500 text-sm"
                >Adiantamentos Descontados:</span
              >
              <span class="text-sm font-medium text-red-500"
                >- {{ formatCurrency(selectedPayout.discounts) }}</span
              >
            </div>
            <div
              v-if="selectedPayout.delivery_fee_total > 0"
              class="flex justify-between items-center pt-1"
            >
              <span class="text-gray-500 text-sm"
                >Taxas Retidas (R$ 1,00/entrega):</span
              >
              <span class="text-sm font-medium text-red-500"
                >- {{ formatCurrency(selectedPayout.delivery_fee_total) }}</span
              >
            </div>
          </template>
        </div>

        <div class="flex justify-end pt-2">
          <button
            @click="showDetailsModal = false"
            class="w-full sm:w-auto px-6 py-2.5 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary-focus transition-colors shadow-sm"
          >
            Fechar
          </button>
        </div>
      </div>
    </BaseDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import { useAuthStore } from "~/stores/auth";

definePageMeta({ layout: "admin" });

const auth = useAuthStore();
const isLoading = ref(false);
const payouts = ref<any[]>([]);
const bikers = ref<any[]>([]);
const page = ref(1);
const itemsPerPage = ref(10);

const selectedDate = ref("all");
const selectedBiker = ref("all");

const dateRangeOptions = [
  { label: "Todos os períodos", value: "all" },
  { label: "Hoje", value: "today" },
  { label: "Ontem", value: "yesterday" },
  { label: "Última semana", value: "last_week" },
  { label: "Último mês", value: "last_month" },
];

const showDetailsModal = ref(false);
const selectedPayout = ref<any>(null);

const isAdmin = computed(() => auth.user?.role === "admin");

const columns = computed(() => {
  const cols: any = [
    { key: "date", label: "Data", sm: true },
    { key: "type", label: "Tipo" },
  ];
  if (isAdmin.value) {
    cols.push({ key: "biker_name", label: "Entregador" });
  }
  cols.push({ key: "discounts_total", label: "Descontos Aplicados" });
  cols.push({ key: "amount_paid", label: "Valor", sm: true });
  return cols;
});

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(val || 0);
};

const formatDateBR = (dateStr: string) => {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const viewDetails = (payout: any) => {
  selectedPayout.value = payout;
  showDetailsModal.value = true;
};

const fetchBikers = async () => {
  if (!isAdmin.value || !auth.currentCompanyId) return;
  try {
    const res = await $fetch<{ success: boolean; data?: any[] }>(
      `/api/bikers?companyId=${auth.currentCompanyId}`,
    );
    bikers.value = res?.data || [];
  } catch (e) {
    console.error("Error fetching bikers:", e);
  }
};

const fetchPayouts = async () => {
  isLoading.value = true;
  try {
    let url = `/api/biker-payouts?dateRange=${selectedDate.value}`;
    if (isAdmin.value && selectedBiker.value !== "all") {
      url += `&bikerId=${selectedBiker.value}`;
    }
    const res = await $fetch<{ success: boolean; data?: any[] }>(url);
    payouts.value = res?.data || [];
  } catch (e) {
    console.error("Error fetching payouts:", e);
  } finally {
    isLoading.value = false;
  }
};

watch([selectedDate, selectedBiker], () => {
  fetchPayouts();
});

onMounted(async () => {
  if (!auth.user) await auth.getCurrentUser();
  if (isAdmin.value) fetchBikers();
  await fetchPayouts();
});
</script>
