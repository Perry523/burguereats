<template>
  <div class="h-[calc(100vh-64px)] h-full flex flex-col gap-4 pt-0 md:py-4">
    <TableBase
      class="flex-1 min-h-0 bg-white rounded-lg pt-2 md:pt-5 pb-0 px-0 shadow-sm border border-gray-200"
      :loading="isLoading"
      :rows="pagedBikers"
      :total-items="sortedBikers.length"
      :columns="columns"
      v-model:page="page"
      v-model:per_page="itemsPerPage"
      hide-edit
      hide-delete
      hide-actions
    >
      <template #filter>
        <div
          class="w-full px-3 sm:px-5 pb-1 md:pb-4 flex flex-wrap sm:flex-nowrap items-center gap-2 overflow-hidden shrink-0"
        >
          <!-- <h1
            class="text-xl font-bold text-gray-900 hidden lg:block mr-2 shrink-0"
          >
            Financeiro Entregadores
          </h1> -->

          <!-- Search -->
          <div class="flex items-center w-full shrink-0 sm:shrink">
            <div class="relative w-full mr-3">
              <div
                class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2"
              >
                <UIcon
                  name="i-heroicons-magnifying-glass"
                  class="h-4 w-4 text-gray-400"
                />
              </div>
              <input
                v-model="search"
                type="text"
                class="block w-full rounded-lg border border-gray-300 bg-white py-1.5 pl-8 pr-2 text-xs sm:text-sm focus:border-primary focus:ring-primary shadow-sm"
                placeholder="Buscar entregador..."
              />
            </div>
            <button
              @click="loadData"
              class="items-center sm:hidden flex lg:mr-4 justify-center p-2 text-gray-500 hover:text-primary transition-colors bg-white rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary shrink-0"
              title="Atualizar"
            >
              <UIcon
                name="i-heroicons-arrow-path"
                :class="[
                  'h-3 w-3 sm:h-5 sm:w-5',
                  isLoading ? 'animate-spin' : '',
                ]"
              />
            </button>
          </div>
          <!-- Pagination and Week Controls wrapper for mobile -->
          <div class="flex items-center gap-1 sm:gap-2 w-full sm:w-auto flex-1">
            <!-- Prev arrow -->
            <button
              @click="shiftWeek(-1)"
              class="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors shrink-0"
              title="Semana anterior"
            >
              <UIcon name="i-heroicons-chevron-left" class="w-4 h-4" />
            </button>

            <!-- Week selects -->
            <div
              class="flex items-center md:min-w-96 gap-1 bg-gray-50 border border-gray-200 rounded-xl px-2 py-1.5 flex-1"
            >
              <div
                class="flex-1 flex items-center justify-center gap-1 min-w-0"
              >
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

            <!-- Next arrow -->
            <button
              @click="shiftWeek(1)"
              class="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors shrink-0"
              title="Próxima semana"
            >
              <UIcon name="i-heroicons-chevron-right" class="w-4 h-4" />
            </button>
          </div>
          <button
            @click="loadData"
            class="items-center hidden sm:flex lg:mr-4 justify-center p-2 text-gray-500 hover:text-primary transition-colors bg-white rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary shrink-0"
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
      </template>

      <!-- Custom Column Slots -->
      <template #biker="{ row }">
        <div>
          <p class="font-medium text-gray-900">{{ row.name }}</p>
          <p class="text-xs text-gray-500">{{ row.phone || row.email }}</p>
        </div>
      </template>

      <template #wallet="{ row }">
        <span class="font-medium text-gray-900">{{
          formatCurrency(row.wallet)
        }}</span>
      </template>

      <template #deliveries="{ row }">
        <div>
          <p class="text-gray-900">{{ row.total_deliveries }} entregas</p>
          <p class="text-xs text-red-500 font-medium">
            - {{ formatCurrency(row.delivery_fee) }}
          </p>
        </div>
      </template>

      <template #advances="{ row }">
        <span class="text-red-500 font-medium whitespace-nowrap"
          >- {{ formatCurrency(row.advance_money) }}</span
        >
      </template>

      <template #net_to_pay="{ row }">
        <span
          class="inline-flex items-center rounded-lg px-2.5 py-1 text-sm font-bold shadow-sm"
          :class="
            row.net_to_pay >= 0
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          "
        >
          {{ formatCurrency(row.net_to_pay) }}
        </span>
      </template>

      <template #custom_actions="{ row }">
        <div class="flex items-center gap-2">
          <button
            @click="openAdvanceModal(row)"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors"
          >
            <UIcon name="i-ph-money" class="w-4 h-4" />
            Adiantar
          </button>
          <button
            @click="openPagarModal(row)"
            :disabled="isLiquidating"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors disabled:opacity-50"
            title="Registrar pagamento da semana"
          >
            <UIcon name="i-ph-check-circle-duotone" class="w-4 h-4" />
            Pagar
          </button>
        </div>
      </template>
    </TableBase>
    <!-- Advance Money Modal -->
    <BaseDialog
      v-model="showAdvanceModal"
      :title="'Adiantamento - ' + (selectedBiker?.name || '')"
    >
      <div class="p-4 space-y-4">
        <p class="text-sm text-gray-600">
          Lance o valor do adiantamento concedido ao entregador hoje. Este valor
          será somado ao total adiantado e diminuirá do montante final a pagar
          na liquidação.
        </p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Valor do Novo Adiantamento</label
            >
            <Currency
              v-model="advanceForm.amount"
              class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              placeholder="R$ 0,00"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Data</label
            >
            <input
              type="date"
              v-model="advanceForm.date"
              class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm bg-white"
            />
          </div>
        </div>

        <div
          v-if="advanceError"
          class="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700"
        >
          {{ advanceError }}
        </div>

        <div class="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <button
            @click="showAdvanceModal = false"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            @click="saveAdvance"
            :disabled="isSubmitting || advanceForm.amount <= 0"
            class="px-4 py-2 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary-focus disabled:opacity-50 transition-colors"
          >
            {{ isSubmitting ? "Lançando..." : "Lançar Adiantamento" }}
          </button>
        </div>
      </div>
    </BaseDialog>

    <!-- Pagar (Liquidação) Confirmation Modal -->
    <BaseDialog
      v-model="showPagarModal"
      :title="'Pagar - ' + (selectedBiker?.name || '')"
    >
      <div class="p-4 space-y-4">
        <!-- Week scope indicator -->
        <div
          class="bg-sky-50 border border-sky-200 rounded-xl p-3 flex items-center gap-3"
        >
          <div
            class="w-9 h-9 rounded-lg bg-sky-100 flex items-center justify-center shrink-0"
          >
            <UIcon
              name="i-heroicons-calendar-days"
              class="w-5 h-5 text-sky-600"
            />
          </div>
          <div>
            <p class="text-xs text-sky-600 font-bold uppercase tracking-wider">
              Período a ser pago
            </p>
            <p class="text-sm font-semibold text-sky-900">
              {{ formatDateBR(weekRange.from) }} –
              {{ formatDateBR(weekRange.to) }}
            </p>
          </div>
        </div>

        <!-- PIX Key -->
        <div
          class="bg-indigo-50 border border-indigo-200 rounded-xl p-3 flex items-center gap-3"
        >
          <div
            class="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0"
          >
            <UIcon name="i-ph-bank" class="w-5 h-5 text-indigo-600" />
          </div>
          <div class="flex-1 overflow-hidden">
            <p
              class="text-xs text-indigo-600 font-bold uppercase tracking-wider"
            >
              Chave PIX do Entregador
            </p>
            <p class="text-sm font-semibold text-indigo-900 truncate">
              {{ selectedBiker?.pix_key || "Não informada" }}
            </p>
          </div>
        </div>

        <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p class="text-sm text-blue-800 font-medium mb-2">
            Resumo da Liquidação (somente esta semana):
          </p>
          <div class="space-y-1 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-600">Bruto da Semana:</span>
              <span class="font-bold text-gray-900">{{
                formatCurrency(selectedBiker?.wallet)
              }}</span>
            </div>
            <div class="flex justify-between text-red-600">
              <span>Adiantamentos (Desconto):</span>
              <span>- {{ formatCurrency(selectedBiker?.advance_money) }}</span>
            </div>
            <div class="flex justify-between text-red-600">
              <span>Taxas de Entrega (R$ 1,00/cada):</span>
              <span>- {{ formatCurrency(selectedBiker?.delivery_fee) }}</span>
            </div>
            <div
              class="border-t border-blue-200 mt-2 pt-2 flex justify-between text-base font-bold text-green-700"
            >
              <span>Líquido a Pagar:</span>
              <span>{{ formatCurrency(selectedBiker?.net_to_pay) }}</span>
            </div>
          </div>
        </div>

        <p class="text-xs text-gray-500 italic">
          Ao confirmar, o sistema registrará um recibo de pagamento, marcará
          <strong>somente os registros desta semana</strong> como pagos e
          descontará o valor da carteira global. Esta ação não pode ser
          desfeita.
        </p>

        <div class="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <button
            @click="showPagarModal = false"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            @click="confirmPayment"
            :disabled="isLiquidating"
            class="px-4 py-2 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center gap-2"
          >
            <UIcon
              v-if="isLiquidating"
              name="i-heroicons-arrow-path"
              class="w-4 h-4 animate-spin"
            />
            {{ isLiquidating ? "Processando..." : "Confirmar e Pagar" }}
          </button>
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

const auth = useAuthStore();
const toast = useToast();

const isLoading = ref(false);
const isLiquidating = ref(false);
const bikers = ref<any[]>([]);
const search = ref("");

const showAdvanceModal = ref(false);
const showPagarModal = ref(false);
const selectedBiker = ref<any>(null);
const advanceForm = ref({ amount: 0, date: toISODate(new Date()) });
const isSubmitting = ref(false);
const advanceError = ref("");

const page = ref(1);
const itemsPerPage = ref(10);

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
    loadData();
  }
}

function onWeekChange() {
  const w = weeksInMonth.value.find((x) => x.label === pickerWeek.value);
  if (w) {
    weekRange.value = { from: toISODate(w.from), to: toISODate(w.to) };
    loadData();
  }
}

function shiftWeek(dir: 1 | -1) {
  const [fy, fm, fd] = weekRange.value.from.split("-").map(Number);
  const from = new Date(fy, fm - 1, fd);
  from.setDate(from.getDate() + dir * 7);
  const to = new Date(from.getFullYear(), from.getMonth(), from.getDate() + 6);
  weekRange.value = { from: toISODate(from), to: toISODate(to) };
  pickerMonth.value = from.getMonth();
  const match = weeksInMonth.value.find(
    (w) => toISODate(w.from) === weekRange.value.from,
  );
  if (match) pickerWeek.value = match.label;
  else pickerWeek.value = "";
  loadData();
}

const initWeekLabel =
  weeksInMonth.value.find((w) => toISODate(w.from) === weekRange.value.from)
    ?.label ??
  weeksInMonth.value[0]?.label ??
  "";
pickerWeek.value = initWeekLabel;
if (!initWeekLabel && weeksInMonth.value.length) {
  const w = weeksInMonth.value[0];
  weekRange.value = { from: toISODate(w.from), to: toISODate(w.to) };
  pickerWeek.value = w.label;
}
// ──────────────────────────────────────────────────────────────────

const columns = [
  { key: "biker", label: "Entregador", sm: true },
  { key: "wallet", label: "Bruto (Semana)" },
  { key: "deliveries", label: "Entregas (Tx R$ 1,00)" },
  { key: "advances", label: "Adiantamentos" },
  { key: "net_to_pay", label: "Valor a Pagar", sm: true },
  { key: "custom_actions", label: "Ações", sm: true },
];

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(val || 0);
};

const formatDateBR = (dateStr: string) => {
  if (!dateStr) return "-";
  const [y, m, d] = dateStr.split("-");
  return `${d}/${m}/${y}`;
};

const sortedBikers = computed(() => {
  let list = bikers.value;
  if (search.value) {
    const term = search.value.toLowerCase();
    list = list.filter(
      (b) =>
        b.name.toLowerCase().includes(term) ||
        (b.email && b.email.toLowerCase().includes(term)),
    );
  }
  return [...list].sort((a, b) => (b.net_to_pay ?? 0) - (a.net_to_pay ?? 0));
});

// Client-side pagination slice
const pagedBikers = computed(() => {
  const start = (page.value - 1) * itemsPerPage.value;
  return sortedBikers.value.slice(start, start + itemsPerPage.value);
});

// Reset to page 1 whenever search changes
watch(search, () => {
  page.value = 1;
});

const loadData = async () => {
  isLoading.value = true;
  try {
    const res = await $fetch<{ success: boolean; data?: any[] }>(
      `/api/biker-payments/financials?dateFrom=${weekRange.value.from}&dateTo=${weekRange.value.to}`,
    );
    bikers.value = res?.data || [];
  } catch (error) {
    console.error("Error fetching financials:", error);
    toast.add({ color: "error", title: "Erro ao carregar dados" });
  } finally {
    isLoading.value = false;
  }
};

const openAdvanceModal = (biker: any) => {
  selectedBiker.value = biker;
  advanceForm.value.amount = 0; // Starts from 0 because we only input the new advance now
  advanceForm.value.date = toISODate(new Date());
  advanceError.value = "";
  showAdvanceModal.value = true;
};

const saveAdvance = async () => {
  if (!selectedBiker.value) return;

  isSubmitting.value = true;
  advanceError.value = "";

  try {
    const res = await $fetch<{ success: boolean }>(
      `/api/biker-payments/advance`,
      {
        method: "POST",
        body: {
          biker_id: selectedBiker.value.id,
          amount: Number(advanceForm.value.amount),
          date: advanceForm.value.date,
        },
      },
    );

    if (res.success) {
      toast.add({
        color: "success",
        title: "Adiantamento lançado como registro da semana!",
      });
      showAdvanceModal.value = false;
      await loadData(); // Refresh the list
    }
  } catch (error: any) {
    advanceError.value =
      error?.data?.statusMessage || "Erro ao lançar adiantamento";
  } finally {
    isSubmitting.value = false;
  }
};

const openPagarModal = (biker: any) => {
  if (biker.wallet <= 0) {
    toast.add({
      color: "error",
      title: "Nenhum registro pendente nesta semana.",
    });
    return;
  }
  selectedBiker.value = biker;
  showPagarModal.value = true;
};

const confirmPayment = async () => {
  if (!selectedBiker.value) return;

  isLiquidating.value = true;
  try {
    const res = await $fetch<{ success: boolean }>("/api/biker-payouts", {
      method: "POST",
      body: {
        biker_id: selectedBiker.value.id,
        dateFrom: weekRange.value.from,
        dateTo: weekRange.value.to,
      },
    });

    if (res.success) {
      toast.add({
        color: "success",
        title: "Pagamento da semana registrado com sucesso!",
      });
      showPagarModal.value = false;
      await loadData();
    } else {
      throw new Error("Falha ao processar pagamento");
    }
  } catch (error: any) {
    console.error("Liquidate error:", error);
    const msg =
      error?.data?.statusMessage || error?.message || "Erro ao liquidar saldo";
    toast.add({ color: "error", title: msg });
  } finally {
    isLiquidating.value = false;
  }
};

onMounted(async () => {
  if (!auth.user) await auth.getCurrentUser();
  await loadData();
});
</script>
