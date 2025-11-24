<template>
  <NuxtLayout name="user">
    <div class="min-h-screen bg-gray-50">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-8">Finalizar Pedido</h1>

        <div v-if="cartStore.items.length === 0" class="text-center py-12">
          <p class="text-gray-500">Seu carrinho está vazio</p>
          <NuxtLink
            to="/"
            class="mt-4 inline-block text-primary hover:underline"
          >
            Voltar ao menu
          </NuxtLink>
        </div>

        <form
          v-else
          @submit.prevent="submitOrder"
          class="lg:grid lg:grid-cols-12 lg:gap-8 lg:items-start"
        >
          <!-- Cart Items (Left Column) -->
          <div class="lg:col-span-5 space-y-6 mb-8 lg:mb-0">
            <div class="bg-white rounded-lg shadow p-6">
              <h2 class="text-xl font-semibold mb-4">Itens do Pedido</h2>
              <div class="space-y-4">
                <div
                  v-for="item in cartStore.items"
                  :key="item.id"
                  class="flex items-center gap-4 border-b pb-4 last:border-0 last:pb-0"
                >
                  <img
                    :src="item.image"
                    alt=""
                    class="w-16 h-16 object-cover rounded"
                  />
                  <div class="mr-auto">
                    <h3 class="font-medium">{{ item.name }}</h3>
                    <p class="text-sm text-gray-500">
                      Quantidade: {{ item.quantity }}
                    </p>
                  </div>
                  <p class="font-semibold">
                    {{
                      currencyFormatter.format(item.unitPrice * item.quantity)
                    }}
                  </p>
                </div>
              </div>
              <div class="mt-6 pt-6 border-t flex justify-between items-center">
                <span class="text-lg font-semibold">Total:</span>
                <span class="text-2xl font-bold text-primary">
                  {{ currencyFormatter.format(cartStore.totalAmount) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Customer Information (Right Column) -->
          <div class="lg:col-span-7 space-y-6">
            <div class="bg-white rounded-lg shadow p-6">
              <h2 class="text-xl font-semibold mb-4">Informações do Pedido</h2>
              <div class="space-y-4">
                <!-- Delivery Method -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Método de Entrega <span class="text-red-500">*</span>
                  </label>
                  <div class="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      @click="deliveryMethod = 'pickup'"
                      :class="[
                        'px-4 py-3 rounded-lg border-2 font-medium transition',
                        deliveryMethod === 'pickup'
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400',
                      ]"
                    >
                      🏪 Retirar no Local
                    </button>
                    <button
                      type="button"
                      @click="deliveryMethod = 'delivery'"
                      :class="[
                        'px-4 py-3 rounded-lg border-2 font-medium transition',
                        deliveryMethod === 'delivery'
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400',
                      ]"
                    >
                      🚚 Entrega
                    </button>
                  </div>
                </div>

                <!-- Name -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Nome <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="customerInfo.name"
                    type="text"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Seu nome completo"
                  />
                </div>

                <!-- Phone (only for delivery) -->
                <div v-if="deliveryMethod === 'delivery'">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Telefone <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="customerInfo.phone"
                    type="tel"
                    :required="deliveryMethod === 'delivery'"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="(00) 00000-0000"
                  />
                </div>

                <!-- Address (only for delivery) -->
                <div v-if="deliveryMethod === 'delivery'">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Endereço <span class="text-red-500">*</span>
                  </label>
                  <textarea
                    v-model="customerInfo.address"
                    rows="3"
                    :required="deliveryMethod === 'delivery'"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Rua, número, complemento, bairro"
                  ></textarea>
                </div>

                <!-- Notes -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Observações
                  </label>
                  <textarea
                    v-model="customerInfo.notes"
                    rows="3"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Alguma observação sobre o pedido?"
                  ></textarea>
                </div>
              </div>
            </div>

            <!-- Submit Button -->
          </div>
          <div class="flex w-full col-span-12 gap-4 mt-4">
            <NuxtLink
              to="/"
              class="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-center font-medium text-gray-700 hover:bg-gray-50"
            >
              Voltar ao Menu
            </NuxtLink>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="flex-1 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50"
            >
              {{ isSubmitting ? "Enviando..." : "Finalizar Pedido" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useCartStore } from "~/stores/cart";

const cartStore = useCartStore();
const router = useRouter();

const customerInfo = ref({
  name: "",
  phone: "",
  address: "",
  notes: "",
});

const deliveryMethod = ref<"pickup" | "delivery">("pickup");

const isSubmitting = ref(false);

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const submitOrder = async () => {
  if (isSubmitting.value || cartStore.items.length === 0) {
    return;
  }

  isSubmitting.value = true;

  try {
    // Prepare order items
    const items = cartStore.items.map((item) => ({
      dish_id: item.dishId,
      dish_name: item.name,
      quantity: item.quantity,
      unit_price: item.basePrice,
      total_price: item.unitPrice * item.quantity,
      customizations: {
        selections: item.selections,
        image: item.image,
      },
    }));

    const payload = {
      company_id: "cmhp2pzdq0000gjpvfdsaumu0", // TODO: Get from current company context
      customer_name: customerInfo.value.name,
      customer_phone:
        deliveryMethod.value === "delivery"
          ? customerInfo.value.phone
          : "Retirada no local",
      customer_address:
        deliveryMethod.value === "delivery"
          ? customerInfo.value.address
          : "Retirada no local",
      notes: customerInfo.value.notes || null,
      total: cartStore.totalAmount,
      items,
    };

    const response = await $fetch<{
      success: boolean;
      data?: { id: string };
      error?: string;
    }>("/api/orders", {
      method: "POST",
      body: payload,
    });

    if (response.success && response.data) {
      // Clear cart
      cartStore.clearCart();

      // Redirect to success page with order ID
      router.push(`/order-success/${response.data.id}`);
    } else {
      throw new Error(response.error || "Erro ao criar pedido");
    }
  } catch (error) {
    console.error("Error submitting order:", error);
    alert("Erro ao finalizar pedido. Tente novamente.");
  } finally {
    isSubmitting.value = false;
  }
};
</script>
