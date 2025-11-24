<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm sticky top-0 z-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-1">
          <div class="flex items-center">
            <nuxt-img
              src="/logo-restaurante.jpg"
              alt="Logo"
              class="w-14 md:w-20"
            />
          </div>
          <div class="flex items-center space-x-4">
            <UInput
              v-model="searchQuery"
              placeholder="Buscar pratos..."
              class="hidden w-64 md:hidden"
              icon="i-heroicons-magnifying-glass "
            />
            <UButton
              class="md:hidden"
              icon="i-heroicons-shopping-bag"
              variant="outline"
              @click="openCartPanel"
            >
              Sacola ({{ itemCount }})
            </UButton>
          </div>
        </div>
      </div>
    </header>

    <!-- Categories -->
    <div v-if="!isCheckoutPage" class="bg-white md:py-2">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center space-x-6 py-4 overflow-x-auto">
          <div class="text-lg font-semibold">Categorias:</div>
          <UButton
            v-for="category in visibleCategories"
            :key="category.id"
            :variant="activeCategory === category.id ? 'solid' : 'ghost'"
            @click="activeCategory = category.id"
            class="whitespace-nowrap"
          >
            {{ category.name }}
          </UButton>
        </div>
      </div>
    </div>

    <!-- Main content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div
        :class="[
          !isCheckoutPage
            ? 'lg:grid lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start lg:gap-10'
            : '',
        ]"
      >
        <div>
          <slot />
        </div>
        <aside
          v-if="hasMultipleItems && !isCheckoutPage"
          class="hidden lg:block"
        >
          <div
            class="sticky top-24 space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl"
          >
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-semibold text-slate-900">Sua sacola</h2>
              <span class="text-sm font-medium text-slate-500"
                >{{ itemCount }} itens</span
              >
            </div>
            <ul class="space-y-5">
              <li v-for="item in cartItems" :key="item.id">
                <button
                  type="button"
                  class="group w-full rounded-2xl border border-transparent bg-white px-3 py-2 text-left transition hover:border-orange-200 hover:bg-orange-50/60"
                  @click="handleEditCartItem(item)"
                >
                  <div class="flex items-start gap-4">
                    <div
                      class="h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-slate-100"
                    >
                      <nuxt-img
                        :src="formatCartImage(item.image)"
                        :alt="item.name"
                        class="h-full w-full object-cover"
                      />
                    </div>
                    <div class="flex flex-1 flex-col gap-1">
                      <p class="text-sm font-semibold text-slate-900">
                        {{ item.quantity }}x {{ item.name }}
                      </p>
                      <p
                        v-if="selectionSummary(item)"
                        class="text-xs text-slate-500"
                      >
                        {{ selectionSummary(item) }}
                      </p>
                    </div>
                    <div class="flex flex-col items-end gap-2">
                      <button
                        type="button"
                        class="text-slate-400 transition hover:text-red-500"
                        @click.stop="removeCartItem(item.id)"
                      >
                        <UIcon
                          name="i-heroicons-trash-20-solid"
                          class="h-5 w-5"
                        />
                      </button>
                      <span class="text-sm font-semibold text-slate-900">
                        {{
                          currencyFormatter.format(
                            item.unitPrice * item.quantity
                          )
                        }}
                      </span>
                    </div>
                  </div>
                </button>
              </li>
            </ul>
            <div class="space-y-4 border-t border-slate-200 pt-4">
              <div class="flex items-center justify-between">
                <span class="text-sm font-semibold text-slate-600">Total</span>
                <span class="text-xl font-bold text-slate-900">{{
                  currencyFormatter.format(cartTotal)
                }}</span>
              </div>
              <UButton
                size="lg"
                class="w-full justify-center"
                :disabled="!cartItems.length"
                @click="goToCheckout"
              >
                Fazer pedido
              </UButton>
            </div>
          </div>
        </aside>
      </div>
    </main>

    <Teleport to="body">
      <Transition
        enter-active-class="duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="duration-150 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="isCartPanelOpen" class="fixed inset-0 z-50 lg:hidden">
          <div
            class="absolute inset-0 bg-slate-950/60"
            @click="closeCartPanel"
          ></div>
          <div
            class="absolute inset-y-0 right-0 flex h-full w-full max-w-xs flex-col rounded-l-3xl bg-white shadow-2xl"
          >
            <div
              class="flex items-center justify-between border-b border-slate-100 px-6 py-5"
            >
              <div class="space-y-1">
                <h2 class="text-base font-semibold text-slate-900">
                  Sua sacola
                </h2>
                <span class="text-xs font-medium text-slate-500"
                  >{{ itemCount }} itens</span
                >
              </div>
              <button
                type="button"
                class="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
                @click="closeCartPanel"
              >
                <UIcon name="i-heroicons-x-mark" class="h-5 w-5" />
              </button>
            </div>
            <div class="flex-1 overflow-y-auto px-6 py-5">
              <div
                v-if="!cartItems.length"
                class="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm font-medium text-slate-500"
              >
                Sacola vazia. Adicione itens para fazer seu pedido.
              </div>
              <ul v-else class="space-y-6">
                <li v-for="item in cartItems" :key="item.id">
                  <button
                    type="button"
                    class="group w-full rounded-2xl border border-slate-100 bg-white px-3 py-2 text-left shadow-sm transition hover:border-orange-200 hover:bg-orange-50/60"
                    @click="handleEditCartItem(item)"
                  >
                    <div class="flex items-start gap-4">
                      <div
                        class="h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-slate-100"
                      >
                        <nuxt-img
                          :src="formatCartImage(item.image)"
                          :alt="item.name"
                          class="h-full w-full object-cover"
                        />
                      </div>
                      <div class="flex flex-1 flex-col gap-1">
                        <p class="text-sm font-semibold text-slate-900">
                          {{ item.quantity }}x {{ item.name }}
                        </p>
                        <p
                          v-if="selectionSummary(item)"
                          class="text-xs text-slate-500"
                        >
                          {{ selectionSummary(item) }}
                        </p>
                      </div>
                      <div class="flex flex-col items-end gap-2">
                        <button
                          type="button"
                          class="text-slate-400 transition hover:text-red-500"
                          @click.stop="removeCartItem(item.id)"
                        >
                          <UIcon
                            name="i-heroicons-trash-20-solid"
                            class="h-5 w-5"
                          />
                        </button>
                        <span class="text-sm font-semibold text-slate-900">
                          {{
                            currencyFormatter.format(
                              item.unitPrice * item.quantity
                            )
                          }}
                        </span>
                      </div>
                    </div>
                  </button>
                </li>
              </ul>
            </div>
            <div class="border-t border-slate-100 px-6 py-5 space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-sm font-semibold text-slate-600">Total</span>
                <span class="text-lg font-bold text-slate-900">{{
                  currencyFormatter.format(cartTotal)
                }}</span>
              </div>
              <UButton
                size="lg"
                class="w-full justify-center"
                :disabled="!cartItems.length"
                @click="goToCheckout"
              >
                Fazer pedido
              </UButton>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import type { CartItem } from "~/stores/cart";
import { useCartStore } from "~/stores/cart";

const cartStore = useCartStore();
const { itemCount, items, totalAmount } = storeToRefs(cartStore);

const cartEditRequest = useState<string | null>("cartEditRequest", () => null);
const isCartPanelOpen = ref(false);
const router = useRouter();

// Shared state for category filtering
const activeCategory = useState("activeCategory", () => "todos");
const searchQuery = useState("menuSearch", () => "");

const categories = useState<Array<{ id: string; name: string }>>(
  "menuCategories",
  () => [{ id: "todos", name: "Todos" }]
);

const visibleCategories = computed(() => {
  const unique = new Map<string, { id: string; name: string }>();
  for (const category of categories.value) {
    if (!category || !category.id || !category.name) {
      continue;
    }
    if (!unique.has(category.id)) {
      unique.set(category.id, {
        id: category.id,
        name: category.name,
      });
    }
  }
  if (!unique.has("todos")) {
    unique.set("todos", { id: "todos", name: "Todos" });
  }
  return Array.from(unique.values());
});

const cartItems = computed(() => items.value);
const cartTotal = computed(() => totalAmount.value);
const hasMultipleItems = computed(() => itemCount.value >= 1);

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const cartPlaceholderImage =
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80";

const formatCartImage = (image?: string | null) => {
  if (!image || !image.length) {
    return cartPlaceholderImage;
  }
  return image.includes("?")
    ? `${image}&auto=format&fit=crop&w=400&q=80`
    : `${image}?auto=format&fit=crop&w=400&q=80`;
};

const selectionSummary = (item: CartItem) => {
  const parts: string[] = [];
  for (const selection of item.selections) {
    const optionNames = selection.options.map((option) => option.name);
    if (optionNames.length) {
      parts.push(optionNames.join(", "));
    }
  }
  return parts.join(" • ");
};

const openCartPanel = () => {
  isCartPanelOpen.value = true;
};

const closeCartPanel = () => {
  isCartPanelOpen.value = false;
};

const handleEditCartItem = (item: CartItem) => {
  cartEditRequest.value = item.id;
  closeCartPanel();
};

const removeCartItem = (itemId: string) => {
  cartStore.removeItem(itemId);
};

const goToCheckout = () => {
  if (!cartItems.value.length) {
    return;
  }
  closeCartPanel();
  router.push("/checkout");
};

const route = useRoute();
const isCheckoutPage = computed(() => route.path === "/checkout");

provide("activeCategory", activeCategory);
</script>
