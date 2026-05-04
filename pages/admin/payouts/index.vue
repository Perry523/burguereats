<template>
  <div class="h-full flex flex-col gap-4 pt-0 md:py-4">
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

          <div
            class="flex items-center gap-2 flex-1 lg:flex-initial lg:ml-auto"
          >
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

            <button
              @click="fetchPayouts"
              class="flex items-center justify-center p-2 text-gray-500 hover:text-primary transition-colors bg-white rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary shrink-0"
              title="Atualizar"
            >
              <UIcon
                name="i-heroicons-arrow-path"
                :class="[
                  'h-4 w-4 sm:h-5 sm:w-5',
                  isLoading ? 'animate-spin' : '',
                ]"
              />
            </button>
          </div>
        </div>

        <!-- Week picker row -->
        <div
          class="flex items-center gap-1 sm:gap-2 px-3 sm:px-5 pb-2 border-t border-gray-100 pt-2"
        >
          <!-- Prev week -->
          <button
            @click="shiftWeek(-1)"
            class="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors shrink-0"
            title="Semana anterior"
          >
            <UIcon name="i-heroicons-chevron-left" class="w-4 h-4" />
          </button>

          <!-- Month + Week selects -->
          <div
            class="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-xl px-2 py-1.5 flex-1 min-w-0"
          >
            <div class="flex-1 flex items-center justify-center gap-1 min-w-0">
              <span
                class="w-5 h-5 rounded-md bg-sky-50 flex items-center justify-center shrink-0 hidden sm:flex"
              >
                <UIcon
                  name="i-heroicons-calendar-days"
                  class="w-3.5 h-3.5 text-sky-500"
                />
              </span>
              <select
                v-model="pickerMonth"
                @change="onMonthChange"
                class="text-sm font-semibold text-gray-700 bg-transparent border-none focus:ring-0 cursor-pointer p-0"
              >
                <option v-for="(m, i) in months" :key="i" :value="i">
                  {{ m }}
                </option>
              </select>
              <span class="text-gray-300 text-xs">·</span>
              <select
                v-model="pickerWeek"
                @change="onWeekChange"
                class="text-xs text-gray-500 bg-transparent border-none focus:ring-0 cursor-pointer p-0 truncate"
              >
                <option
                  v-for="w in weeksInMonth"
                  :key="w.label"
                  :value="w.label"
                >
                  {{ w.label }}
                </option>
              </select>
            </div>
          </div>

          <!-- Next week -->
          <button
            @click="shiftWeek(1)"
            class="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors shrink-0"
            title="Próxima semana"
          >
            <UIcon name="i-heroicons-chevron-right" class="w-4 h-4" />
          </button>
        </div>
      </template>

      <!-- Date -->
      <template #date="{ row }">
        <div
          v-if="row.type === 'settlement' && row.week_from && row.week_to"
          class="flex flex-col"
        >
          <span class="text-xs font-semibold text-gray-900"
            >{{ formatShortDate(row.week_from) }} –
            {{ formatShortDate(row.week_to) }}</span
          >
          <span class="text-[10px] text-gray-500"
            >Pagou: {{ formatDateBR(row.created_at).split(" ")[0] }}</span
          >
        </div>
        <div v-else>
          <span class="text-xs font-semibold text-gray-900">{{
            formatDateBR(row.created_at).split(" ")[0]
          }}</span>
        </div>
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
        <div>
          <div class="font-medium text-gray-900">
            {{ row.biker_name }}
          </div>
        </div>
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
              Período Referência
            </p>
            <div
              v-if="
                selectedPayout.type === 'settlement' &&
                selectedPayout.week_from &&
                selectedPayout.week_to
              "
            >
              <p class="text-sm text-gray-900 font-medium">
                {{ formatFullDate(selectedPayout.week_from) }} até
                {{ formatFullDate(selectedPayout.week_to) }}
              </p>
              <p class="text-[11px] text-gray-500 mt-0.5">
                Liquidado em: {{ formatDateBR(selectedPayout.created_at) }}
              </p>
            </div>
            <div v-else>
              <p class="text-sm text-gray-900 font-medium">
                {{ formatDateBR(selectedPayout.created_at) }}
              </p>
            </div>
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

const selectedBiker = ref("all");

// ── Week Range Picker ──────────────────────────────────────────────
const months = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

function getMondayOf(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function toISODate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

const today = new Date();
const initMonday = getMondayOf(today);
const initSunday = new Date(initMonday);
initSunday.setDate(initSunday.getDate() + 6);

const weekRange = ref({
  from: toISODate(initMonday),
  to: toISODate(initSunday),
});
const pickerMonth = ref(initMonday.getMonth());
const initLabel = `${String(initMonday.getDate()).padStart(2, "0")}/${String(initMonday.getMonth() + 1).padStart(2, "0")} – ${String(initSunday.getDate()).padStart(2, "0")}/${String(initSunday.getMonth() + 1).padStart(2, "0")}`;
const pickerWeek = ref(initLabel);

const weeksInMonth = computed(() => {
  const year = new Date().getFullYear();
  const weeks: { label: string; from: Date; to: Date }[] = [];
  const cursor = new Date(year, pickerMonth.value, 1);
  let mon = getMondayOf(cursor);
  for (let i = 0; i < 6; i++) {
    const sun = new Date(mon);
    sun.setDate(sun.getDate() + 6);
    if (mon.getMonth() > pickerMonth.value && mon.getFullYear() >= year) break;
    if (sun.getMonth() < pickerMonth.value) {
      mon.setDate(mon.getDate() + 7);
      continue;
    }
    const label = `${String(mon.getDate()).padStart(2, "0")}/${String(mon.getMonth() + 1).padStart(2, "0")} – ${String(sun.getDate()).padStart(2, "0")}/${String(sun.getMonth() + 1).padStart(2, "0")}`;
    weeks.push({ label, from: new Date(mon), to: new Date(sun) });
    mon = new Date(mon);
    mon.setDate(mon.getDate() + 7);
  }
  return weeks;
});

function onMonthChange() {
  if (weeksInMonth.value.length) {
    const w = weeksInMonth.value[0];
    pickerWeek.value = w.label;
    weekRange.value = { from: toISODate(w.from), to: toISODate(w.to) };
    fetchPayouts();
  }
}

function onWeekChange() {
  const found = weeksInMonth.value.find((w) => w.label === pickerWeek.value);
  if (found) {
    weekRange.value = { from: toISODate(found.from), to: toISODate(found.to) };
    fetchPayouts();
  }
}

function shiftWeek(offset: number) {
  const mon = new Date(weekRange.value.from + "T00:00:00");
  mon.setDate(mon.getDate() + offset * 7);
  pickerMonth.value = mon.getMonth();
  const sun = new Date(mon);
  sun.setDate(sun.getDate() + 6);
  weekRange.value = { from: toISODate(mon), to: toISODate(sun) };

  const label = `${String(mon.getDate()).padStart(2, "0")}/${String(mon.getMonth() + 1).padStart(2, "0")} – ${String(sun.getDate()).padStart(2, "0")}/${String(sun.getMonth() + 1).padStart(2, "0")}`;
  pickerWeek.value = label;

  fetchPayouts();
}

watch(
  weeksInMonth,
  (newVal) => {
    if (
      !newVal.find((w) => w.label === pickerWeek.value) &&
      newVal.length > 0
    ) {
      pickerWeek.value = newVal[0].label;
      weekRange.value = {
        from: toISODate(newVal[0].from),
        to: toISODate(newVal[0].to),
      };
    }
  },
  { immediate: true },
);
// ───────────────────────────────────────────────────────────────────

const showDetailsModal = ref(false);
const selectedPayout = ref<any>(null);

const isAdmin = computed(() => auth.user?.role === "admin");

const columns = computed(() => {
  const cols: any = [{ key: "date", label: "Data", sm: true }];
  if (isAdmin.value) {
    cols.push({ key: "biker_name", label: "Entregador", sm: true });
  }
  cols.push(
    { key: "type", label: "Tipo" },
    { key: "discounts_total", label: "Descontos Aplicados" },
    { key: "amount_paid", label: "Valor", sm: true },
  );
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

const formatShortDate = (dateStr: string) => {
  if (!dateStr) return "-";
  const [y, m, d] = dateStr.split("-");
  return `${d}/${m}`;
};

const formatFullDate = (dateStr: string) => {
  if (!dateStr) return "-";
  const [y, m, d] = dateStr.split("-");
  return `${d}/${m}/${y}`;
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
    let url = `/api/biker-payouts?dateFrom=${weekRange.value.from}&dateTo=${weekRange.value.to}`;
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

watch([selectedBiker], () => {
  fetchPayouts();
});

onMounted(async () => {
  if (!auth.user) await auth.getCurrentUser();
  if (isAdmin.value) fetchBikers();
  await fetchPayouts();
});
</script>
