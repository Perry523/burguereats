<template>
  <div
    class="min-h-screen bg-gradient-to-br from-primary/5 to-orange-50 flex items-center justify-center py-8 px-4"
  >
    <div
      class="max-w-md w-full space-y-6 bg-white p-8 md:p-12 rounded-2xl shadow-xl text-center"
    >
      <!-- Success Icon -->
      <div
        class="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 animate-pulse"
      >
        <svg
          class="h-10 w-10 text-green-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="3"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      <!-- Title -->
      <div>
        <h1 class="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
          Pedido Realizado!
        </h1>
        <p class="text-gray-600">Seu pedido foi confirmado com sucesso</p>
      </div>

      <!-- Pickup Code Section -->
      <div
        class="bg-gradient-to-br from-primary/10 to-orange-50 rounded-xl p-6 border-2 border-primary/20"
      >
        <p
          class="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3"
        >
          Código de Retirada
        </p>
        <div
          class="text-7xl md:text-8xl font-mono font-black text-primary tracking-widest mb-3"
        >
          {{ order?.pickup_code || "..." }}
        </div>
        <p class="text-sm text-gray-600 leading-relaxed">
          Apresente este código no caixa para realizar o pagamento e retirar seu
          pedido
        </p>
      </div>

      <!-- Action Button -->
      <div class="pt-4">
        <NuxtLink
          to="/"
          class="block w-full py-4 px-6 bg-primary text-white text-lg font-semibold rounded-xl hover:bg-primary/90 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          Fazer Novo Pedido
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const orderId = route.params.id as string;

interface Order {
  id: string;
  pickup_code: string;
}

const { data: response } = await useFetch<{ success: boolean; data?: Order }>(
  `/api/orders/${orderId}`
);
const order = computed(() => response.value?.data);
</script>
