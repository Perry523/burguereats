<template>
  <div class="space-y-6 pt-6">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Financeiro Entregadores</h1>
        <p class="text-sm text-gray-500 mt-1">Gerencie os pagamentos, adiantamentos e saldos dos entregadores</p>
      </div>
    </div>

    <div v-if="isLoading" class="py-12 text-center text-gray-500">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin mx-auto mb-2" />
      <p>Carregando dados financeiros...</p>
    </div>

    <div v-else class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <!-- Search -->
      <div class="p-4 border-b border-gray-200 bg-gray-50">
        <div class="relative max-w-sm">
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
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left">
          <thead class="bg-white border-b border-gray-200 text-gray-500 font-medium">
            <tr>
              <th class="px-6 py-3">Entregador</th>
              <th class="px-6 py-3 text-right">Carteira (Total)</th>
              <th class="px-6 py-3 text-right">Entregas (Taxa R$ 1,00)</th>
              <th class="px-6 py-3 text-right">Adiantamentos</th>
              <th class="px-6 py-3 text-right">Valor a Pagar</th>
              <th class="px-6 py-3 text-center">Ações</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-if="filteredBikers.length === 0">
              <td colspan="6" class="px-6 py-8 text-center text-gray-400">
                Nenhum entregador encontrado.
              </td>
            </tr>
            <tr v-for="biker in filteredBikers" :key="biker.id" class="hover:bg-gray-50">
              <td class="px-6 py-4">
                <p class="font-medium text-gray-900">{{ biker.name }}</p>
                <p class="text-xs text-gray-500">{{ biker.phone || biker.email }}</p>
              </td>
              <td class="px-6 py-4 text-right font-medium text-gray-900">
                {{ formatCurrency(biker.wallet) }}
              </td>
              <td class="px-6 py-4 text-right">
                <p class="text-gray-900">{{ biker.total_deliveries }} entregas</p>
                <p class="text-xs text-red-500 font-medium">- {{ formatCurrency(biker.delivery_fee) }}</p>
              </td>
              <td class="px-6 py-4 text-right">
                <span class="text-red-500 font-medium whitespace-nowrap">- {{ formatCurrency(biker.advance_money) }}</span>
              </td>
              <td class="px-6 py-4 text-right">
                <span
                  class="inline-flex items-center rounded-lg px-2.5 py-1 text-sm font-bold shadow-sm"
                  :class="biker.net_to_pay >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
                >
                  {{ formatCurrency(biker.net_to_pay) }}
                </span>
              </td>
              <td class="px-6 py-4 text-center flex items-center justify-center gap-2">
                <button
                  @click="openAdvanceModal(biker)"
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors"
                >
                  <UIcon name="i-ph-coins-duotone" class="w-4 h-4" />
                  Adiantamento
                </button>
                <button
                  @click="openPagarModal(biker)"
                  :disabled="isLiquidating"
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors disabled:opacity-50"
                  title="Registrar pagamento definitivo e zerar saldo"
                >
                  <UIcon name="i-ph-check-circle-duotone" class="w-4 h-4" />
                  Pagar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

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

// Modal
const showAdvanceModal = ref(false);
const showPagarModal = ref(false);
const selectedBiker = ref<any>(null);
const advanceForm = ref({ amount: 0 });
const isSubmitting = ref(false);
const advanceError = ref("");

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
