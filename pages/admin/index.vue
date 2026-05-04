<template>
  <div class="h-full flex flex-col pt-0 md:py-4 overflow-auto">
    <!-- Stat Cards + Filters -->
    <div class="shrink-0 mb-5">
      <!-- Filter Bar -->
      <div
        class="mb-4 bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden"
      >
        <!-- Top row: selects -->
        <div
          class="flex items-stretch divide-x divide-gray-100 border-b border-gray-100"
        >
          <!-- Company Filter (admin only) -->
          <label
            v-if="auth.user?.role === 'admin'"
            class="flex items-center gap-2 px-3 py-2.5 flex-1 min-w-0 hover:bg-gray-50/70 transition-colors cursor-pointer group"
          >
            <span
              class="shrink-0 w-7 h-7 rounded-lg bg-violet-50 flex items-center justify-center"
            >
              <UIcon
                name="i-ph-storefront-duotone"
                class="w-4 h-4 text-violet-500"
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
                <option value="all">Todas as Empresas</option>
                <option v-for="c in companies" :key="c.id" :value="c.id">
                  {{ c.name }}
                </option>
              </select>
            </div>
            <UIcon
              name="i-heroicons-chevron-up-down"
              class="w-4 h-4 text-gray-300 group-hover:text-gray-400 shrink-0"
            />
          </label>

          <!-- Biker Filter -->
          <label
            class="flex items-center gap-2 px-3 py-2.5 flex-1 min-w-0 hover:bg-gray-50/70 transition-colors cursor-pointer group"
          >
            <span
              class="shrink-0 w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center"
            >
              <UIcon
                name="i-ph-person-simple-bike-duotone"
                class="w-4 h-4 text-emerald-500"
              />
            </span>
            <div class="flex-1 min-w-0">
              <p
                class="text-[10px] font-bold uppercase tracking-wider text-gray-400 leading-none mb-0.5"
              >
                Entregador
              </p>
              <select
                v-model="selectedBiker"
                :disabled="isLoading"
                class="w-full text-sm font-semibold text-gray-800 bg-transparent border-none p-0 focus:ring-0 cursor-pointer truncate appearance-none"
              >
                <option value="all">Todos</option>
                <option
                  v-for="biker in bikers"
                  :key="biker.id"
                  :value="biker.id"
                >
                  {{ biker.name }}
                </option>
              </select>
            </div>
            <UIcon
              name="i-heroicons-chevron-up-down"
              class="w-4 h-4 text-gray-300 group-hover:text-gray-400 shrink-0"
            />
          </label>
        </div>

        <!-- Bottom row: week picker -->
        <div
          class="flex items-center gap-1 sm:gap-2 px-3 py-2 border-t border-gray-100"
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

          <!-- Divider -->
          <div class="w-px h-5 bg-gray-200 mx-1"></div>

          <!-- Refresh -->
          <button
            @click="fetchStats"
            :title="isLoading ? 'Carregando…' : 'Atualizar'"
            class="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-primary transition-colors"
          >
            <UIcon
              name="i-heroicons-arrow-path"
              :class="['w-4 h-4', isLoading ? 'animate-spin text-primary' : '']"
            />
          </button>
        </div>
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
              <p
                class="text-[10px] text-gray-500 uppercase font-bold tracking-wider"
              >
                Nome
              </p>
              <p class="text-sm font-medium text-gray-900">
                {{ selectedBikerData.name }}
              </p>
            </div>
            <div>
              <p
                class="text-[10px] text-gray-500 uppercase font-bold tracking-wider"
              >
                Telefone
              </p>
              <p class="text-sm font-medium text-gray-900">
                {{ selectedBikerData.phone || "N/A" }}
              </p>
            </div>
            <div>
              <p
                class="text-[10px] text-gray-500 uppercase font-bold tracking-wider"
              >
                Email
              </p>
              <p class="text-sm font-medium text-gray-900 truncate">
                {{ selectedBikerData.email || "N/A" }}
              </p>
            </div>
            <div>
              <p
                class="text-[10px] text-gray-500 uppercase font-bold tracking-wider"
              >
                Status
              </p>
              <span
                :class="[
                  'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mt-0.5',
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
      </div>

      <!-- Admin Metric Cards -->
      <div
        v-if="auth.user?.role === 'admin'"
        class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6"
      >
        <div
          class="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-6 hover:shadow-md transition-shadow"
        >
          <div class="flex items-center justify-between gap-3">
            <div class="min-w-0 flex-1">
              <p class="text-sm font-medium text-gray-500 truncate">
                Qtd Entregas
              </p>
              <p
                class="text-3xl sm:text-4xl font-bold text-gray-900 mt-2 truncate"
              >
                {{ stats.adminStats?.totalDeliveriesCount || 0 }}
              </p>
            </div>
            <div
              class="h-14 w-14 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0"
            >
              <UIcon
                name="i-ph-package-duotone"
                class="w-7 h-7 text-blue-500"
              />
            </div>
          </div>
        </div>

        <div
          class="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-6 hover:shadow-md transition-shadow"
        >
          <div class="flex items-center justify-between gap-3">
            <div class="min-w-0 flex-1">
              <p class="text-sm font-medium text-gray-500 truncate">
                Adiantado
              </p>
              <p
                class="text-3xl sm:text-4xl font-bold text-red-600 mt-2 truncate"
              >
                {{ formatCurrency(stats.adminStats?.totalAdvances || 0) }}
              </p>
            </div>
            <div
              class="h-14 w-14 rounded-2xl bg-red-50 flex items-center justify-center shrink-0"
            >
              <UIcon
                name="i-ph-arrow-circle-down-duotone"
                class="w-7 h-7 text-red-500"
              />
            </div>
          </div>
        </div>

        <div
          class="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-6 hover:shadow-md transition-shadow"
        >
          <div class="flex items-center justify-between gap-3">
            <div class="min-w-0 flex-1">
              <p class="text-sm font-medium text-gray-500 truncate">
                Total Bruto
              </p>
              <p
                class="text-3xl sm:text-4xl font-bold text-orange-600 mt-2 truncate"
              >
                {{ formatCurrency(stats.adminStats?.totalGross || 0) }}
              </p>
            </div>
            <div
              class="h-14 w-14 rounded-2xl bg-orange-50 flex items-center justify-center shrink-0"
            >
              <UIcon
                name="i-ph-coins-duotone"
                class="w-7 h-7 text-orange-500"
              />
            </div>
          </div>
        </div>

        <div
          class="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-6 hover:shadow-md transition-shadow"
        >
          <div class="flex items-center justify-between gap-3">
            <div class="min-w-0 flex-1">
              <p class="text-sm font-medium text-gray-500 truncate">A Pagar</p>
              <p
                class="text-3xl sm:text-4xl font-bold mt-2 truncate"
                :class="(stats.adminStats?.totalNet || 0) < 0 ? 'text-red-600' : 'text-green-600'"
              >
                {{ formatCurrency(stats.adminStats?.totalNet || 0) }}
              </p>
            </div>
            <div
              class="h-14 w-14 rounded-2xl bg-green-50 flex items-center justify-center shrink-0"
            >
              <UIcon name="i-ph-money-duotone" class="w-7 h-7 text-green-500" />
            </div>
          </div>
        </div>

        <div
          class="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-6 hover:shadow-md transition-shadow"
        >
          <div class="flex items-center justify-between gap-3">
            <div class="min-w-0 flex-1">
              <p class="text-sm font-medium text-gray-500 truncate">
                Entregadores
              </p>
              <p
                class="text-3xl sm:text-4xl font-bold text-emerald-600 mt-2 truncate"
              >
                {{ bikers.length }}
              </p>
            </div>
            <div
              class="h-14 w-14 rounded-2xl bg-emerald-50 flex items-center justify-center shrink-0"
            >
              <UIcon
                name="i-ph-motorcycle-duotone"
                class="w-7 h-7 text-emerald-500"
              />
            </div>
          </div>
        </div>

        <div
          class="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-6 hover:shadow-md transition-shadow"
        >
          <div class="flex items-center justify-between gap-3">
            <div class="min-w-0 flex-1">
              <p class="text-sm font-medium text-gray-500 truncate">Empresas</p>
              <p
                class="text-3xl sm:text-4xl font-bold text-violet-600 mt-2 truncate"
              >
                {{ companies.length }}
              </p>
            </div>
            <div
              class="h-14 w-14 rounded-2xl bg-violet-50 flex items-center justify-center shrink-0"
            >
              <UIcon
                name="i-ph-storefront-duotone"
                class="w-7 h-7 text-violet-500"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Manager 3 Cards -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div
          class="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-5 hover:shadow-md transition-shadow"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs sm:text-sm text-gray-500 font-medium">
                Pedidos Entregues
              </p>
              <div class="flex items-baseline gap-2 mt-1">
                <p class="text-2xl sm:text-3xl font-bold text-gray-900">
                  {{ stats.completedDeliveries }}
                </p>
                <span class="text-sm text-gray-400"
                  >/ {{ stats.totalDeliveries }}</span
                >
              </div>
            </div>
            <div
              class="h-11 w-11 rounded-xl bg-blue-50 flex items-center justify-center shrink-0"
            >
              <UIcon
                name="i-ph-package-duotone"
                class="w-6 h-6 text-blue-500"
              />
            </div>
          </div>
        </div>

        <div
          class="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-5 hover:shadow-md transition-shadow"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs sm:text-sm text-gray-500 font-medium">
                Valor Total
              </p>
              <p class="text-2xl sm:text-3xl font-bold text-green-600 mt-1">
                {{ formatCurrency(stats.totalEarned || 0) }}
              </p>
            </div>
            <div
              class="h-11 w-11 rounded-xl bg-green-50 flex items-center justify-center shrink-0"
            >
              <UIcon name="i-ph-coins-duotone" class="w-6 h-6 text-green-500" />
            </div>
          </div>
        </div>

        <div
          class="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-5 hover:shadow-md transition-shadow"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs sm:text-sm text-gray-500 font-medium">
                Pago a Entregadores
              </p>
              <p class="text-2xl sm:text-3xl font-bold text-orange-600 mt-1">
                {{ formatCurrency(stats.totalSpent || 0) }}
              </p>
            </div>
            <div
              class="h-11 w-11 rounded-xl bg-orange-50 flex items-center justify-center shrink-0"
            >
              <UIcon
                name="i-ph-credit-card-duotone"
                class="w-6 h-6 text-orange-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Table Section -->
    <div
      class="flex-1 min-h-0 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col overflow-hidden"
      v-if="auth.user?.role === 'manager'"
    >
      <!-- Table Header -->
      <div class="px-4 sm:px-6 pt-4 pb-3 border-b border-gray-200 shrink-0">
        <h2 class="text-base font-semibold text-gray-900">
          Histórico de Entregas
        </h2>
      </div>

      <!-- Manager Table: Recent Deliveries -->
      <div class="flex-1 min-h-0 overflow-auto">
        <table class="min-w-[600px] w-full divide-y divide-gray-200 relative">
          <thead class="bg-gray-50 sm:bg-gray-100 sticky top-0 z-10 shadow-sm">
            <tr>
              <th
                class="px-4 py-3 sm:px-6 sm:py-4 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-500 sm:text-gray-800 text-left"
              >
                Data
              </th>
              <th
                class="px-4 py-3 sm:px-6 sm:py-4 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-500 sm:text-gray-800 text-left"
              >
                Cliente / Pedido
              </th>
              <th
                v-if="selectedBiker === 'all'"
                class="px-4 py-3 sm:px-6 sm:py-4 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-500 sm:text-gray-800 text-left"
              >
                Entregador
              </th>
              <th
                class="px-4 py-3 sm:px-6 sm:py-4 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-500 sm:text-gray-800 text-left"
              >
                Valor
              </th>
              <th
                class="px-4 py-3 sm:px-6 sm:py-4 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-500 sm:text-gray-800 text-left"
              >
                Taxa
              </th>
              <th
                class="px-4 py-3 sm:px-6 sm:py-4 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-500 sm:text-gray-800 text-right"
              >
                Status
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-white">
            <tr
              v-for="delivery in stats.recentDeliveries"
              :key="delivery.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <td
                class="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm text-gray-700 font-medium"
              >
                {{ formatDate(delivery.created_at) }}
              </td>
              <td class="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm">
                <div class="font-medium text-gray-900">
                  {{ delivery.customer_name || "Cliente" }}
                </div>
                <div class="text-xs text-gray-400">
                  #{{ delivery.id.split("-")[0] }}
                </div>
              </td>
              <td
                v-if="selectedBiker === 'all'"
                class="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm text-gray-700"
              >
                {{ delivery.Entregadores?.name || "N/A" }}
              </td>
              <td
                class="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm font-semibold text-gray-700"
              >
                {{ formatCurrency(delivery.total) }}
              </td>
              <td
                class="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm font-semibold text-orange-600"
              >
                {{ formatCurrency(delivery.delivery_fee || 0) }}
              </td>
              <td
                class="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm text-right"
              >
                <span
                  :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    statusStyles[delivery.status] ||
                      'bg-gray-100 text-gray-800',
                  ]"
                >
                  {{ statusLabels[delivery.status] || delivery.status }}
                </span>
              </td>
            </tr>
            <tr
              v-if="
                stats.recentDeliveries && stats.recentDeliveries.length === 0
              "
            >
              <td
                :colspan="selectedBiker === 'all' ? 6 : 5"
                class="px-6 py-12 text-center text-sm text-gray-500"
              >
                <UIcon
                  name="i-heroicons-inbox"
                  class="w-10 h-10 mx-auto text-gray-300 mb-2"
                />
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
const selectedCompany = ref("all"); // empresa filter for admin

const companies = ref<any[]>([]);

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

/** Return Monday of the week containing `date` */
function getMondayOf(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay(); // 0=Sun
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Format yyyy-mm-dd without UTC shift */
function toISODate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function formatShort(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}`;
}

// Initialise to current Mon–Sun
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

/** Compute Mon–Sun weeks in pickerMonth year */
const weeksInMonth = computed(() => {
  const year = new Date().getFullYear();
  const weeks: { label: string; from: Date; to: Date }[] = [];
  const cursor = new Date(year, pickerMonth.value, 1);
  let mon = getMondayOf(cursor);
  for (let i = 0; i < 6; i++) {
    const sun = new Date(mon);
    sun.setDate(sun.getDate() + 6);
    // Only include if the week overlaps with pickerMonth
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

/** When month changes, select first week of new month */
function onMonthChange() {
  if (weeksInMonth.value.length) {
    const w = weeksInMonth.value[0];
    pickerWeek.value = w.label;
    weekRange.value = { from: toISODate(w.from), to: toISODate(w.to) };
    fetchStats();
  }
}

/** When week selection changes */
function onWeekChange() {
  const w = weeksInMonth.value.find((x) => x.label === pickerWeek.value);
  if (w) {
    weekRange.value = { from: toISODate(w.from), to: toISODate(w.to) };
    fetchStats();
  }
}

/** Navigate ±1 week */
function shiftWeek(dir: 1 | -1) {
  // Parse as local date (not UTC) to avoid timezone shift in UTC-3
  const [fy, fm, fd] = weekRange.value.from.split("-").map(Number);
  const from = new Date(fy, fm - 1, fd);
  from.setDate(from.getDate() + dir * 7);
  const to = new Date(from.getFullYear(), from.getMonth(), from.getDate() + 6);
  weekRange.value = { from: toISODate(from), to: toISODate(to) };
  pickerMonth.value = from.getMonth();
  // Update pickerWeek label if it exists in list
  const match = weeksInMonth.value.find(
    (w) => toISODate(w.from) === weekRange.value.from,
  );
  if (match) pickerWeek.value = match.label;
  else pickerWeek.value = "";
  fetchStats();
}

// Initialise pickerWeek label
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

/** Load all companies (admin only) */
const loadCompanies = async () => {
  if (auth.user?.role !== "admin") return;
  try {
    const res = await $fetch<{ success: boolean; data: any[] }>(
      "/api/companies",
    );
    if (res.success) companies.value = res.data || [];
  } catch (e) {
    console.error("Error loading companies:", e);
  }
};

/** Load bikers — all when no company selected, filtered when company chosen */
const loadBikers = async () => {
  if (!companyId.value && auth.user?.role !== "admin") return;
  try {
    let url = "/api/bikers";
    if (auth.user?.role === "admin") {
      // Filter by selected company, or fetch all
      if (selectedCompany.value && selectedCompany.value !== "all") {
        url += `?companyId=${selectedCompany.value}`;
      }
      // else no param → API returns all bikers
    } else {
      url += `?companyId=${companyId.value}`;
    }
    const res = await $fetch<{ success: boolean; data: any[] }>(url);
    if (res.success) bikers.value = res.data || [];
  } catch (error) {
    console.error("Error loading bikers:", error);
  }
};

let isFirstLoad = true;

const fetchStats = async () => {
  if (!companyId.value && auth.user?.role !== "admin") return;

  isLoading.value = true;
  try {
    // Use selected company for admin, own companyId for manager
    const cid =
      auth.user?.role === "admin"
        ? selectedCompany.value !== "all"
          ? selectedCompany.value
          : ""
        : companyId.value;

    let url = `/api/admin/biker-stats?companyId=${cid}`;
    if (selectedBiker.value && selectedBiker.value !== "all") {
      url += `&bikerId=${selectedBiker.value}`;
    }
    url += `&dateFrom=${weekRange.value.from}&dateTo=${weekRange.value.to}`;

    const res = await $fetch<{ success: boolean; data: any }>(url);

    if (isFirstLoad && res.success && res.data) {
      const d = res.data;
      const hasData =
        d.totalDeliveries > 0 ||
        (d.recentDeliveries && d.recentDeliveries.length > 0) ||
        (d.adminStats && (d.adminStats.pendingDeliveriesCount > 0 || d.adminStats.totalGross > 0));

      if (!hasData) {
        isFirstLoad = false;
        shiftWeek(-1);
        return;
      }
    }

    isFirstLoad = false;

    if (res.success && res.data) stats.value = res.data;
  } catch (error) {
    console.error("Error fetching stats:", error);
  } finally {
    isLoading.value = false;
  }
};

watch(selectedBiker, () => fetchStats());

// When company changes: reload bikers (filtered) and reset biker selection
watch(selectedCompany, () => {
  selectedBiker.value = "all";
  loadBikers();
  fetchStats();
});

watch(companyId, () => {
  // For managers: react when companyId is resolved
  if (companyId.value) {
    loadBikers();
    fetchStats();
  }
});

onMounted(async () => {
  if (!auth.user) {
    await auth.getCurrentUser();
  }
  // Admin: load companies list first
  await loadCompanies();
  await loadBikers();
  await fetchStats();
});
</script>
