<template>
  <div class="space-y-6">
    <div class="flex items-center gap-4">
      <NuxtLink to="/admin/orders" class="text-gray-600 hover:text-gray-900">
        <UIcon name="i-heroicons-arrow-left" class="h-6 w-6" />
      </NuxtLink>
      <h1 class="text-3xl font-bold text-gray-800">
        Detalhes do Pedido #{{ orderId?.substring(0, 8) }}
      </h1>
    </div>

    <div v-if="isLoading" class="text-center py-12">
      <p class="text-gray-500">Carregando pedido...</p>
    </div>

    <div v-else-if="!order" class="text-center py-12">
      <p class="text-gray-500">Pedido não encontrado</p>
    </div>

    <div v-else class="grid gap-6 lg:grid-cols-3">
      <!-- Order Info -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Items -->
        <div class="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h2 class="text-xl font-semibold mb-4">Itens do Pedido</h2>
          <div class="space-y-4">
            <div
              v-for="item in order.items"
              :key="item.id"
              class="flex items-center justify-between border-b pb-4 last:border-b-0"
            >
              <div class="flex-1">
                <h3 class="font-medium">{{ item.dish_name }}</h3>
                <p class="text-sm text-gray-500">
                  Quantidade: {{ item.quantity }} ×
                  {{ currencyFormatter.format(item.unit_price) }}
                </p>
              </div>
              <p class="font-semibold">
                {{ currencyFormatter.format(item.total_price) }}
              </p>
            </div>
          </div>
          <div class="mt-4 pt-4 border-t flex justify-between items-center">
            <span class="text-lg font-semibold">Total:</span>
            <span class="text-2xl font-bold text-primary">
              {{ currencyFormatter.format(order.total) }}
            </span>
          </div>
        </div>

        <!-- Notes -->
        <div
          v-if="order.notes"
          class="bg-white rounded-lg border border-gray-200 shadow-sm p-6"
        >
          <h2 class="text-xl font-semibold mb-2">Observações</h2>
          <p class="text-gray-700">{{ order.notes }}</p>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Customer Info -->
        <div class="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h2 class="text-xl font-semibold mb-4">Informações do Cliente</h2>
          <div class="space-y-3">
            <div>
              <p class="text-sm text-gray-500">Nome</p>
              <p class="font-medium">{{ order.customer_name }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Telefone</p>
              <p class="font-medium">{{ order.customer_phone }}</p>
            </div>
            <div
              v-if="
                order.customer_address &&
                order.customer_address !== 'Retirada no local'
              "
            >
              <p class="text-sm text-gray-500">Endereço</p>
              <p class="font-medium">{{ order.customer_address }}</p>
            </div>
            <div v-else>
              <p class="text-sm text-gray-500">Tipo de Entrega</p>
              <p class="font-medium">🏪 Retirada no Local</p>
            </div>
          </div>
        </div>

        <!-- Status -->
        <div class="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h2 class="text-xl font-semibold mb-4">Status do Pedido</h2>
          <div class="space-y-3">
            <button
              v-for="status in statusOptions"
              :key="status.value"
              @click="updateStatus(status.value)"
              :disabled="isUpdating"
              :class="[
                'w-full px-4 py-3 rounded-lg border-2 font-medium transition text-left',
                order.status === status.value
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-gray-300 text-gray-700 hover:border-gray-400',
                isUpdating ? 'opacity-50 cursor-not-allowed' : '',
              ]"
            >
              {{ status.label }}
            </button>
          </div>
        </div>

        <!-- Order Details -->
        <!-- <div class="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h2 class="text-xl font-semibold mb-4">Detalhes</h2>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-500">Criado em:</span>
              <span class="font-medium">{{
                formatDate(order.created_at)
              }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Atualizado em:</span>
              <span class="font-medium">{{
                formatDate(order.updated_at)
              }}</span>
            </div>
          </div>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "admin",
});

const route = useRoute();
const orderId = computed(() => route.params.id as string);

interface OrderItem {
  id: string;
  dish_id?: string;
  dish_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  customizations?: Record<string, unknown> | null;
}

interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_address?: string;
  total: number;
  status: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
}

const order = ref<Order | null>(null);
const isLoading = ref(false);
const isUpdating = ref(false);

const statusOptions = [
  { label: "Pendente", value: "pending" },
  { label: "Preparando", value: "preparing" },
  { label: "Concluído", value: "completed" },
  { label: "Cancelado", value: "cancelled" },
];

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const fetchOrder = async (id: string) => {
  isLoading.value = true;
  try {
    const response = await $fetch<{ success: boolean; data?: Order }>(
      `/api/orders/${id}`
    );
    if (response.success && response.data) {
      order.value = response.data;
    }
  } catch (error) {
    console.error("Error fetching order:", error);
  } finally {
    isLoading.value = false;
  }
};

const updateStatus = async (newStatus: string) => {
  if (!order.value || isUpdating.value || order.value.status === newStatus) {
    return;
  }

  isUpdating.value = true;
  try {
    const response = await $fetch(`/api/orders/${orderId.value}`, {
      method: "PUT" as const,
      body: { status: newStatus },
    });

    if (response.success) {
      order.value.status = newStatus;
      order.value.updated_at = new Date().toISOString();
    }
  } catch (error) {
    console.error("Error updating order status:", error);
    alert("Erro ao atualizar status do pedido");
  } finally {
    isUpdating.value = false;
  }
};

onMounted(async () => {
  if (orderId.value) {
    await fetchOrder(orderId.value);
  }
});
</script>
