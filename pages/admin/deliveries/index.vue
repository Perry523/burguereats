<template>
  <div class="h-[calc(100vh-128px)] flex flex-col gap-4 pt-0 md:pt-6">
    <TableBase
      class="flex-1 min-h-0 bg-white rounded-lg pt-2 md:pt-5 pb-0 px-0 shadow-sm border border-gray-200"
      :loading="isLoading"
      :rows="filteredDeliveries"
      :total-items="filteredDeliveries.length"
      :columns="columns"
      :actions="[]"
      hide-edit
      hide-delete
    >
      <template #filter>
        <div
          class="w-full px-3 sm:px-5 pb-1 md:pb-4 flex items-center justify-between gap-2"
        >
          <h1 class="text-2xl font-bold text-gray-800 hidden lg:block mr-2">
            Minhas Entregas
          </h1>

          <!-- Search Bar (Always straight on the left, takes available space) -->
          <div class="relative flex-1 max-w-sm">
            <div
              class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
            >
              <UIcon
                name="i-heroicons-magnifying-glass"
                class="h-4 w-4 sm:h-5 sm:w-5 text-gray-400"
              />
            </div>
            <input
              id="search-deliveries"
              v-model="search"
              type="text"
              class="block w-full rounded-lg border border-gray-300 bg-white p-2 sm:p-2.5 pl-9 sm:pl-10 text-xs sm:text-sm focus:border-primary focus:ring-primary shadow-sm"
              placeholder="Buscar..."
            />
          </div>

          <!-- Action Buttons (Right side) -->
          <div class="flex items-center gap-2 shrink-0">
            <!-- Mobile Filters Toggle Button -->
            <button
              @click="showMobileFilters = true"
              class="sm:hidden flex items-center justify-center rounded-lg border border-gray-300 bg-white p-2 text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary"
              title="Filtros"
            >
              <UIcon name="i-heroicons-funnel" class="h-4 w-4 sm:h-5 sm:w-5" />
            </button>

            <button
              @click="fetchDeliveries"
              class="flex items-center justify-center p-2 sm:p-2.5 text-gray-500 hover:text-primary transition-colors bg-white rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
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

            <!-- New Record / Add Button -->
            <NuxtLink to="/admin/deliveries/create">
              <button
                class="flex items-center justify-center gap-1.5 rounded-lg bg-primary px-2.5 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-medium text-white transition-colors hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 shadow-sm whitespace-nowrap"
                title="Novo Pedido"
              >
                <UIcon name="i-heroicons-plus" class="h-4 w-4 sm:h-5 sm:w-5" />
                <span class="hidden sm:inline">Adicionar</span>
              </button>
            </NuxtLink>
          </div>
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

      <template #customer="{ row }">
        <div class="max-w-xs">
          <div class="flex items-center gap-2">
            <p class="text-sm font-semibold text-gray-900">
              {{ row.customer_name }}
            </p>
            <!-- On mobile, show an inline status pill aside the name -->
            <span
              :class="[
                'sm:hidden inline-flex items-center rounded-sm px-1.5 py-0.5 text-[10px] font-medium uppercase shrink-0',
                statusStyles[row.status] || 'bg-gray-100 text-gray-800',
              ]"
            >
              {{ statusLabels[row.status] || row.status }}
            </span>
          </div>
          <p
            class="text-xs text-gray-500 mt-0.5 line-clamp-1 truncate"
            :title="row.customer_address"
          >
            {{
              row.customer_address === "Retirada no local"
                ? "🏪 Retirada"
                : row.customer_address
            }}
          </p>
        </div>
      </template>

      <template #additional-actions="{ item: row }">
        <li>
          <a
            @click.prevent="openOrderModal(row.id)"
            class="flex items-center gap-3 text-base py-2.5 px-4 font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-150 cursor-pointer w-full text-left"
          >
            <UIcon name="i-heroicons-eye" class="w-5 h-5 text-gray-500" />
            Ver pedido
          </a>
        </li>
        <li>
          <a
            @click.prevent="openMap(row.customer_address)"
            class="flex items-center gap-3 text-base py-2.5 px-4 font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-150 cursor-pointer w-full text-left"
          >
            <UIcon name="i-heroicons-map-pin" class="w-5 h-5 text-gray-500" />
            Ver no mapa
          </a>
        </li>
        <li v-if="['pending', 'preparing', 'delivering'].includes(row.status)">
          <a
            @click.prevent="updateStatusDirectly(row, 'completed')"
            class="flex items-center gap-3 text-base py-2.5 px-4 font-medium text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors duration-150 cursor-pointer w-full text-left"
          >
            <UIcon
              name="i-heroicons-check-circle"
              class="w-5 h-5 text-green-500"
            />
            Finalizar
          </a>
        </li>
      </template>
    </TableBase>

    <!-- Order Details Modal -->
    <BaseDialog
      v-model="showOrderModal"
      title="Detalhes do Pedido"
      :large="true"
    >
      <div v-if="isLoadingOrder" class="py-12 text-center text-gray-500">
        <UIcon
          name="i-heroicons-arrow-path"
          class="w-8 h-8 animate-spin mx-auto mb-2"
        />
        <p>Carregando pedido...</p>
      </div>
      <div v-else-if="selectedOrder" class="p-4 sm:p-6 space-y-6">
        <!-- Status -->
        <div
          class="flex items-center justify-between bg-gray-50 p-4 rounded-lg"
        >
          <div>
            <span class="text-sm text-gray-500 block">ID do Pedido</span>
            <span class="font-mono text-gray-900 font-medium"
              >#{{ selectedOrder.id.substring(0, 8) }}</span
            >
          </div>
          <div class="text-right">
            <span class="text-sm text-gray-500 block">Status</span>
            <span
              :class="[
                'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold',
                statusStyles[selectedOrder.status] ||
                  'bg-gray-100 text-gray-800',
              ]"
            >
              {{ statusLabels[selectedOrder.status] || selectedOrder.status }}
            </span>
          </div>
        </div>

        <!-- Customer & Address -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="border border-gray-200 rounded-lg p-4">
            <h3 class="text-sm font-semibold text-gray-800 mb-2">Cliente</h3>
            <p class="font-medium text-gray-900">
              {{ selectedOrder.customer_name }}
            </p>
            <p class="text-sm text-gray-500">
              {{ selectedOrder.customer_phone || "Sem telefone" }}
            </p>
          </div>
          <div class="border border-gray-200 rounded-lg p-4">
            <h3 class="text-sm font-semibold text-gray-800 mb-2">
              Endereço de Entrega
            </h3>
            <p class="text-sm text-gray-700 whitespace-pre-line">
              {{ selectedOrder.customer_address || "Não informado" }}
            </p>
          </div>
        </div>

        <!-- Items -->
        <div>
          <h3 class="text-lg font-semibold text-gray-800 mb-3">
            Itens do Pedido
          </h3>
          <div class="border border-gray-200 rounded-lg overflow-hidden">
            <div class="divide-y divide-gray-200">
              <div
                v-for="item in selectedOrder.items"
                :key="item.id"
                class="p-4 flex justify-between items-center bg-white"
              >
                <div>
                  <p class="font-medium text-gray-900">
                    {{ item.dish_name || item.product_name }}
                  </p>
                  <p class="text-sm text-gray-500">
                    {{ item.quantity }}x
                    {{ currencyFormatter.format(item.unit_price) }}
                  </p>
                </div>
                <div class="font-semibold text-gray-900">
                  {{ currencyFormatter.format(item.total_price) }}
                </div>
              </div>
            </div>
            <div
              class="bg-gray-50 p-4 border-t border-gray-200 flex justify-between items-center"
            >
              <span class="font-semibold text-gray-700">Total do Pedido</span>
              <span class="text-xl font-bold text-primary">{{
                currencyFormatter.format(selectedOrder.total)
              }}</span>
            </div>
          </div>
        </div>

        <!-- Notes -->
        <div
          v-if="selectedOrder.notes"
          class="border border-amber-200 bg-amber-50 rounded-lg p-4"
        >
          <h3 class="text-sm font-semibold text-amber-800 mb-1">Observações</h3>
          <p class="text-sm text-amber-900 whitespace-pre-line">
            {{ selectedOrder.notes }}
          </p>
        </div>
      </div>
    </BaseDialog>

    <!-- Mobile Filters Modal -->
    <BaseDialog v-model="showMobileFilters" title="Filtros">
      <div class="p-4 space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Status</label
          >
          <select
            v-model="selectedStatus"
            class="w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm focus:border-primary focus:ring-primary"
          >
            <option value="all">Todos os status</option>
            <option value="pending">Pendente</option>
            <option value="preparing">Preparando</option>
            <option value="delivering">Em entrega</option>
            <option value="completed">Concluído</option>
            <option value="cancelled">Cancelado</option>
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
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "admin",
});

const auth = useAuthStore();
const toast = useToast();
const isLoading = ref(false);
const deliveries = ref<any[]>([]);
const bikerProfile = ref<any>(null);

// Search & Filter states
const search = ref("");
const showMobileFilters = ref(false);
const selectedStatus = ref("all");

const filteredDeliveries = computed(() => {
  let filtered = deliveries.value;

  if (selectedStatus.value !== "all") {
    filtered = filtered.filter((d) => d.status === selectedStatus.value);
  }

  if (search.value) {
    const term = search.value.toLowerCase();
    filtered = filtered.filter(
      (d) =>
        (d.customer_name && d.customer_name.toLowerCase().includes(term)) ||
        (d.customer_address &&
          d.customer_address.toLowerCase().includes(term)) ||
        (d.id && d.id.toLowerCase().includes(term)),
    );
  }

  return filtered;
});

// Modal state
const showOrderModal = ref(false);
const isLoadingOrder = ref(false);
const selectedOrder = ref<any>(null);

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const columns = [
  { key: "customer", label: "Cliente/Endereço", sm: true },
  { key: "status", label: "Status" },
  { key: "total", label: "Valor Pedido", type: "currency" },
  { key: "delivery_fee", label: "Valor Entrega", type: "currency" },
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

const fetchDeliveries = async () => {
  if (!bikerProfile.value?.id) return;
  isLoading.value = true;
  try {
    const response = await $fetch<{ success: boolean; data: any[] }>(
      `/api/bikers/deliveries?bikerId=${bikerProfile.value.id}`,
    );
    if (response.success) {
      deliveries.value = response.data;
    }
  } catch (error) {
    console.error("Error fetching deliveries:", error);
  } finally {
    isLoading.value = false;
  }
};

// Removed updateStatus since it must not be able to change status on this page.

const openMap = (address: string) => {
  if (!address) return;
  const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  window.open(url, "_blank");
};

const openOrderModal = async (orderId: string) => {
  showOrderModal.value = true;
  isLoadingOrder.value = true;
  selectedOrder.value = null;
  try {
    const response = await $fetch<{ success: boolean; data?: any }>(
      `/api/orders/${orderId}`,
    );
    if (response.success && response.data) {
      selectedOrder.value = response.data;
    } else {
      toast.add({
        color: "error",
        title: "Erro ao carregar os detalhes do pedido",
      });
      showOrderModal.value = false;
    }
  } catch (error) {
    console.error("Error fetching order details:", error);
    toast.add({ color: "error", title: "Falha ao buscar os detalhes" });
    showOrderModal.value = false;
  } finally {
    isLoadingOrder.value = false;
  }
};

const isUpdatingStatus = ref(false);

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
      toast.add({ color: "success", title: "Pedido finalizado com sucesso!" });
    }
  } catch (error) {
    console.error("Error updating order status directly:", error);
    toast.add({ color: "error", title: "Erro ao finalizar pedido" });
  } finally {
    isUpdatingStatus.value = false;
  }
};

onMounted(async () => {
  try {
    const profileResponse = await $fetch<{ success: boolean; data: any }>(
      `/api/bikers/me`,
    );
    if (profileResponse.success) {
      bikerProfile.value = profileResponse.data;
      await fetchDeliveries();
    }
  } catch (error) {
    console.error("Error loading biker profile:", error);
  }
});
</script>
