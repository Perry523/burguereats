<template>
  <div class="h-full flex flex-col gap-4 pt-0 md:py-4">
    <TableBase
      class="flex-1 min-h-0 bg-white rounded-lg pt-2 md:pt-5 pb-0 px-0 shadow-sm border border-gray-200"
      :loading="isLoading"
      :rows="filteredPayments"
      :total-items="filteredPayments.length"
      :columns="columns"
      v-model:page="page"
      v-model:per_page="itemsPerPage"
      hide-edit
      hide-delete
    >
      <template #filter>
        <div
          class="w-full px-3 sm:px-5 pb-1 md:pb-4 flex flex-wrap sm:flex-nowrap items-center gap-2 overflow-hidden shrink-0"
        >
          <h1
            class="text-xl font-bold text-gray-900 hidden lg:block mr-2 shrink-0"
          >
            {{ auth.user?.role === "admin" ? "Registros" : "Meus Registros" }}
          </h1>

          <!-- Search (admin only) -->
          <div
            v-if="auth.user?.role === 'admin'"
            class="relative w-full sm:w-32 md:w-48 shrink-0 sm:shrink"
          >
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
              placeholder="Empresa ou entregador..."
            />
          </div>

          <!-- Controls wrapper for mobile -->
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
              class="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-xl px-2 py-1.5 flex-1 min-w-0"
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

            <button
              @click="openAddModal"
              class="inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary px-2.5 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-medium text-white transition-colors hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 shadow-sm whitespace-nowrap shrink-0"
            >
              <UIcon name="i-heroicons-plus" class="h-4 w-4 sm:h-5 sm:w-5" />
              <span class="hidden sm:inline">Adicionar</span>
            </button>
          </div>
        </div>
      </template>

      <!-- Custom column rendering -->
      <template #company_name="{ row }">
        <div class="flex items-center gap-3">
          <div
            class="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center shrink-0"
          >
            <UIcon
              name="i-ph-storefront-duotone"
              class="w-4 h-4 text-green-600"
            />
          </div>
          <div>
            <p
              v-if="auth.user?.role === 'admin'"
              class="font-bold text-gray-900 leading-tight"
            >
              {{ row.biker_name }}
            </p>
            <p
              class="font-medium text-gray-700 leading-tight"
              :class="auth.user?.role === 'admin' ? 'text-[11px]' : ''"
            >
              {{ row.company_name }}
            </p>
            <div class="flex items-center gap-2 mt-0.5">
              <span class="text-[10px] text-gray-500">
                {{ formatDateBR(row.date) }}
              </span>
              <span
                v-if="row.is_paid"
                class="px-1.5 py-0.5 rounded text-[8px] font-bold bg-green-100 text-green-700 uppercase tracking-wider"
              >
                Pago
              </span>
              <span
                v-else
                class="px-1.5 py-0.5 rounded text-[8px] font-bold bg-orange-100 text-orange-700 uppercase tracking-wider"
              >
                Pendente
              </span>
            </div>
          </div>
        </div>
      </template>

      <template #total_deliveries="{ row }">
        <span class="text-xs sm:text-sm text-gray-700"
          >{{ row.total_deliveries }} entrega{{
            row.total_deliveries !== 1 ? "s" : ""
          }}</span
        >
      </template>

      <template #amount="{ row }">
        <span class="font-semibold text-green-600"
          >+ {{ formatCurrency(row.amount) }}</span
        >
      </template>

      <!-- Ver mais action -->
      <template #additional-actions="{ item }">
        <li v-if="!item.is_paid" @click="editPayment(item)">
          <a
            class="flex items-center gap-3 text-base py-2.5 px-4 font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-150 cursor-pointer"
          >
            <UIcon
              name="i-heroicons-pencil-square"
              class="w-5 h-5 text-gray-400"
            />
            Editar
          </a>
        </li>
        <li v-if="!item.is_paid" @click="deletePayment(item)">
          <a
            class="flex items-center gap-3 text-base py-2.5 px-4 font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-150 cursor-pointer"
          >
            <UIcon
              name="i-heroicons-trash"
              class="w-5 h-5 text-red-500 hover:text-red-600"
            />
            Excluir
          </a>
        </li>
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
    <BaseDialog v-model="showDetailsModal" title="Detalhes do Registro">
      <div class="p-4 space-y-6" v-if="selectedPayment">
        <div
          class="flex items-center justify-between border-b border-gray-100 pb-4"
        >
          <div>
            <p class="text-xs text-gray-500 uppercase font-bold tracking-wider">
              Data
            </p>
            <p class="text-gray-900 font-medium">
              {{ formatDateBR(selectedPayment.date) }}
            </p>
            <div class="mt-1">
              <span
                v-if="selectedPayment.is_paid"
                class="px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-700 uppercase tracking-wider"
              >
                Pago
              </span>
              <span
                v-else
                class="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-100 text-orange-700 uppercase tracking-wider"
              >
                Pendente
              </span>
            </div>
          </div>
          <div class="text-right">
            <div
              class="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center ml-auto"
            >
              <UIcon
                name="i-ph-storefront-duotone"
                class="w-4 h-4 text-green-600"
              />
            </div>
          </div>
        </div>

        <div>
          <p class="text-xs text-gray-500 uppercase font-bold tracking-wider">
            Restaurante
          </p>
          <p class="text-lg font-semibold text-gray-900">
            {{ selectedPayment.company_name }}
          </p>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <p
              class="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1"
            >
              Entregas
            </p>
            <p class="text-xl font-bold text-gray-900">
              {{ selectedPayment.total_deliveries }}
            </p>
          </div>
          <div class="bg-green-50 rounded-xl p-4 border border-green-200">
            <p
              class="text-xs text-green-600 uppercase font-bold tracking-wider mb-1"
            >
              Valor
            </p>
            <p class="text-xl font-bold text-green-700">
              {{ formatCurrency(selectedPayment.amount) }}
            </p>
          </div>
        </div>

        <div v-if="selectedPayment.image_url">
          <p class="text-xs text-gray-500 uppercase font-bold tracking-wider mb-2">Comprovante</p>
          <img :src="selectedPayment.image_url" class="w-full rounded-xl border border-gray-200" alt="Comprovante" />
          <div v-if="selectedPayment.is_checked" class="flex items-center gap-2 mt-2 bg-green-50 p-2 rounded-lg text-green-700 text-sm font-semibold">
            <UIcon name="i-heroicons-check-circle" class="w-5 h-5" />
            Comprovante validado
          </div>
          <div v-else class="flex items-center gap-2 mt-2 bg-yellow-50 p-2 rounded-lg text-yellow-700 text-sm font-semibold">
            <UIcon name="i-heroicons-clock" class="w-5 h-5" />
            Aguardando validação
          </div>
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

    <!-- Modal Adicionar/Editar Registro -->
    <BaseDialog
      v-model="showAddModal"
      :title="editingPaymentId ? 'Editar Registro' : 'Adicionar Registro'"
    >
      <div class="p-4 space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Data <span class="text-red-500">*</span></label
          >
          <input
            v-model="form.date"
            type="date"
            required
            class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
            @change="onDateChange"
          />
        </div>

        <div
          v-if="isCheckingDate"
          class="flex items-center gap-2 text-sm text-gray-500"
        >
          <UIcon name="i-heroicons-arrow-path" class="w-4 h-4 animate-spin" />
          Verificando...
        </div>

        <div v-else-if="form.date && dateChecked">
          <div
            v-if="vinculatedCompanies.length === 0"
            class="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700"
          >
            Você não possui vínculo permanente com nenhum restaurante. Entre em
            contato com o suporte para ser vinculado.
          </div>
          <div v-else>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Restaurante <span class="text-red-500">*</span></label
            >
            <select
              v-model="form.company_id"
              class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm bg-white text-gray-700"
            >
              <option value="" disabled>Selecione o restaurante...</option>
              <option
                v-for="c in vinculatedCompanies"
                :key="c.company_id"
                :value="c.company_id"
              >
                {{ c.company_name }}
              </option>
            </select>
          </div>
        </div>

        <div
          v-if="vinculatedCompanies.length > 0 && form.company_id"
          class="grid grid-cols-2 gap-4"
        >
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Valor (R$) <span class="text-red-500">*</span></label
            >
            <Currency
              v-model="form.amount"
              required
              class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              placeholder="R$ 0,00"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Total Entregas</label
            >
            <input
              v-model.number="form.total_deliveries"
              type="number"
              min="0"
              class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              placeholder="0"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Comprovante (Opcional)</label>
          <div class="mt-1 flex items-center gap-4">
            <input
              type="file"
              accept="image/*"
              class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
              @change="onFileChange"
            />
          </div>
          <div v-if="form.image_url || filePreview" class="mt-2 relative inline-block">
            <img :src="filePreview || form.image_url" class="h-24 rounded-lg border border-gray-200" alt="Preview" />
            <button
              @click.prevent="clearImage"
              class="absolute -top-2 -right-2 bg-white rounded-full text-red-500 hover:text-red-700 shadow-sm"
            >
              <UIcon name="i-heroicons-x-circle" class="w-6 h-6" />
            </button>
          </div>
        </div>

        <div
          v-if="submitError"
          class="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700"
        >
          {{ submitError }}
        </div>

        <div class="flex justify-end gap-3 pt-4 mt-2 border-t border-gray-100">
          <button
            @click="showAddModal = false"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            v-if="vinculatedCompanies.length > 0 && form.company_id"
            @click="submitPayment"
            :disabled="isSubmitting || !form.amount || form.amount <= 0"
            class="px-5 py-2 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary-focus focus:outline-none disabled:opacity-50 transition-colors"
          >
            {{ isSubmitting ? "Salvando..." : "Salvar Registro" }}
          </button>
        </div>
      </div>
    </BaseDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useAuthStore } from "~/stores/auth";

definePageMeta({
  layout: "admin",
});

const auth = useAuthStore();
const toast = useToast();

const payments = ref<any[]>([]);
const isLoading = ref(false);
const search = ref("");
const page = ref(1);
const itemsPerPage = ref(10);

// Modal state
const showAddModal = ref(false);
const showDetailsModal = ref(false);
const selectedPayment = ref<any>(null);
const vinculatedCompanies = ref<any[]>([]); // bounds options
const isCheckingDate = ref(false);
const dateChecked = ref(false);
const isSubmitting = ref(false);
const submitError = ref("");
const editingPaymentId = ref<string | null>(null);

const todayStr = () => {
  const d = new Date();
  return (
    d.getFullYear() +
    "-" +
    String(d.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(d.getDate()).padStart(2, "0")
  );
};

const form = ref({
  date: todayStr(),
  company_id: "",
  amount: 0,
  total_deliveries: 0,
  image_url: "",
});

const selectedFile = ref<File | null>(null);
const filePreview = ref<string>("");

const onFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    selectedFile.value = target.files[0];
    filePreview.value = URL.createObjectURL(target.files[0]);
  }
};

const clearImage = () => {
  selectedFile.value = null;
  filePreview.value = "";
  form.value.image_url = "";
};

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
    fetchPayments();
  }
}

function onWeekChange() {
  const w = weeksInMonth.value.find((x) => x.label === pickerWeek.value);
  if (w) {
    weekRange.value = { from: toISODate(w.from), to: toISODate(w.to) };
    fetchPayments();
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
  fetchPayments();
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
  { key: "company_name", label: "Restaurante", sm: true },
  { key: "total_deliveries", label: "Volume" },
  { key: "amount", label: "Valor", sm: true },
];

const viewDetails = (payment: any) => {
  selectedPayment.value = payment;
  showDetailsModal.value = true;
};

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

const filteredPayments = computed(() => {
  let list = payments.value;

  if (weekRange.value.from && weekRange.value.to) {
    list = list.filter((p) => {
      if (!p.date) return true;
      const pDate = p.date.split("T")[0];
      return pDate >= weekRange.value.from && pDate <= weekRange.value.to;
    });
  }

  if (search.value) {
    const term = search.value.toLowerCase();
    list = list.filter((p) => {
      const cName = p.company_name?.toLowerCase() || "";
      const bName = p.biker_name?.toLowerCase() || "";
      return cName.includes(term) || bName.includes(term);
    });
  }

  return list;
});

let isFirstLoad = true;

const fetchPayments = async () => {
  isLoading.value = true;
  try {
    const res = await $fetch<{
      success: boolean;
      data?: { wallet: number; payments: any[] };
    }>("/api/biker-payments");
    if (res.success && res.data) {
      if (auth.user) {
        auth.user.wallet = res.data.wallet;
      }
      payments.value = res.data.payments;

      if (isFirstLoad) {
        isFirstLoad = false;
        const hasCurrentWeekRecords = payments.value.some((p) => {
          if (!p.date) return false;
          const pDate = p.date.split("T")[0];
          return pDate >= weekRange.value.from && pDate <= weekRange.value.to;
        });

        if (!hasCurrentWeekRecords && payments.value.length > 0) {
          // Find the most recent date
          const latestDateStr = payments.value[0].date?.split("T")[0];
          if (latestDateStr) {
            const [y, m, d] = latestDateStr.split("-").map(Number);
            const latestDate = new Date(y, m - 1, d);
            const mon = getMondayOf(latestDate);
            const sun = new Date(mon);
            sun.setDate(sun.getDate() + 6);

            weekRange.value = { from: toISODate(mon), to: toISODate(sun) };
            pickerMonth.value = mon.getMonth();

            // Wait for computed weeksInMonth to update
            setTimeout(() => {
              const match = weeksInMonth.value.find(
                (w) => toISODate(w.from) === weekRange.value.from,
              );
              if (match) pickerWeek.value = match.label;
            }, 0);
          }
        }
      }
    }
  } catch (e) {
    console.error("Error fetching payments:", e);
  } finally {
    isLoading.value = false;
  }
};

const openAddModal = async () => {
  editingPaymentId.value = null;
  form.value = {
    date: todayStr(),
    company_id: "",
    amount: 0,
    total_deliveries: 0,
    image_url: "",
  };
  clearImage();
  vinculatedCompanies.value = [];
  dateChecked.value = false;
  submitError.value = "";
  showAddModal.value = true;
  await onDateChange();
};

const editPayment = async (payment: any) => {
  editingPaymentId.value = payment.id;
  form.value = {
    date: payment.date,
    company_id: payment.company_id,
    amount: payment.amount,
    total_deliveries: payment.total_deliveries || 0,
    image_url: payment.image_url || "",
  };
  clearImage();
  vinculatedCompanies.value = [];
  dateChecked.value = false;
  submitError.value = "";
  showAddModal.value = true;
  await onDateChange(true);
};

const deletePayment = async (payment: any) => {
  if (!confirm("Tem certeza que deseja excluir este registro?")) return;

  try {
    const res = await $fetch<{ success: boolean }>(
      `/api/biker-payments/record/${payment.id}`,
      {
        method: "DELETE",
      },
    );

    if (res.success) {
      toast.add({ color: "success", title: "Registro excluído com sucesso!" });
      await fetchPayments();
    }
  } catch (error: any) {
    console.error("Delete error", error);
    toast.add({
      color: "error",
      title: error?.data?.statusMessage || "Erro ao excluir registro",
    });
  }
};

const onDateChange = async (preserveCompany = false) => {
  if (!preserveCompany) {
    form.value.company_id = "";
  }
  dateChecked.value = false;

  if (!form.value.date) return;

  isCheckingDate.value = true;
  try {
    const res = await $fetch<{ success: boolean; data?: any[] }>(
      `/api/bikers/me/companies`,
    );
    const bounds = res?.data || [];
    vinculatedCompanies.value = bounds;

    if (bounds.length === 1 && !preserveCompany) {
      form.value.company_id = bounds[0].company_id;
    }
  } catch (e) {
    console.error("Error checking vinculations:", e);
    vinculatedCompanies.value = [];
  } finally {
    isCheckingDate.value = false;
    dateChecked.value = true;
  }
};

const submitPayment = async () => {
  isSubmitting.value = true;
  submitError.value = "";
  try {
    let finalImageUrl = form.value.image_url;

    if (selectedFile.value) {
      const formData = new FormData();
      formData.append("file", selectedFile.value);
      const uploadRes = await $fetch<{ success: boolean; data?: { url: string } }>("/api/uploads/biker-receipt", {
        method: "POST",
        body: formData,
      });
      if (uploadRes.success && uploadRes.data) {
        finalImageUrl = uploadRes.data.url;
      } else {
        toast.add({ color: "warning", title: "Erro ao enviar imagem. Salvando sem imagem..." });
      }
    }

    const url = editingPaymentId.value
      ? `/api/biker-payments/record/${editingPaymentId.value}`
      : "/api/biker-payments";

    const method = editingPaymentId.value ? "PUT" : "POST";

    const res = await $fetch<{ success: boolean; data?: { wallet: number } }>(
      url,
      {
        method,
        body: {
          date: form.value.date,
          company_id: form.value.company_id,
          amount: form.value.amount,
          total_deliveries: form.value.total_deliveries,
          image_url: finalImageUrl,
        },
      },
    );

    if (res.success) {
      // Re-fetch everything because wallet could have changed
      toast.add({
        color: "success",
        title: editingPaymentId.value
          ? "Registro atualizado!"
          : "Registro adicionado com sucesso!",
      });
      showAddModal.value = false;
      await fetchPayments();
    }
  } catch (error: any) {
    submitError.value = error?.data?.statusMessage || "Erro ao salvar registro";
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(async () => {
  if (!auth.user) await auth.getCurrentUser();
  await fetchPayments();
});
</script>
