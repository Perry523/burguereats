<template>
  <div class="h-[calc(100vh-128px)] flex flex-col gap-4 pt-0 md:pt-6">
    <TableBase
      class="flex-1 min-h-0 bg-white rounded-lg pt-2 md:pt-5 pb-0 px-0 shadow-sm border border-gray-200"
      :loading="isLoading"
      :rows="filteredBikers"
      :total-items="filteredBikers.length"
      :columns="columns"
      v-model:page="page"
      v-model:per_page="itemsPerPage"
      hide-edit
      hide-delete
      hide-actions
    >
      <template #filter>
        <div class="w-full px-3 sm:px-5 pb-1 md:pb-4 flex items-center justify-between gap-2">
          <h1 class="text-xl font-bold text-gray-900 hidden lg:block mr-2">
            Financeiro Entregadores
          </h1>

          <div class="flex items-center gap-2 flex-1 lg:flex-initial lg:ml-auto">
            <div class="relative w-full max-w-sm">
              <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <UIcon name="i-heroicons-magnifying-glass" class="h-5 w-5 text-gray-400" />
              </div>
              <input
                v-model="search"
                type="text"
                class="block w-full rounded-lg border border-gray-300 bg-white p-2 pl-10 text-sm focus:border-primary focus:ring-primary shadow-sm"
                placeholder="Buscar entregador..."
              />
            </div>
            
            <button
              @click="loadData"
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

      <!-- Custom Column Slots -->
      <template #biker="{ row }">
        <div>
          <p class="font-medium text-gray-900">{{ row.name }}</p>
          <p class="text-xs text-gray-500">{{ row.phone || row.email }}</p>
        </div>
      </template>
      
      <template #wallet="{ row }">
        <span class="font-medium text-gray-900">{{ formatCurrency(row.wallet) }}</span>
      </template>
      
      <template #deliveries="{ row }">
        <div>
          <p class="text-gray-900">{{ row.total_deliveries }} entregas</p>
          <p class="text-xs text-red-500 font-medium">- {{ formatCurrency(row.delivery_fee) }}</p>
        </div>
      </template>
      
      <template #advances="{ row }">
        <span class="text-red-500 font-medium whitespace-nowrap">- {{ formatCurrency(row.advance_money) }}</span>
      </template>
      
      <template #net_to_pay="{ row }">
        <span
          class="inline-flex items-center rounded-lg px-2.5 py-1 text-sm font-bold shadow-sm"
          :class="row.net_to_pay >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
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
            <UIcon name="i-ph-coins-duotone" class="w-4 h-4" />
            Adiantamento
          </button>
          <button
            @click="openPagarModal(row)"
            :disabled="isLiquidating"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors disabled:opacity-50"
            title="Registrar pagamento definitivo e zerar saldo"
          >
            <UIcon name="i-ph-check-circle-duotone" class="w-4 h-4" />
            Pagar
          </button>
        </div>
      </template>
    </TableBase>
    <!-- Advance Money Modal -->
    <BaseDialog v-model="showAdvanceModal" :title="'Adiantamento - ' + (selectedBiker?.name || '')">
      <div class="p-4 space-y-4">
        <p class="text-sm text-gray-600">
          Lance o valor do adiantamento concedido ao entregador hoje. 
          Este valor será somado ao total adiantado e diminuirá do montante final a pagar na liquidação.
        </p>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Valor do Novo Adiantamento (R$)</label>
          <Currency
            v-model="advanceForm.amount"
            class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
            placeholder="R$ 0,00"
          />
        </div>

        <div v-if="advanceError" class="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
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
            {{ isSubmitting ? 'Lançando...' : 'Lançar Adiantamento' }}
          </button>
        </div>
      </div>
    </BaseDialog>

    <!-- Pagar (Liquidação) Confirmation Modal -->
    <BaseDialog v-model="showPagarModal" :title="'Confirmar Pagamento - ' + (selectedBiker?.name || '')">
      <div class="p-4 space-y-4">
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p class="text-sm text-blue-800 font-medium mb-2">Resumo da Liquidação:</p>
          <div class="space-y-1 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-600">Carteira (Bruto):</span>
              <span class="font-bold text-gray-900">{{ formatCurrency(selectedBiker?.wallet) }}</span>
            </div>
            <div class="flex justify-between text-red-600">
              <span>Adiantamentos (Desconto):</span>
              <span>- {{ formatCurrency(selectedBiker?.advance_money) }}</span>
            </div>
            <div class="flex justify-between text-red-600">
              <span>Taxas de Entrega (R$ 1,00/cada):</span>
              <span>- {{ formatCurrency(selectedBiker?.delivery_fee) }}</span>
            </div>
            <div class="border-t border-blue-200 mt-2 pt-2 flex justify-between text-base font-bold text-green-700">
              <span>Líquido a Pagar:</span>
              <span>{{ formatCurrency(selectedBiker?.net_to_pay) }}</span>
            </div>
          </div>
        </div>

        <p class="text-xs text-gray-500 italic">
          Ao confirmar, o sistema registrará um recibo de pagamento no histórico, 
          zerará a carteira e os adiantamentos deste entregador. Esta ação não pode ser desfeita.
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
            <UIcon v-if="isLiquidating" name="i-heroicons-arrow-path" class="w-4 h-4 animate-spin" />
            {{ isLiquidating ? 'Processando...' : 'Confirmar e Pagar' }}
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
const advanceForm = ref({ amount: 0 });
const isSubmitting = ref(false);
const advanceError = ref("");

const page = ref(1);
const itemsPerPage = ref(10);

const columns = [
  { key: "biker", label: "Entregador" },
  { key: "wallet", label: "Carteira (Total)" },
  { key: "deliveries", label: "Entregas (Tx R$ 1,00)" },
  { key: "advances", label: "Adiantamentos" },
  { key: "net_to_pay", label: "Valor a Pagar" },
  { key: "custom_actions", label: "Ações" }
];

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);
};

const filteredBikers = computed(() => {
  if (!search.value) return bikers.value;
  const term = search.value.toLowerCase();
  return bikers.value.filter(b => 
    b.name.toLowerCase().includes(term) || 
    (b.email && b.email.toLowerCase().includes(term))
  );
});

const loadData = async () => {
  isLoading.value = true;
  try {
    const res = await $fetch<{ success: boolean; data?: any[] }>('/api/biker-payments/financials');
    bikers.value = res?.data || [];
  } catch (error) {
    console.error('Error fetching financials:', error);
    toast.add({ color: 'error', title: 'Erro ao carregar dados' });
  } finally {
    isLoading.value = false;
  }
};

const openAdvanceModal = (biker: any) => {
  selectedBiker.value = biker;
  advanceForm.value.amount = 0; // Starts from 0 because we only input the new advance now
  advanceError.value = "";
  showAdvanceModal.value = true;
};

const saveAdvance = async () => {
  if (!selectedBiker.value) return;
  
  isSubmitting.value = true;
  advanceError.value = "";

  try {
    const res = await $fetch<{ success: boolean }>(`/api/biker-payments/${selectedBiker.value.id}`, {
      method: 'PUT',
      body: { advance_money: Number(advanceForm.value.amount) }
    });

    if (res.success) {
      toast.add({ color: 'success', title: 'Adiantamento lançado e salvo no recibo de pagamentos!' });
      showAdvanceModal.value = false;
      await loadData(); // Refresh the list
    }
  } catch (error: any) {
    advanceError.value = error?.data?.statusMessage || 'Erro ao lançar adiantamento';
  } finally {
    isSubmitting.value = false;
  }
};

const openPagarModal = (biker: any) => {
  if (biker.wallet <= 0 && biker.advance_money <= 0 && biker.total_deliveries <= 0) {
    toast.add({ color: 'error', title: 'Nada para pagar.' });
    return;
  }
  selectedBiker.value = biker;
  showPagarModal.value = true;
};

const confirmPayment = async () => {
  if (!selectedBiker.value) return;

  isLiquidating.value = true;
  try {
    const res = await $fetch<{ success: boolean }>('/api/biker-payouts', {
      method: 'POST',
      body: { biker_id: selectedBiker.value.id }
    });

    if (res.success) {
      toast.add({ color: 'success', title: 'Pagamento registrado e saldo zerado com sucesso!' });
      showPagarModal.value = false;
      await loadData();
    } else {
      throw new Error('Falha ao processar pagamento');
    }
  } catch (error: any) {
    console.error('Liquidate error:', error);
    const msg = error?.data?.statusMessage || error?.message || 'Erro ao liquidar saldo';
    toast.add({ color: 'error', title: msg });
  } finally {
    isLiquidating.value = false;
  }
};

onMounted(async () => {
  if (!auth.user) await auth.getCurrentUser();
  await loadData();
});
</script>
