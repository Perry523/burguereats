<template>
  <div class="h-[calc(100vh-128px)] flex flex-col gap-4 pt-0 md:pt-6">
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
          class="w-full px-3 sm:px-5 pb-1 md:pb-4 flex items-center justify-between gap-2"
        >
          <h1 class="text-xl font-bold text-gray-900 hidden lg:block mr-2">
            Meus Registros
          </h1>

          <div class="flex items-center gap-2 flex-1">
            <div class="relative flex-1 max-w-[160px]">
              <div
                class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5"
              >
                <UIcon
                  name="i-heroicons-calendar"
                  class="h-4 w-4 text-gray-400"
                />
              </div>
              <input
                type="date"
                v-model="filterDate"
                class="block w-full rounded-lg border border-gray-300 bg-white py-2 pl-8 pr-2 text-xs sm:text-sm focus:border-primary focus:ring-primary shadow-sm"
              />
            </div>
            
            <button
              v-if="filterDate"
              @click="filterDate = ''"
              class="text-xs text-slate-500 underline hover:text-slate-700 whitespace-nowrap"
            >
              Limpar
            </button>
          </div>

          <div class="flex items-center gap-2 shrink-0">
            <button
              @click="fetchPayments"
              class="flex items-center justify-center p-2 text-gray-500 hover:text-primary transition-colors bg-white rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
              title="Atualizar"
            >
              <UIcon
                name="i-heroicons-arrow-path"
                :class="['h-4 w-4 sm:h-5 sm:w-5', isLoading ? 'animate-spin' : '']"
              />
            </button>

            <button
              @click="openAddModal"
              class="inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary px-2.5 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-medium text-white transition-colors hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 shadow-sm whitespace-nowrap"
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
            <p class="font-medium text-gray-900">{{ row.company_name }}</p>
            <p class="text-[11px] text-gray-500">
              {{ formatDateBR(row.date) }}
            </p>
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

    <!-- Modal Adicionar Registro -->
    <BaseDialog v-model="showAddModal" title="Adicionar Registro">
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
          Verificando escala...
        </div>

        <div v-else-if="form.date && dateChecked">
          <div v-if="assignedCompanies.length > 0">
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Restaurante <span class="text-red-500">*</span></label
            >
            <select
              v-model="form.company_id"
              class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm bg-white text-gray-700"
            >
              <option value="" disabled>Selecione o restaurante...</option>
              <option
                v-for="c in assignedCompanies"
                :key="c.company_id"
                :value="c.company_id"
              >
                {{ c.company_name }}
              </option>
            </select>
          </div>
          <div
            v-else
            class="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-700"
          >
            Nenhum restaurante encontrado para esta data. Você precisa estar
            escalado para adicionar um registro.
          </div>
        </div>

        <div
          v-if="assignedCompanies.length > 0 && form.company_id"
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
            v-if="assignedCompanies.length > 0 && form.company_id"
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
const page = ref(1);
const itemsPerPage = ref(10);
const filterDate = ref("");

// Modal state
const showAddModal = ref(false);
const showDetailsModal = ref(false);
const selectedPayment = ref<any>(null);
const assignedCompanies = ref<any[]>([]);
const isCheckingDate = ref(false);
const dateChecked = ref(false);
const isSubmitting = ref(false);
const submitError = ref("");

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
});

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
  if (!filterDate.value) return payments.value;
  return payments.value.filter((p) => p.date === filterDate.value);
});

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
    }
  } catch (e) {
    console.error("Error fetching payments:", e);
  } finally {
    isLoading.value = false;
  }
};

const openAddModal = async () => {
  form.value = {
    date: todayStr(),
    company_id: "",
    amount: 0,
    total_deliveries: 0,
  };
  assignedCompanies.value = [];
  dateChecked.value = false;
  submitError.value = "";
  showAddModal.value = true;
  await onDateChange();
};

const onDateChange = async () => {
  form.value.company_id = "";
  assignedCompanies.value = [];
  dateChecked.value = false;

  if (!form.value.date) return;

  isCheckingDate.value = true;
  try {
    const res = await $fetch<{ success: boolean; data?: any[] }>(
      `/api/biker-assignments/my-escala?dateFrom=${form.value.date}&dateTo=${form.value.date}`,
    );
    const all = (res?.data || []).filter((a: any) => a.status === "confirmado");
    assignedCompanies.value = all;
    if (all.length === 1) {
      form.value.company_id = all[0].company_id;
    }
  } catch (e) {
    console.error("Error checking date:", e);
    assignedCompanies.value = [];
  } finally {
    isCheckingDate.value = false;
    dateChecked.value = true;
  }
};

const submitPayment = async () => {
  isSubmitting.value = true;
  submitError.value = "";
  try {
    const res = await $fetch<{ success: boolean; data?: { wallet: number } }>(
      "/api/biker-payments",
      {
        method: "POST",
        body: {
          date: form.value.date,
          company_id: form.value.company_id,
          amount: form.value.amount,
          total_deliveries: form.value.total_deliveries,
        },
      },
    );

    if (res.success) {
      if (auth.user) {
        auth.user.wallet = res.data?.wallet ?? (auth.user.wallet || 0);
      }
      toast.add({
        color: "success",
        title: "Registro adicionado com sucesso!",
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
