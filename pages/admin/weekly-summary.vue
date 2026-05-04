<template>
  <div
    class="h-full flex flex-col pt-0 md:py-4 max-w-6xl mx-auto w-full px-2 sm:px-6 lg:px-8 overflow-auto"
  >
    <!-- Filters -->
    <div class="flex flex-col gap-3 mb-4">
      <!-- Filters row -->
      <div
        class="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden"
      >
        <!-- Company filter -->
        <div
          class="flex items-stretch divide-x divide-gray-100 border-b border-gray-100"
        >
          <label
            class="flex items-center gap-2 px-3 py-2.5 flex-1 min-w-0 hover:bg-gray-50/70 transition-colors cursor-pointer group"
          >
            <span
              class="shrink-0 w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center"
            >
              <UIcon
                name="i-ph-storefront-duotone"
                class="w-4 h-4 text-emerald-500"
              />
            </span>
            <div class="flex-1 min-w-0">
              <p
                class="text-[10px] font-bold uppercase tracking-wider text-gray-400 leading-none mb-0.5"
              >
                Empresa
              </p>
              <select
                v-model="selectedCompany"
                :disabled="isLoading"
                class="w-full text-sm font-semibold text-gray-800 bg-transparent border-none p-0 focus:ring-0 cursor-pointer truncate appearance-none"
              >
                <option value="">Todas</option>
                <option
                  v-for="company in companies"
                  :key="company.id"
                  :value="company.id"
                >
                  {{ company.name }}
                </option>
              </select>
            </div>
            <UIcon
              name="i-heroicons-chevron-up-down"
              class="w-4 h-4 text-gray-300 group-hover:text-gray-400 shrink-0"
            />
          </label>
        </div>

        <!-- Week picker -->
        <div class="flex items-center gap-1 px-3 py-2">
          <button
            @click="shiftWeek(-1)"
            class="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
            title="Semana anterior"
          >
            <UIcon name="i-heroicons-chevron-left" class="w-4 h-4" />
          </button>

          <div class="flex-1 flex items-center justify-center gap-1">
            <span
              class="w-5 h-5 rounded-md bg-sky-50 flex items-center justify-center shrink-0"
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
              class="text-xs text-gray-500 bg-transparent border-none focus:ring-0 cursor-pointer p-0 max-w-[180px] truncate"
            >
              <option v-for="w in weeksInMonth" :key="w.label" :value="w.label">
                {{ w.label }}
              </option>
            </select>
          </div>

          <button
            @click="shiftWeek(1)"
            class="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
            title="Próxima semana"
          >
            <UIcon name="i-heroicons-chevron-right" class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
      <UCard class="bg-white shadow-sm border border-gray-200 col-span-2">
        <div class="flex items-center justify-between">
          <div>
            <p
              class="text-gray-500 text-xs font-medium uppercase tracking-wider"
            >
              Faturamento Bruto
            </p>
            <p class="text-2xl md:text-3xl font-bold text-gray-900 mt-1">
              {{ formatCurrency(summary.grossTotal) }}
            </p>
          </div>
          <div class="p-3 bg-emerald-50 rounded-lg shrink-0">
            <UIcon name="i-ph-money-duotone" class="w-7 h-7 text-emerald-500" />
          </div>
        </div>
      </UCard>

      <UCard class="bg-white shadow-sm border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p
              class="text-gray-500 text-xs font-medium uppercase tracking-wider"
            >
              Total Registros
            </p>
            <p class="text-2xl md:text-3xl font-bold text-gray-900 mt-1">
              {{ summary.totalRecords }}
            </p>
          </div>
          <div class="p-3 bg-blue-50 rounded-lg shrink-0">
            <UIcon
              name="i-ph-file-text-duotone"
              class="w-7 h-7 text-blue-500"
            />
          </div>
        </div>
      </UCard>

      <UCard class="bg-white shadow-sm border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p
              class="text-gray-500 text-xs font-medium uppercase tracking-wider"
            >
              Entregadores Ativos
            </p>
            <p class="text-2xl md:text-3xl font-bold text-gray-900 mt-1">
              {{ summary.bikers.length }}
            </p>
          </div>
          <div class="p-3 bg-violet-50 rounded-lg shrink-0">
            <UIcon
              name="i-ph-users-four-duotone"
              class="w-7 h-7 text-violet-500"
            />
          </div>
        </div>
      </UCard>
    </div>

    <!-- Bikers Table -->
    <UCard
      class="bg-white shadow-sm border border-gray-200 flex-1 min-h-[400px] overflow-auto mb-4"
    >
      <h2 class="text-lg font-semibold text-gray-800 mb-4 px-1">
        Entregadores na Semana
      </h2>
      <div class="overflow-x-auto">
        <table
          class="w-full text-sm text-left text-gray-500"
          v-if="summary.bikers.length > 0"
        >
          <thead
            class="text-xs text-gray-700 uppercase bg-gray-50 rounded-t-lg border-b"
          >
            <tr>
              <th scope="col" class="px-4 py-3">Entregador</th>
              <th scope="col" class="px-4 py-3">Dias</th>
              <th scope="col" class="px-4 py-3 text-center">Registros</th>
              <th scope="col" class="px-4 py-3 text-right">Bruto</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(biker, idx) in summary.bikers"
              :key="biker.bikerId"
              class="border-b hover:bg-gray-50 transition-colors"
            >
              <td class="px-4 py-3">
                <div class="flex items-center gap-3">
                  <div
                    class="h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                    :class="
                      idx === 0
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-gray-100 text-gray-600'
                    "
                  >
                    {{ getInitials(biker.bikerName) }}
                  </div>
                  <div>
                    <p class="font-medium text-gray-900">
                      {{ biker.bikerName }}
                    </p>
                    <p class="text-[11px] text-gray-400">
                      {{ biker.totalDeliveries }} entrega{{
                        biker.totalDeliveries !== 1 ? "s" : ""
                      }}
                    </p>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3">
                <div class="flex flex-wrap gap-1">
                  <span
                    v-for="day in orderedDays(biker.days)"
                    :key="day"
                    class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase"
                    :class="getDayStyle(day)"
                  >
                    {{ day }}
                  </span>
                </div>
              </td>
              <td class="px-4 py-3 text-center font-medium text-gray-700">
                {{ biker.records }}
              </td>
              <td class="px-4 py-3 text-right">
                <span class="font-semibold text-emerald-600 text-base">{{
                  formatCurrency(biker.gross)
                }}</span>
              </td>
            </tr>
            <!-- Totals row -->
            <tr class="bg-gray-50 border-t-2 border-gray-300 font-bold">
              <td class="px-4 py-3 text-gray-800" colspan="2">Total</td>
              <td class="px-4 py-3 text-center text-gray-800">
                {{ summary.totalRecords }}
              </td>
              <td class="px-4 py-3 text-right text-emerald-700 text-base">
                {{ formatCurrency(summary.grossTotal) }}
              </td>
            </tr>
          </tbody>
        </table>
        <div v-else class="py-16 text-center text-gray-400">
          <UIcon
            name="i-heroicons-inbox"
            class="w-12 h-12 mx-auto text-gray-300 mb-2"
          />
          <p>Nenhum registro encontrado para este período.</p>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { useAuthStore } from "~/stores/auth";

definePageMeta({
  layout: "admin",
});

const authStore = useAuthStore();

const isLoading = ref(false);
const selectedCompany = ref("");
const companies = ref<{ id: string; name: string }[]>([]);

const summary = ref({
  grossTotal: 0,
  totalRecords: 0,
  bikers: [] as {
    bikerId: string;
    bikerName: string;
    gross: number;
    totalDeliveries: number;
    records: number;
    days: string[];
  }[],
  companyBreakdown: [] as {
    companyId: string;
    companyName: string;
    gross: number;
    bikerCount: number;
  }[],
  selectedCompanyName: null as string | null,
});

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
const pickerWeek = ref("");

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
    const label = `Semana ${i + 1} (${String(mon.getDate()).padStart(2, "0")}/${String(mon.getMonth() + 1).padStart(2, "0")} – ${String(sun.getDate()).padStart(2, "0")}/${String(sun.getMonth() + 1).padStart(2, "0")})`;
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
    fetchSummary();
  }
}

function onWeekChange() {
  const w = weeksInMonth.value.find((x) => x.label === pickerWeek.value);
  if (w) {
    weekRange.value = { from: toISODate(w.from), to: toISODate(w.to) };
    fetchSummary();
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
  fetchSummary();
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

const formatCurrency = (val: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(val || 0);

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("") || "?";

const dayOrder = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

const orderedDays = (days: string[]) =>
  [...days].sort((a, b) => dayOrder.indexOf(a) - dayOrder.indexOf(b));

const getDayStyle = (day: string) => {
  const styles: Record<string, string> = {
    Seg: "bg-blue-100 text-blue-700",
    Ter: "bg-emerald-100 text-emerald-700",
    Qua: "bg-violet-100 text-violet-700",
    Qui: "bg-amber-100 text-amber-700",
    Sex: "bg-rose-100 text-rose-700",
    Sáb: "bg-cyan-100 text-cyan-700",
    Dom: "bg-orange-100 text-orange-700",
  };
  return styles[day] || "bg-gray-100 text-gray-700";
};

let isFirstLoad = true;

const fetchSummary = async () => {
  isLoading.value = true;
  try {
    let url = `/api/admin/weekly-summary?dateFrom=${weekRange.value.from}&dateTo=${weekRange.value.to}`;
    if (selectedCompany.value) {
      url += `&companyId=${selectedCompany.value}`;
    }

    const res = await $fetch<{ success: boolean; data: any }>(url);

    if (isFirstLoad && res.success && res.data) {
      if (res.data.totalRecords === 0) {
        isFirstLoad = false;
        shiftWeek(-1);
        return;
      }
    }

    isFirstLoad = false;

    if (res.success && res.data) {
      summary.value = res.data;
      if (res.data.companies?.length) {
        companies.value = res.data.companies;
      }
    }
  } catch (error) {
    console.error("Error fetching weekly summary:", error);
  } finally {
    isLoading.value = false;
  }
};

watch(selectedCompany, () => {
  fetchSummary();
});

onMounted(async () => {
  if (!authStore.user) await authStore.getCurrentUser();
  await fetchSummary();
});
</script>
