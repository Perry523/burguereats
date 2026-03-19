<template>
  <div class="h-[calc(100vh-140px)] flex flex-col gap-4 pt-6">
    <TableBase
      class="flex-1 min-h-0 bg-white rounded-lg pt-5 pb-0 px-0 shadow-sm border border-gray-200"
      :loading="isLoading"
      :rows="paginatedOrders"
      :total-items="orders.length"
      :columns="columns"
      :actions="tableActions"
      v-model:page="page"
      v-model:per_page="itemsPerPage"
      hide-edit
      hide-delete
    >
      <template #filter>
        <div class="w-full px-5 pb-4 flex items-center justify-between gap-2">
          
          <!-- Search Bar (Always straight on the left, takes available space) -->
          <div class="relative flex-1 max-w-sm">
            <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <UIcon name="i-heroicons-magnifying-glass" class="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="search"
              v-model="search"
              type="text"
              class="block w-full rounded-lg border border-gray-300 bg-white p-2.5 pl-10 text-sm focus:border-primary focus:ring-primary shadow-sm"
              placeholder="Buscar cliente..."
            />
          </div>

          <!-- Desktop Hidden Filters (Only show on sm+) -->
          <div class="hidden sm:flex items-center gap-2">
            <select v-model="selectedClient" class="rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-700 shadow-sm focus:border-primary focus:ring-primary min-w-[150px]">
              <option value="all">Todos os clientes</option>
              <option v-for="client in clients" :key="client.id" :value="client.id">{{ client.name }}</option>
            </select>
            <select v-model="selectedProfessional" class="rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-700 shadow-sm focus:border-primary focus:ring-primary min-w-[150px]">
              <option value="all">Todos os entregadores</option>
              <option v-for="biker in bikers" :key="biker.id" :value="biker.id">{{ biker.name }}</option>
            </select>

            <select v-model="selectedDateRange" class="rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-700 shadow-sm focus:border-primary focus:ring-primary min-w-[150px]">
              <option v-for="opt in dateRangeOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
            </select>
            <select v-model="orderBy" class="rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-700 shadow-sm focus:border-primary focus:ring-primary min-w-[150px]">
              <option value="newest">Mais Recentes</option>
              <option value="oldest">Mais Antigos</option>
              <option value="total_desc">Maior Valor</option>
              <option value="total_asc">Menor Valor</option>
            </select>
          </div>

          <!-- Action Buttons (Right side) -->
          <div class="flex items-center gap-2 shrink-0">
            <!-- Mobile Filters Toggle Button -->
            <button
              @click="showMobileFilters = true"
              class="sm:hidden flex items-center justify-center rounded-lg border border-gray-300 bg-white p-2.5 text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary"
              title="Filtros"
            >
              <UIcon name="i-heroicons-funnel" class="h-5 w-5" />
            </button>
            
            <!-- New Record / Add Button -->
            <NuxtLink to="/admin/orders/create">
              <button
                class="flex items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2.5 sm:px-4 text-sm font-medium text-white transition-colors hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 shadow-sm whitespace-nowrap"
                title="Adicionar Pedido"
              >
                <UIcon name="i-heroicons-plus" class="h-5 w-5" />
                <span class="hidden sm:inline">Adicionar</span>
              </button>
            </NuxtLink>
          </div>
        </div>
      </template>

      <template #id="{ row }">
        <span class="text-sm font-mono text-gray-900">
          #{{ row.id.substring(0, 8) }}
        </span>
      </template>

      <template #customer="{ row }">
        <div>
          <p class="text-sm font-medium text-gray-900">
            {{ row.customer_name }}
          </p>
          <div class="flex items-center gap-2 mt-1 sm:hidden">
             <!-- On mobile, show an inline status pill next to the address-->
             <span
               :class="[
                 'inline-flex items-center rounded-sm px-1.5 py-0.5 text-[10px] font-medium uppercase',
                 statusStyles[row.status] || 'bg-gray-100 text-gray-800',
               ]"
             >
               {{ statusLabels[row.status] || row.status }}
             </span>
          </div>
          <p class="text-xs text-gray-500 mt-1 line-clamp-1 truncate" :title="row.customer_address">
            {{ row.customer_address === 'Retirada no local' ? '🏪 Retirada' : row.customer_address }}
          </p>
        </div>
      </template>

      <template #status="{ row }">
        <span
          :class="[
            'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium',
            statusStyles[row.status] || 'bg-gray-100 text-gray-800',
          ]"
        >
          {{ statusLabels[row.status] || row.status }}
        </span>
      </template>

      <template #created_at="{ row }">
        <span class="text-sm text-gray-500">
          {{ formatDate(row.created_at) }}
        </span>
      </template>

      <template #additional-actions="{ item: row }">
        <li v-if="['pending', 'preparing'].includes(row.status)">
          <a
            @click.prevent="openBikerModal(row)"
            class="flex items-center gap-3 text-base py-2.5 px-4 font-medium text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors duration-150 cursor-pointer w-full text-left"
          >
            <UIcon name="i-heroicons-truck" class="w-5 h-5 text-purple-500" />
            Entregar
          </a>
        </li>
        <li v-if="['pending', 'preparing', 'delivering'].includes(row.status)">
          <a
            @click.prevent="updateStatusDirectly(row, 'completed')"
            class="flex items-center gap-3 text-base py-2.5 px-4 font-medium text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors duration-150 cursor-pointer w-full text-left"
          >
            <UIcon name="i-heroicons-check-circle" class="w-5 h-5 text-green-500" />
            Finalizar
          </a>
        </li>
      </template>
    </TableBase>

    <!-- Mobile Filters Modal -->
    <BaseDialog v-model="showMobileFilters" title="Filtros">
      <div class="p-4 space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
          <select
            v-model="selectedClient"
            class="w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm focus:border-primary focus:ring-primary"
          >
            <option value="all">Todos os clientes</option>
            <option v-for="client in clients" :key="client.id" :value="client.id">
              {{ client.name }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Entregador</label>
          <select
            v-model="selectedProfessional"
            class="w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm focus:border-primary focus:ring-primary"
          >
            <option value="all">Todos os entregadores</option>
            <option v-for="biker in bikers" :key="biker.id" :value="biker.id">
              {{ biker.name }}
            </option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Período</label>
          <select
            v-model="selectedDateRange"
            class="w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm focus:border-primary focus:ring-primary"
          >
            <option v-for="opt in dateRangeOptions" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Ordenar por</label>
          <select
            v-model="orderBy"
            class="w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm focus:border-primary focus:ring-primary"
          >
            <option value="newest">Mais Recentes</option>
            <option value="oldest">Mais Antigos</option>
            <option value="total_desc">Maior Valor</option>
            <option value="total_asc">Menor Valor</option>
          </select>
        </div>

        <button
          @click="showMobileFilters = false"
          class="w-full mt-4 rounded-lg bg-primary py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          Aplicar Filtros
        </button>
      </div>
    </BaseDialog>

    <!-- Biker Assignment Modal -->
    <BaseDialog v-model="showBikerModal" title="Vincular Entregador e Entregar">
      <div class="p-4 space-y-4">
        <p class="text-sm text-gray-600">
          Selecione o entregador responsável por este pedido. Ao confirmar, o status será alterado para <span class="inline-flex items-center rounded-sm px-1.5 py-0.5 text-[10px] font-medium uppercase bg-purple-100 text-purple-800">Em entrega</span>.
        </p>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Entregador</label>
          <select
            v-model="selectedBikerToAssign"
            class="w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm focus:border-primary focus:ring-primary"
          >
            <option value="" disabled>Selecione um entregador...</option>
            <option v-for="biker in bikers" :key="biker.id" :value="biker.id">
              {{ biker.name }}
            </option>
          </select>
        </div>

        <div class="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
          <button
            @click="showBikerModal = false"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            @click="assignBikerAndDeliver"
            :disabled="!selectedBikerToAssign || isUpdatingStatus"
            class="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-focus disabled:opacity-50"
          >
            {{ isUpdatingStatus ? 'Processando...' : 'Confirmar e Entregar' }}
          </button>
        </div>
      </div>
    </BaseDialog>

    <!-- Order Details Modal -->
    <BaseDialog v-model="showOrderModal" title="Detalhes do Pedido" :extraLarge="true">
      <div v-if="isLoadingOrder" class="py-12 text-center text-gray-500">
        <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin mx-auto mb-2" />
        <p>Carregando pedido...</p>
      </div>
      <div v-else-if="selectedOrder" class="p-4 sm:p-6 grid gap-6 md:grid-cols-3">
        <!-- Main details -->
        <div class="md:col-span-2 space-y-6">
          <!-- Items -->
          <div class="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
            <h3 class="text-lg font-semibold text-gray-800 mb-3">Itens do Pedido</h3>
            <div class="divide-y divide-gray-200">
              <div v-for="item in selectedOrder.items" :key="item.id" class="py-3 flex justify-between items-center">
                <div>
                  <p class="font-medium text-gray-900">{{ item.dish_name || item.product_name }}</p>
                  <p class="text-sm text-gray-500">{{ item.quantity }}x {{ currencyFormatter.format(item.unit_price) }}</p>
                </div>
                <div class="font-semibold text-gray-900">
                  {{ currencyFormatter.format(item.total_price) }}
                </div>
              </div>
            </div>
            <div class="mt-4 pt-4 border-t flex justify-between items-center">
              <span class="text-lg font-semibold">Total:</span>
              <span class="text-2xl font-bold text-primary">
                {{ currencyFormatter.format(selectedOrder.total) }}
              </span>
            </div>
          </div>

          <!-- Notes -->
          <div v-if="selectedOrder.notes" class="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
            <h2 class="text-lg font-semibold mb-2">Observações</h2>
            <p class="text-gray-700 whitespace-pre-line">{{ selectedOrder.notes }}</p>
          </div>
        </div>

        <!-- Sidebar Details -->
        <div class="space-y-6">
          <!-- Status Form -->
          <div class="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
            <h2 class="text-lg font-semibold mb-4">Status do Pedido</h2>
            <div class="flex items-center gap-2">
              <span
                :class="[
                  'inline-flex items-center rounded-full px-3 py-1 font-semibold text-sm',
                  statusStyles[selectedOrder.status] || 'bg-gray-100 text-gray-800',
                ]"
              >
                {{ statusLabels[selectedOrder.status] || selectedOrder.status }}
              </span>
            </div>
          </div>

          <!-- Customer Info -->
          <div class="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
            <h2 class="text-lg font-semibold mb-4">Cliente</h2>
            <div class="space-y-3">
              <div>
                <p class="text-sm text-gray-500">Nome</p>
                <p class="font-medium">{{ selectedOrder.customer_name }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Telefone</p>
                <p class="font-medium">{{ selectedOrder.customer_phone }}</p>
              </div>
              <div v-if="selectedOrder.customer_address && selectedOrder.customer_address !== 'Retirada no local'">
                <p class="text-sm text-gray-500">Endereço</p>
                <p class="font-medium whitespace-pre-line">{{ selectedOrder.customer_address }}</p>
              </div>
              <div v-else>
                <p class="text-sm text-gray-500">Tipo de Entrega</p>
                <p class="font-medium pl-1">🏪 Retirada no Local</p>
              </div>
            </div>
          </div>
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

interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_address?: string;
  total: number;
  status: string;
  notes?: string;
  created_at: string;
}

const auth = useAuthStore();
const { user } = storeToRefs(auth);
const { getCurrentUser } = auth;

const orders = ref<Order[]>([]);
const isLoading = ref(false);

const page = ref(1);
const itemsPerPage = ref(10);

const search = ref("");
const selectedClient = ref("all");
const selectedProfessional = ref("all");
const selectedStatus = ref("all");
const selectedDateRange = ref("all");
const orderBy = ref("newest");

const clients = ref<any[]>([]);
const bikers = ref<any[]>([]);
const showMobileFilters = ref(false);
const showOrderModal = ref(false);
const showBikerModal = ref(false);
const selectedBikerToAssign = ref("");
const selectedOrderIdForBiker = ref<string | null>(null);

const isLoadingOrder = ref(false);
const isUpdatingStatus = ref(false);
const selectedOrder = ref<any>(null);
const toast = useToast();

const companyId = computed(() => user.value?.company?.id ?? "");

const filteredOrders = computed(() => {
  let filtered = [...orders.value];

  // Apply Search
  if (search.value) {
    const term = search.value.toLowerCase();
    filtered = filtered.filter(o => 
      o.customer_name.toLowerCase().includes(term) || 
      o.id.toLowerCase().includes(term)
    );
  }

  // Note: Status filtering is actively handled by the backend API query when selectedStatus changes.
  // However, we still have local sorting and searching here.

  // Apply Sort
  filtered.sort((a, b) => {
    switch (orderBy.value) {
      case "total_asc":
        return a.total - b.total;
      case "total_desc":
        return b.total - a.total;
      case "oldest":
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      case "newest":
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      default:
        return 0;
    }
  });

  return filtered;
});

const paginatedOrders = computed(() => {
  const start = (page.value - 1) * itemsPerPage.value;
  return filteredOrders.value.slice(start, start + itemsPerPage.value);
});

watch([search, orderBy, selectedClient, selectedProfessional, selectedDateRange], () => {
  page.value = 1;
});

const dateRangeOptions = [
  { label: 'Todos os períodos', value: 'all' },
  { label: 'Hoje', value: 'today' },
  { label: 'Ontem', value: 'yesterday' },
  { label: 'Última semana', value: 'last_week' },
  { label: 'Último mês', value: 'last_month' },
];

const getDateRange = (range: string): { dateFrom?: string; dateTo?: string } => {
  if (range === 'all') return {};
  const now = new Date();
  const startOfDay = (d: Date) => {
    const copy = new Date(d);
    copy.setHours(0, 0, 0, 0);
    return copy;
  };
  const endOfDay = (d: Date) => {
    const copy = new Date(d);
    copy.setHours(23, 59, 59, 999);
    return copy;
  };

  switch (range) {
    case 'today':
      return { dateFrom: startOfDay(now).toISOString(), dateTo: endOfDay(now).toISOString() };
    case 'yesterday': {
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      return { dateFrom: startOfDay(yesterday).toISOString(), dateTo: endOfDay(yesterday).toISOString() };
    }
    case 'last_week': {
      const weekAgo = new Date(now);
      weekAgo.setDate(weekAgo.getDate() - 7);
      return { dateFrom: startOfDay(weekAgo).toISOString(), dateTo: endOfDay(now).toISOString() };
    }
    case 'last_month': {
      const monthAgo = new Date(now);
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return { dateFrom: startOfDay(monthAgo).toISOString(), dateTo: endOfDay(now).toISOString() };
    }
    default:
      return {};
  }
};

const columns = [
  { key: "id", label: "Pedido" },
  { key: "customer", label: "Cliente", sm: true },
  { key: "total", label: "Total", type: "currency" },
  { key: "status", label: "Status" },
  { key: "created_at", label: "Data" },
];

const tableActions = [
  {
    name: 'Ver Detalhes',
    action: (row: any) => openOrderModal(row.id)
  }
];

const statusOptions = [
  { label: "Todos", value: "all" },
  { label: "Pendentes", value: "pending" },
  { label: "Preparando", value: "preparing" },
  { label: "Concluídos", value: "completed" },
  { label: "Cancelados", value: "cancelled" },
];

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

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const fetchOrders = async (companyId: string, status?: string, clientId?: string, bikerId?: string, dateRange?: string) => {
  isLoading.value = true;
  try {
    let url = `/api/orders?companyId=${companyId}`;
    if (status && status !== "all") {
      url += `&status=${status}`;
    }
    if (clientId && clientId !== "all") {
      url += `&clientId=${clientId}`;
    }
    if (bikerId && bikerId !== "all") {
      url += `&bikerId=${bikerId}`;
    }
    const { dateFrom, dateTo } = getDateRange(dateRange || 'all');
    if (dateFrom) url += `&dateFrom=${encodeURIComponent(dateFrom)}`;
    if (dateTo) url += `&dateTo=${encodeURIComponent(dateTo)}`;

    const response = await $fetch<{ success: boolean; data?: Order[] }>(url);
    orders.value = Array.isArray(response?.data) ? response.data : [];
  } catch (error) {
    console.error("Error fetching orders:", error);
    orders.value = [];
  } finally {
    isLoading.value = false;
  }
};

const loadClients = async (companyId: string) => {
  try {
    const response = await $fetch<{ success: boolean; data: any[] }>(`/api/clients?companyId=${companyId}`);
    if (response.success) {
      clients.value = response.data;
    }
  } catch (err) {
    console.error("Error fetching clients:", err);
  }
};

const loadBikers = async (companyId: string) => {
  try {
    const response = await $fetch<{ success: boolean; data: any[] }>(`/api/bikers?companyId=${companyId}`);
    if (response.success) {
      bikers.value = response.data;
    }
  } catch (err) {
    console.error("Error fetching bikers:", err);
  }
};

const openOrderModal = async (orderId: string) => {
  showOrderModal.value = true;
  isLoadingOrder.value = true;
  selectedOrder.value = null;
  try {
    const response = await $fetch<{ success: boolean; data?: any }>(`/api/orders/${orderId}`);
    if (response.success && response.data) {
      selectedOrder.value = response.data;
    }
  } catch (error) {
    console.error("Error fetching order details:", error);
  } finally {
    isLoadingOrder.value = false;
  }
};

const openBikerModal = (row: any) => {
  selectedOrderIdForBiker.value = row.id;
  selectedBikerToAssign.value = "";
  showBikerModal.value = true;
};

const assignBikerAndDeliver = async () => {
  if (!selectedOrderIdForBiker.value || !selectedBikerToAssign.value || isUpdatingStatus.value) return;

  isUpdatingStatus.value = true;
  try {
    const response = await $fetch(`/api/orders/${selectedOrderIdForBiker.value}`, {
      method: "PUT" as any,
      body: { status: 'delivering', biker_id: selectedBikerToAssign.value },
    });

    if (response.success) {
      const index = orders.value.findIndex(o => o.id === selectedOrderIdForBiker.value);
      if (index !== -1) {
        orders.value[index].status = 'delivering';
      }
      toast.add({ color: 'success', title: 'Entregador selecionado e pedido em entrega!' });
      showBikerModal.value = false;
    }
  } catch (error) {
    console.error("Error linking biker:", error);
    toast.add({ color: 'error', title: 'Erro ao registrar entrega' });
  } finally {
    isUpdatingStatus.value = false;
  }
};

const updateStatusDirectly = async (row: any, newStatus: string) => {
  if (isUpdatingStatus.value || row.status === newStatus) return;

  isUpdatingStatus.value = true;
  try {
    const response = await $fetch(`/api/orders/${row.id}`, {
      method: "PUT" as any,
      body: { status: newStatus },
    });

    if (response.success) {
      row.status = newStatus;
      toast.add({ color: 'success', title: 'Pedido finalizado com sucesso!' });
    }
  } catch (error) {
    console.error("Error updating order status directly:", error);
    toast.add({ color: 'error', title: 'Erro ao finalizar pedido' });
  } finally {
    isUpdatingStatus.value = false;
  }
};

const updateStatus = async (newStatus: string) => {
  if (!selectedOrder.value || isUpdatingStatus.value || selectedOrder.value.status === newStatus) return;

  isUpdatingStatus.value = true;
  try {
    const response = await $fetch(`/api/orders/${selectedOrder.value.id}`, {
      method: "PUT" as any,
      body: { status: newStatus },
    });

    if (response.success) {
      selectedOrder.value.status = newStatus;
      // Also update the order in the list so we don't need a full refetch
      const index = orders.value.findIndex(o => o.id === selectedOrder.value.id);
      if (index !== -1) {
        orders.value[index].status = newStatus;
      }
    }
  } catch (error) {
    console.error("Error updating order status:", error);
    alert("Erro ao atualizar status do pedido");
  } finally {
    isUpdatingStatus.value = false;
  }
};

watch([selectedStatus, selectedClient, selectedProfessional, selectedDateRange], async ([newStatus, newClient, newProfessional, newDateRange]) => {
  if (companyId.value) {
    await fetchOrders(companyId.value, newStatus, newClient, newProfessional, newDateRange);
  }
});

watch(
  companyId,
  async (id) => {
    if (id) {
      await Promise.all([
        loadClients(id),
        loadBikers(id),
        fetchOrders(id, selectedStatus.value, selectedClient.value, selectedProfessional.value, selectedDateRange.value)
      ]);
    }
  },
  { immediate: false }
);

onMounted(async () => {
  let id = companyId.value;
  if (!id) {
    await getCurrentUser();
    id = user.value?.company?.id ?? "";
  }
  if (id) {
    await Promise.all([
      loadClients(id),
      loadBikers(id),
      fetchOrders(id, selectedStatus.value, selectedClient.value, selectedProfessional.value, selectedDateRange.value)
    ]);
  }
});
</script>
