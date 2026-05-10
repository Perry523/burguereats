<template>
  <div
    class="h-full flex flex-col pt-0 md:py-4 max-w-7xl mx-auto w-full px-2 sm:px-6 lg:px-8 gap-4 overflow-auto"
  >
    <!-- Filters card -->
    <div
      class="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden shrink-0"
    >
      <!-- Row 1: company + biker + type + paid filter -->
      <div
        class="flex flex-wrap items-stretch divide-x divide-gray-100 border-b border-gray-100"
      >
        <!-- Company -->
        <label
          class="flex items-center gap-2 px-3 py-2.5 flex-1 min-w-[160px] hover:bg-gray-50/70 transition-colors cursor-pointer group"
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
              v-model="filterCompany"
              class="w-full text-sm font-semibold text-gray-800 bg-transparent border-none p-0 focus:ring-0 cursor-pointer truncate appearance-none"
              @change="onFilterChange"
            >
              <option value="">Todas</option>
              <option v-for="c in companies" :key="c.id" :value="c.id">
                {{ c.name }}
              </option>
            </select>
          </div>
        </label>

        <!-- Biker -->
        <label
          class="flex items-center gap-2 px-3 py-2.5 flex-1 min-w-[160px] hover:bg-gray-50/70 transition-colors cursor-pointer group"
        >
          <span
            class="shrink-0 w-7 h-7 rounded-lg bg-violet-50 flex items-center justify-center"
          >
            <UIcon name="i-ph-motorcycle" class="w-4 h-4 text-violet-500" />
          </span>
          <div class="flex-1 min-w-0">
            <p
              class="text-[10px] font-bold uppercase tracking-wider text-gray-400 leading-none mb-0.5"
            >
              Entregador
            </p>
            <select
              v-model="filterBiker"
              class="w-full text-sm font-semibold text-gray-800 bg-transparent border-none p-0 focus:ring-0 cursor-pointer truncate appearance-none"
              @change="onFilterChange"
            >
              <option value="">Todos</option>
              <option v-for="b in bikers" :key="b.id" :value="b.id">
                {{ b.name }}
              </option>
            </select>
          </div>
        </label>

        <!-- Type -->
        <label
          class="flex items-center gap-2 px-3 py-2.5 flex-1 min-w-[140px] hover:bg-gray-50/70 transition-colors cursor-pointer group"
        >
          <span
            class="shrink-0 w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center"
          >
            <UIcon name="i-ph-funnel-duotone" class="w-4 h-4 text-amber-500" />
          </span>
          <div class="flex-1 min-w-0">
            <p
              class="text-[10px] font-bold uppercase tracking-wider text-gray-400 leading-none mb-0.5"
            >
              Tipo
            </p>
            <select
              v-model="filterType"
              class="w-full text-sm font-semibold text-gray-800 bg-transparent border-none p-0 focus:ring-0 cursor-pointer appearance-none"
              @change="onFilterChange"
            >
              <option value="">Todos</option>
              <option value="normal">Registros</option>
              <option value="advance">Adiantamentos</option>
            </select>
          </div>
        </label>

        <!-- Paid status -->
        <label
          class="flex items-center gap-2 px-3 py-2.5 flex-1 min-w-[140px] hover:bg-gray-50/70 transition-colors cursor-pointer group"
        >
          <span
            class="shrink-0 w-7 h-7 rounded-lg bg-sky-50 flex items-center justify-center"
          >
            <UIcon
              name="i-ph-check-circle-duotone"
              class="w-4 h-4 text-sky-500"
            />
          </span>
          <div class="flex-1 min-w-0">
            <p
              class="text-[10px] font-bold uppercase tracking-wider text-gray-400 leading-none mb-0.5"
            >
              Status
            </p>
            <select
              v-model="filterPaid"
              class="w-full text-sm font-semibold text-gray-800 bg-transparent border-none p-0 focus:ring-0 cursor-pointer appearance-none"
              @change="onFilterChange"
            >
              <option value="">Todos</option>
              <option value="false">Pendentes</option>
              <option value="true">Pagos</option>
            </select>
          </div>
        </label>
      </div>

      <!-- Row 2: week picker + refresh -->
      <div class="flex items-center gap-2 px-3 py-2">
        <button
          @click="shiftWeek(-1)"
          class="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <UIcon name="i-heroicons-chevron-left" class="w-4 h-4" />
        </button>

        <div class="flex-1 flex items-center justify-center gap-2">
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
            class="text-xs text-gray-500 bg-transparent border-none focus:ring-0 cursor-pointer p-0 max-w-[200px] truncate"
          >
            <option v-for="w in weeksInMonth" :key="w.label" :value="w.label">
              {{ w.label }}
            </option>
          </select>
        </div>

        <button
          @click="shiftWeek(1)"
          class="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <UIcon name="i-heroicons-chevron-right" class="w-4 h-4" />
        </button>

        <button
          @click="fetchRecords"
          class="ml-1 p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          title="Atualizar"
        >
          <UIcon
            name="i-heroicons-arrow-path"
            class="w-4 h-4"
            :class="{ 'animate-spin': isLoading }"
          />
        </button>
      </div>
    </div>

    <!-- Summary pills -->
    <div class="flex flex-wrap gap-3 shrink-0">
      <div
        class="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2 shadow-sm"
      >
        <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
        <span class="text-xs text-gray-500">Total registros:</span>
        <span class="text-sm font-bold text-gray-800">{{ totalCount }}</span>
      </div>
      <div
        class="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2 shadow-sm"
      >
        <span class="w-2 h-2 rounded-full bg-blue-400"></span>
        <span class="text-xs text-gray-500">Bruto:</span>
        <span class="text-sm font-bold text-gray-800">{{
          formatCurrency(totalGross)
        }}</span>
      </div>
      <div
        class="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2 shadow-sm"
      >
        <span class="w-2 h-2 rounded-full bg-amber-400"></span>
        <span class="text-xs text-gray-500">Adiantamentos:</span>
        <span class="text-sm font-bold text-amber-700">{{
          formatCurrency(totalAdvances)
        }}</span>
      </div>
      <div
        class="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2 shadow-sm"
      >
        <span class="w-2 h-2 rounded-full bg-red-400"></span>
        <span class="text-xs text-gray-500">Pendentes:</span>
        <span class="text-sm font-bold text-red-700">{{
          formatCurrency(totalPending)
        }}</span>
      </div>
    </div>

    <!-- Table -->
    <div
      class="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex-1 min-h-0 flex flex-col"
    >
      <!-- Loading -->
      <div
        v-if="isLoading && records.length === 0"
        class="flex-1 flex items-center justify-center py-20 text-gray-400 gap-3"
      >
        <UIcon name="i-heroicons-arrow-path" class="w-6 h-6 animate-spin" />
        <span class="text-sm">Carregando registros...</span>
      </div>

      <!-- Empty -->
      <div
        v-else-if="!isLoading && records.length === 0"
        class="flex-1 flex flex-col items-center justify-center py-20 gap-3 text-gray-400"
      >
        <UIcon name="i-heroicons-inbox" class="w-12 h-12 text-gray-300" />
        <p class="text-sm">
          Nenhum registro encontrado para os filtros selecionados.
        </p>
      </div>

      <!-- Table content -->
      <div v-else class="overflow-auto flex-1">
        <table class="w-full text-sm text-left">
          <thead
            class="text-xs text-gray-600 uppercase bg-gray-50 border-b border-gray-200 sticky top-0"
          >
            <tr>
              <th class="px-4 py-3 whitespace-nowrap">Data</th>
              <th class="px-4 py-3 whitespace-nowrap">Entregador</th>
              <th class="px-4 py-3 whitespace-nowrap hidden md:table-cell">
                Empresa / Tipo
              </th>
              <th
                class="px-4 py-3 text-center whitespace-nowrap hidden sm:table-cell"
              >
                Entregas
              </th>
              <th class="px-4 py-3 text-right whitespace-nowrap">Valor</th>
              <th class="px-4 py-3 text-center whitespace-nowrap">Status</th>
              <th class="px-4 py-3 text-center whitespace-nowrap">Ações</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr
              v-for="r in records"
              :key="r.id"
              class="hover:bg-gray-50 transition-colors"
              :class="r.is_advance ? 'bg-amber-50/40' : ''"
            >
              <!-- Date -->
              <td class="px-4 py-3 whitespace-nowrap">
                <span class="text-gray-700 font-medium">{{
                  formatDateBR(r.date)
                }}</span>
              </td>

              <!-- Biker -->
              <td class="px-4 py-3">
                <p class="font-semibold text-gray-900 text-sm">
                  {{ r.biker_name }}
                </p>
              </td>

              <!-- Company / type badge -->
              <td class="px-4 py-3 hidden md:table-cell">
                <span
                  v-if="r.is_advance"
                  class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 text-amber-700"
                >
                  <UIcon name="i-ph-money" class="w-3 h-3" />
                  Adiantamento
                </span>
                <span v-else class="text-gray-600 text-xs">{{
                  r.company_name
                }}</span>
              </td>

              <!-- Deliveries -->
              <td class="px-4 py-3 text-center hidden sm:table-cell">
                <span v-if="!r.is_advance" class="text-gray-600 text-sm">{{
                  r.total_deliveries || 0
                }}</span>
                <span v-else class="text-gray-300 text-xs">—</span>
              </td>

              <!-- Amount -->
              <td class="px-4 py-3 text-right">
                <span
                  class="font-bold text-sm"
                  :class="r.is_advance ? 'text-amber-700' : 'text-emerald-700'"
                >
                  {{ r.is_advance ? "- " : "" }}{{ formatCurrency(r.amount) }}
                </span>
              </td>

              <!-- Status -->
              <td class="px-4 py-3 text-center">
                <span
                  class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase"
                  :class="
                    r.is_paid
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  "
                >
                  <UIcon
                    :name="
                      r.is_paid
                        ? 'i-heroicons-check-circle'
                        : 'i-heroicons-clock'
                    "
                    class="w-3 h-3"
                  />
                  {{ r.is_paid ? "Pago" : "Pendente" }}
                </span>
                <span
                  v-if="r.is_checked"
                  class="ml-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-100 text-blue-700"
                  title="Foto validada"
                >
                  <UIcon name="i-heroicons-check-badge" class="w-3 h-3" />
                </span>
              </td>

              <!-- Actions -->
              <td class="px-4 py-3 text-center">
                <button
                  @click="viewDetails(r)"
                  class="p-1.5 rounded-lg hover:bg-primary/10 text-primary transition-colors"
                  title="Ver detalhes"
                >
                  <UIcon name="i-heroicons-eye" class="w-5 h-5" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div
        v-if="totalCount > 0"
        class="flex items-center justify-between px-4 py-3 border-t border-gray-100 shrink-0 bg-white"
      >
        <span class="text-xs text-gray-500">
          {{ (currentPage - 1) * perPage + 1 }}–{{
            Math.min(currentPage * perPage, totalCount)
          }}
          de {{ totalCount }} registros
        </span>
        <div class="flex items-center gap-1">
          <button
            @click="goToPage(currentPage - 1)"
            :disabled="currentPage <= 1"
            class="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <UIcon name="i-heroicons-chevron-left" class="w-4 h-4" />
          </button>
          <span class="text-xs font-semibold text-gray-700 px-2"
            >Pág. {{ currentPage }}</span
          >
          <button
            @click="goToPage(currentPage + 1)"
            :disabled="currentPage * perPage >= totalCount"
            class="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <UIcon name="i-heroicons-chevron-right" class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- Details Modal -->
    <BaseDialog v-model="showDetailsModal" title="Detalhes do Registro">
      <div class="p-4 space-y-4" v-if="selectedRecord">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Entregador</p>
            <p class="text-gray-900 font-medium">{{ selectedRecord.biker_name }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Data</p>
            <p class="text-gray-900 font-medium">{{ formatDateBR(selectedRecord.date) }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Empresa</p>
            <p class="text-gray-900 font-medium">{{ selectedRecord.company_name }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Valor</p>
            <p class="text-green-700 font-bold">{{ formatCurrency(selectedRecord.amount) }}</p>
          </div>
        </div>

        <div v-if="selectedRecord.image_url" class="mt-4 border-t border-gray-100 pt-4">
          <p class="text-xs text-gray-500 uppercase font-bold tracking-wider mb-2">Foto do dia</p>
          <img :src="selectedRecord.image_url" class="w-full rounded-xl border border-gray-200 mb-4 max-h-64 object-contain bg-gray-50 cursor-pointer hover:opacity-90 transition-opacity" alt="Foto do dia" @click="zoomedImage = selectedRecord.image_url" />
          
          <div class="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
            <div class="flex-1">
              <p class="text-sm font-semibold text-gray-800">Validação da Foto</p>
              <p class="text-xs text-gray-500">Confirme se a foto confere com o valor</p>
            </div>
            <button
              @click="toggleCheck(selectedRecord)"
              class="px-4 py-2 text-sm font-semibold text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              :class="selectedRecord.is_checked ? 'bg-red-500 hover:bg-red-600' : 'bg-primary hover:bg-primary-focus'"
            >
              {{ selectedRecord.is_checked ? 'Desfazer Aprovação' : 'Aprovar' }}
            </button>
          </div>
        </div>
        <div v-else class="mt-4 border-t border-gray-100 pt-4">
          <p class="text-sm text-gray-500 italic text-center py-4">Nenhuma foto anexada a este registro.</p>
        </div>

        <div class="flex justify-end pt-4">
          <button
            @click="showDetailsModal = false"
            class="px-6 py-2.5 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary-focus transition-colors shadow-sm"
          >
            Fechar
          </button>
        </div>
      </div>
    </BaseDialog>

    <!-- Zoom Modal -->
    <ClientOnly>
      <Teleport to="body">
        <div v-if="zoomedImage" class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm" @click="zoomedImage = null">
          <button class="absolute top-4 right-4 text-white/70 hover:text-white p-2 transition-colors">
            <UIcon name="i-heroicons-x-mark" class="w-8 h-8" />
          </button>
          <img :src="zoomedImage" class="max-w-full max-h-full object-contain select-none shadow-2xl rounded-sm" @click.stop />
        </div>
      </Teleport>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { useAuthStore } from "~/stores/auth";

definePageMeta({ layout: "admin" });

const authStore = useAuthStore();
const toast = useToast();

const isLoading = ref(false);

// Filters
const filterCompany = ref("");
const filterBiker = ref("");
const filterType = ref("");
const filterPaid = ref("");
const isRefreshing = ref(false);

const zoomedImage = ref<string | null>(null);

const records = ref<any[]>([]);
const totalCount = ref(0);
const bikers = ref<{ id: string; name: string }[]>([]);
const companies = ref<{ id: string; name: string }[]>([]);

// Modal state
const showDetailsModal = ref(false);
const selectedRecord = ref<any>(null);

// Pagination
const currentPage = ref(1);
const perPage = 50;

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
    fetchRecords();
  }
}

function onWeekChange() {
  const w = weeksInMonth.value.find((x) => x.label === pickerWeek.value);
  if (w) {
    weekRange.value = { from: toISODate(w.from), to: toISODate(w.to) };
    fetchRecords();
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
  fetchRecords();
}

// Init week label
const initLabel =
  weeksInMonth.value.find((w) => toISODate(w.from) === weekRange.value.from)
    ?.label ??
  weeksInMonth.value[0]?.label ??
  "";
pickerWeek.value = initLabel;
// ──────────────────────────────────────────────────────────────────

const formatCurrency = (val: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    val || 0,
  );

const formatDateBR = (dateStr: string) => {
  if (!dateStr) return "-";
  const [y, m, d] = dateStr.split("-");
  return `${d}/${m}/${y}`;
};

// Computed summaries from current page records
const totalGross = computed(() =>
  records.value
    .filter((r) => !r.is_advance)
    .reduce((acc, r) => acc + (Number(r.amount) || 0), 0),
);
const totalAdvances = computed(() =>
  records.value
    .filter((r) => r.is_advance)
    .reduce((acc, r) => acc + (Number(r.amount) || 0), 0),
);
const totalPending = computed(() =>
  records.value
    .filter((r) => !r.is_paid && !r.is_advance)
    .reduce((acc, r) => acc + (Number(r.amount) || 0), 0),
);

function onFilterChange() {
  currentPage.value = 1;
  fetchRecords();
}

function goToPage(p: number) {
  currentPage.value = p;
  fetchRecords();
}

const fetchRecords = async () => {
  isLoading.value = true;
  try {
    const params = new URLSearchParams({
      dateFrom: weekRange.value.from,
      dateTo: weekRange.value.to,
      page: String(currentPage.value),
      perPage: String(perPage),
    });
    if (filterCompany.value) params.set("companyId", filterCompany.value);
    if (filterBiker.value) params.set("bikerId", filterBiker.value);
    if (filterType.value) params.set("type", filterType.value);
    if (filterPaid.value !== "") params.set("isPaid", filterPaid.value);

    const res = await $fetch<{ success: boolean; data: any }>(
      `/api/biker-payments/records?${params.toString()}`,
    );

    if (res.success && res.data) {
      records.value = res.data.records;
      totalCount.value = res.data.total;
      if (res.data.bikers?.length) bikers.value = res.data.bikers;
      if (res.data.companies?.length) companies.value = res.data.companies;
    }
  } catch (error) {
    console.error("Error fetching records:", error);
    toast.add({ color: "error", title: "Erro ao carregar registros" });
  } finally {
    isLoading.value = false;
  }
};

const viewDetails = (r: any) => {
  selectedRecord.value = r;
  showDetailsModal.value = true;
};

const toggleCheck = async (r: any) => {
  try {
    const newValue = !r.is_checked;
    const res = await $fetch<{ success: boolean }>(`/api/biker-payments/record/${r.id}`, {
      method: "PUT",
      body: { is_checked: newValue },
    });
    if (res.success) {
      r.is_checked = newValue;
      toast.add({ color: "success", title: "Status atualizado com sucesso!" });
    }
  } catch (error: any) {
    console.error("Erro ao validar:", error);
    toast.add({ color: "error", title: error?.data?.statusMessage || "Erro ao atualizar status" });
  }
};

onMounted(async () => {
  if (!authStore.user) await authStore.getCurrentUser();
  await fetchRecords();
});
</script>
