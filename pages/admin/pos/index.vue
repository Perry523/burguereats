<template>
  <div class="max-w-2xl mx-auto space-y-8">
    <div class="text-center">
      <h1 class="text-3xl font-bold text-gray-800">Terminal de Caixa</h1>
      <p class="text-gray-500">
        Digite o código do pedido para realizar o pagamento
      </p>
    </div>

    <!-- Code Input -->
    <div class="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
      <form @submit.prevent="lookupOrder" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Código do Pedido
          </label>
          <div class="flex gap-4">
            <input
              v-model="code"
              type="text"
              maxlength="3"
              placeholder="000"
              class="flex-1 text-center text-4xl font-mono tracking-widest p-4 border-2 border-gray-300 rounded-lg focus:border-primary focus:ring-primary uppercase"
              autofocus
            />
            <button
              type="submit"
              :disabled="!code || isLoading"
              class="px-8 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50"
            >
              Buscar
            </button>
          </div>
        </div>
      </form>
    </div>

    <!-- Order Details -->
    <div
      v-if="order"
      class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
    >
      <div
        class="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center"
      >
        <div>
          <h2 class="text-xl font-bold text-gray-900">
            Pedido #{{ order.pickup_code }}
          </h2>
          <p class="text-sm text-gray-500">{{ order.customer_name }}</p>
        </div>
        <div class="text-right">
          <span
            :class="[
              'px-3 py-1 rounded-full text-xs font-medium',
              statusStyles[order.status] || 'bg-gray-100 text-gray-800',
            ]"
          >
            {{ statusLabels[order.status] || order.status }}
          </span>
        </div>
      </div>

      <div class="p-6 space-y-6">
        <!-- Items -->
        <div class="space-y-3">
          <div
            v-for="item in order.items"
            :key="item.id"
            class="flex justify-between items-center"
          >
            <div class="flex items-center gap-3">
              <span class="font-medium text-gray-900"
                >{{ item.quantity }}x</span
              >
              <span class="text-gray-700">{{ item.dish_name }}</span>
            </div>
            <span class="font-medium">
              {{ currencyFormatter.format(item.total_price) }}
            </span>
          </div>
        </div>

        <div class="border-t pt-4 flex justify-between items-center">
          <span class="text-lg font-semibold">Total a Pagar</span>
          <span class="text-3xl font-bold text-primary">
            {{ currencyFormatter.format(order.total) }}
          </span>
        </div>

        <!-- Actions -->
        <div class="pt-4" v-if="order.status === 'waiting'">
          <button
            @click="confirmPayment"
            :disabled="isProcessing"
            class="w-full py-4 bg-green-600 text-white rounded-xl font-bold text-lg hover:bg-green-700 shadow-lg shadow-green-200 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <UIcon name="i-heroicons-currency-dollar" class="w-6 h-6" />
            {{ isProcessing ? "Processando..." : "Confirmar Pagamento" }}
          </button>
        </div>
        <div class="pt-4 text-center" v-else>
          <p class="text-gray-500">Este pedido já foi processado.</p>
          <button
            @click="reset"
            class="mt-2 text-primary hover:underline font-medium"
          >
            Buscar outro pedido
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";

definePageMeta({
  layout: "admin",
});

const auth = useAuthStore();
const code = ref("");

interface OrderItem {
  id: string;
  dish_name: string;
  quantity: number;
  total_price: number;
}

interface Order {
  id: string;
  pickup_code: string;
  customer_name: string;
  status: string;
  total: number;
  items: OrderItem[];
}

const order = ref<Order | null>(null);
const isLoading = ref(false);
const isProcessing = ref(false);

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const statusLabels: Record<string, string> = {
  waiting: "Aguardando Pagamento",
  pending: "Pendente",
  preparing: "Preparando",
  completed: "Concluído",
  cancelled: "Cancelado",
};

const statusStyles: Record<string, string> = {
  waiting: "bg-orange-100 text-orange-800",
  pending: "bg-yellow-100 text-yellow-800",
  preparing: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const lookupOrder = async () => {
  if (!code.value) return;

  isLoading.value = true;
  order.value = null;

  try {
    const companyId = auth.user?.company?.id;
    if (!companyId) throw new Error("Company ID not found");

    const response = await $fetch<{ success: boolean; data?: Order }>(
      "/api/orders/lookup",
      {
        params: {
          code: code.value,
          companyId,
        },
      }
    );

    if (response.success && response.data) {
      order.value = response.data;
    } else {
      alert("Pedido não encontrado");
    }
  } catch (error) {
    console.error("Error looking up order:", error);
    alert("Erro ao buscar pedido");
  } finally {
    isLoading.value = false;
  }
};

const confirmPayment = async () => {
  if (!order.value) return;

  isProcessing.value = true;
  try {
    const response = await $fetch(`/api/orders/${order.value.id}`, {
      method: "PUT" as const,
      body: { status: "pending" }, // Move to pending (kitchen) after payment
    });

    if (response.success) {
      order.value.status = "pending";
      alert("Pagamento confirmado! Pedido enviado para a cozinha.");
      reset();
    }
  } catch (error) {
    console.error("Error confirming payment:", error);
    alert("Erro ao confirmar pagamento");
  } finally {
    isProcessing.value = false;
  }
};

const reset = () => {
  code.value = "";
  order.value = null;
};
</script>
