<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-3xl font-bold text-gray-800">Pedidos</h1>
    </div>

    <!-- Filters -->
    <div class="flex gap-2">
      <button
        v-for="statusOption in statusOptions"
        :key="statusOption.value"
        @click="selectedStatus = statusOption.value"
        :class="[
          'px-4 py-2 rounded-lg font-medium transition',
          selectedStatus === statusOption.value
            ? 'bg-primary text-white'
            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50',
        ]"
      >
        {{ statusOption.label }}
      </button>
    </div>

    <!-- Orders Table -->
    <div class="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div v-if="isLoading" class="p-12 text-center">
        <p class="text-gray-500">Carregando pedidos...</p>
      </div>

      <div v-else-if="orders.length === 0" class="p-12 text-center">
        <p class="text-gray-500">Nenhum pedido encontrado</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
              >
                Pedido
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
              >
                Cliente
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
              >
                Total
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
              >
                Status
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
              >
                Data
              </th>
              <th
                class="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500"
              >
                Ações
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr
              v-for="order in orders"
              :key="order.id"
              class="hover:bg-gray-50"
            >
              <td class="px-6 py-4">
                <span class="text-sm font-mono text-gray-900">
                  #{{ order.id.substring(0, 8) }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div>
                  <p class="text-sm font-medium text-gray-900">
                    {{ order.customer_name }}
                  </p>
                  <p class="text-xs text-gray-500">
                    {{ order.customer_phone }}
                  </p>
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-gray-900">
                {{ currencyFormatter.format(order.total) }}
              </td>
              <td class="px-6 py-4">
                <span
                  :class="[
                    'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium',
                    statusStyles[order.status] || 'bg-gray-100 text-gray-800',
                  ]"
                >
                  {{ statusLabels[order.status] || order.status }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">
                {{ formatDate(order.created_at) }}
              </td>
              <td class="px-6 py-4 text-right space-x-2">
                <NuxtLink
                  :to="`/admin/orders/${order.id}`"
                  class="text-primary hover:text-primary/80 text-sm font-medium"
                >
                  Ver Detalhes
                </NuxtLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
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
const selectedStatus = ref("all");

const companyId = computed(() => user.value?.company?.id ?? "");

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
  completed: "Concluído",
  cancelled: "Cancelado",
};

const statusStyles: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  preparing: "bg-blue-100 text-blue-800",
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

const fetchOrders = async (companyId: string, status?: string) => {
  isLoading.value = true;
  try {
    let url = `/api/orders?companyId=${companyId}`;
    if (status && status !== "all") {
      url += `&status=${status}`;
    }

    const response = await $fetch<{ success: boolean; data?: Order[] }>(url);
    orders.value = Array.isArray(response?.data) ? response.data : [];
  } catch (error) {
    console.error("Error fetching orders:", error);
    orders.value = [];
  } finally {
    isLoading.value = false;
  }
};

watch(selectedStatus, async (newStatus) => {
  if (companyId.value) {
    await fetchOrders(companyId.value, newStatus);
  }
});

watch(
  companyId,
  async (id) => {
    if (id) {
      await fetchOrders(id, selectedStatus.value);
    }
  },
  { immediate: false }
);

onMounted(async () => {
  let id = companyId.value;
  if (!id) {
    const currentUser = await getCurrentUser();
    id = currentUser?.company?.id;
  }
  if (id) {
    await fetchOrders(id, selectedStatus.value);
  }
});
</script>
