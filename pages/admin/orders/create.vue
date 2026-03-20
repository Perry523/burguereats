<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Adicionar Pedido</h1>
        <p class="text-sm text-gray-500">Crie um novo pedido manualmente</p>
      </div>
      <div class="flex items-center gap-3">
        <NuxtLink to="/admin/orders">
          <button
            type="button"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancelar
          </button>
        </NuxtLink>
        <button
          type="submit"
          form="create-order-form"
          :disabled="isSaving || (items.length === 0 && productItems.length === 0)"
          class="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
        >
          {{ isSaving ? "Salvando..." : "Salvar pedido" }}
        </button>
      </div>
    </div>

    <!-- Form -->
    <form
      id="create-order-form"
      @submit.prevent="saveOrder"
      class="grid grid-cols-1 lg:grid-cols-3 gap-6"
    >
      <!-- Left Column - Customer Info & Settings (1/3 width) -->
      <div class="lg:col-span-1 space-y-6">
        <!-- Main Information -->
        <div class="bg-white rounded-lg border border-gray-200 p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-gray-800">Cliente</h2>
            <button
              type="button"
              @click="showNewClientForm = !showNewClientForm"
              class="text-xs font-medium text-primary hover:underline"
            >
              {{ showNewClientForm ? 'Selecionar existente' : '+ Novo Cliente' }}
            </button>
          </div>

          <!-- Select existing client -->
          <div v-if="!showNewClientForm" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Selecionar Cliente <span class="text-red-500">*</span>
              </label>
              <select
                v-model="form.client_id"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="" disabled>Selecione um cliente</option>
                <option
                  v-for="client in availableClients"
                  :key="client.id"
                  :value="client.id"
                >
                  {{ client.name }} {{ client.phone ? `— ${client.phone}` : '' }}
                </option>
              </select>
              <p v-if="availableClients.length === 0" class="text-xs text-gray-400 mt-1">
                Nenhum cliente cadastrado. Clique em "+ Novo Cliente" para criar.
              </p>
            </div>

            <!-- Show selected client info -->
            <div v-if="selectedClient" class="bg-gray-50 rounded-lg p-3 text-sm space-y-1">
              <p class="font-medium text-gray-800">{{ selectedClient.name }}</p>
              <p v-if="selectedClient.phone" class="text-gray-500">{{ selectedClient.phone }}</p>
            </div>
          </div>

          <!-- Create new client inline -->
          <div v-else class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Nome <span class="text-red-500">*</span>
              </label>
              <input
                v-model="newClient.name"
                type="text"
                placeholder="Ex: João Silva"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
              <input
                v-model="newClient.phone"
                type="text"
                placeholder="(00) 00000-0000"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <button
              type="button"
              @click="createNewClient"
              :disabled="isCreatingClient || !newClient.name.trim()"
              class="w-full px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-focus disabled:opacity-50"
            >
              {{ isCreatingClient ? 'Salvando...' : 'Salvar e selecionar cliente' }}
            </button>
          </div>

          <!-- Address Section & Order Type -->
          <div class="mt-6 pt-6 border-t border-gray-100 space-y-4">
            <h3 class="text-md font-semibold text-gray-800">Tipo de Pedido e Endereço</h3>
            
            <div class="flex gap-6 mb-4">
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="radio" v-model="orderType" value="delivery" class="text-primary focus:ring-primary h-4 w-4" />
                <span class="text-sm text-gray-700 font-medium">Entrega</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="radio" v-model="orderType" value="pickup" class="text-primary focus:ring-primary h-4 w-4" />
                <span class="text-sm text-gray-700 font-medium">Retirada no Local</span>
              </label>
            </div>

            <div v-if="orderType === 'delivery'" class="space-y-4 border-t border-gray-100 pt-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">CEP (Opcional)</label>
              <div class="relative">
                <input
                  v-model="addressDetails.cep"
                  @input="handleCepInput"
                  @blur="fetchAddressFromCep"
                  type="text"
                  placeholder="00000-000"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <UIcon v-if="cepLoading" name="i-heroicons-arrow-path" class="w-5 h-5 absolute right-3 top-2.5 animate-spin text-gray-400" />
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div class="sm:col-span-3">
                <label class="block text-sm font-medium text-gray-700 mb-2">Logradouro / Rua</label>
                <input
                  v-model="addressDetails.logradouro"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div class="sm:col-span-1">
                <label class="block text-sm font-medium text-gray-700 mb-2">Número</label>
                <input
                  v-model="addressDetails.numero"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Complemento</label>
                <input
                  v-model="addressDetails.complemento"
                  type="text"
                  placeholder="Apto, Bloco..."
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Bairro</label>
                <input
                  v-model="addressDetails.bairro"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Cidade</label>
              <input
                v-model="addressDetails.cidade"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            
            <p class="text-xs text-gray-500 italic mt-1">* Estado e País fixados em PB, Brasil.</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg border border-gray-200 p-6">
          <h2 class="text-lg font-semibold text-gray-800 mb-4">Detalhes do Pedido</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Status Inicial</label>
              <select
                v-model="form.status"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="pending">Pendente</option>
                <option value="preparing">Preparando</option>
                <option value="delivering">Em entrega</option>
                <option value="completed">Concluído</option>
              </select>
            </div>

            <!-- Biker selector – only shown when status is "Em entrega" -->
            <div v-if="form.status === 'delivering'">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Entregador <span class="text-red-500">*</span>
              </label>
              <select
                v-model="form.biker_id"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="" disabled>Selecione um entregador</option>
                <option
                  v-for="biker in availableBikers"
                  :key="biker.id"
                  :value="biker.id"
                >
                  {{ biker.name }}
                </option>
              </select>
              <p v-if="availableBikers.length === 0" class="text-xs text-gray-400 mt-1">
                Nenhum entregador cadastrado.
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Valor da entrega</label>
              <input
                :value="deliveryFeeDisplay"
                @input="handleDeliveryFeeInput"
                @paste="handleDeliveryFeePaste"
                :disabled="orderType === 'pickup'"
                type="text"
                inputmode="numeric"
                placeholder="R$ 0,00"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:bg-gray-100"
              />
            </div>
            
            <div class="mt-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">Observações Gerenciais</label>
              <textarea
                v-model="form.notes"
                rows="3"
                placeholder="Informações adicionais sobre o pedido..."
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              ></textarea>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column - Order Items (2/3 width) -->
      <div class="lg:col-span-2 space-y-6">

        <!-- Dishes Card -->
        <div class="bg-white rounded-lg border border-gray-200 p-6">
          <div class="flex items-center justify-between mb-4">
             <h2 class="text-lg font-semibold text-gray-800">Pratos do Cardápio</h2>
             <span class="text-lg font-bold text-gray-900 border border-gray-200 rounded-md px-3 py-1 bg-gray-50">
                Total: {{ currencyFormatter.format(orderTotal) }}
             </span>
          </div>

          <!-- Add Dish Selection -->
          <div class="flex flex-wrap sm:flex-nowrap gap-3 mb-4 items-end">
            <div class="flex-1 w-full">
               <label class="block text-sm font-medium text-gray-700 mb-2">Adicionar Prato</label>
               <select
                 v-model="dishToAdd"
                 class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
               >
                 <option value="" disabled>Selecione um prato do cardápio</option>
                 <option
                   v-for="dish in availableDishes"
                   :key="dish.id"
                   :value="dish.id"
                 >
                   {{ dish.name }} ({{ currencyFormatter.format(dish.price) }})
                 </option>
               </select>
            </div>
            <button
               type="button"
               @click="addDishToOrder"
               :disabled="!dishToAdd"
               class="px-4 py-2 mt-2 sm:mt-0 w-full sm:w-auto text-sm font-medium text-primary bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 disabled:opacity-50"
             >
               Adicionar
            </button>
          </div>

          <!-- Dish Items List -->
          <div v-if="items.length > 0" class="space-y-3">
             <div
               v-for="(item, index) in items"
               :key="`dish-item-${index}`"
               class="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center rounded-lg border border-gray-200 p-4"
             >
               <div class="flex-1">
                 <div class="flex items-center gap-2">
                    <span class="font-medium text-gray-800">{{ item.dish_name }}</span>
                    <span class="text-sm text-gray-500">{{ currencyFormatter.format(item.unit_price) }}</span>
                 </div>
               </div>
               <div class="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                  <div class="flex items-center border border-gray-300 rounded-lg">
                    <button type="button" class="px-3 py-1 text-gray-600 hover:bg-gray-100" @click="updateQuantity(index, -1)">-</button>
                    <span class="px-3 py-1 font-medium min-w-10 text-center">{{ item.quantity }}</span>
                    <button type="button" class="px-3 py-1 text-gray-600 hover:bg-gray-100" @click="updateQuantity(index, 1)">+</button>
                  </div>
                  <div class="text-right w-24">
                     <span class="font-medium text-gray-900">{{ currencyFormatter.format(item.total_price) }}</span>
                  </div>
                  <button type="button" @click="removeItem(index)" class="text-red-500 hover:text-red-700 p-1" title="Remover">
                    <UIcon name="i-heroicons-trash" class="w-5 h-5" />
                  </button>
               </div>
             </div>
          </div>
          <div v-else class="text-center py-6 rounded-lg border-2 border-dashed border-gray-200">
             <p class="text-gray-400 text-sm">Nenhum prato adicionado</p>
          </div>
        </div>

        <!-- Products Card -->
        <div class="bg-white rounded-lg border border-gray-200 p-6">
          <h2 class="text-lg font-semibold text-gray-800 mb-4">Produtos</h2>

          <!-- Add Product Selection -->
          <div class="flex flex-wrap sm:flex-nowrap gap-3 mb-4 items-end">
            <div class="flex-1 w-full">
               <label class="block text-sm font-medium text-gray-700 mb-2">Adicionar Produto</label>
               <select
                 v-model="productToAdd"
                 class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
               >
                 <option value="" disabled>Selecione um produto</option>
                 <option
                   v-for="product in availableProducts"
                   :key="product.id"
                   :value="product.id"
                 >
                   {{ product.name }} ({{ currencyFormatter.format(product.sell_price) }}) — Estoque: {{ product.stock }}
                 </option>
               </select>
            </div>
            <button
               type="button"
               @click="addProductToOrder"
               :disabled="!productToAdd"
               class="px-4 py-2 mt-2 sm:mt-0 w-full sm:w-auto text-sm font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 disabled:opacity-50"
             >
               Adicionar
            </button>
          </div>

          <!-- Product Items List -->
          <div v-if="productItems.length > 0" class="space-y-3">
             <div
               v-for="(item, index) in productItems"
               :key="`product-item-${index}`"
               class="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center rounded-lg border border-gray-200 p-4"
             >
               <div class="flex-1">
                 <div class="flex items-center gap-2">
                    <span class="font-medium text-gray-800">{{ item.product_name }}</span>
                    <span class="text-xs bg-emerald-100 text-emerald-700 rounded px-1.5 py-0.5">Produto</span>
                    <span class="text-sm text-gray-500">{{ currencyFormatter.format(item.unit_price) }}</span>
                 </div>
               </div>
               <div class="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                  <div class="flex items-center border border-gray-300 rounded-lg">
                    <button type="button" class="px-3 py-1 text-gray-600 hover:bg-gray-100" @click="updateProductQuantity(index, -1)">-</button>
                    <span class="px-3 py-1 font-medium min-w-10 text-center">{{ item.quantity }}</span>
                    <button type="button" class="px-3 py-1 text-gray-600 hover:bg-gray-100" @click="updateProductQuantity(index, 1)">+</button>
                  </div>
                  <div class="text-right w-24">
                     <span class="font-medium text-gray-900">{{ currencyFormatter.format(item.total_price) }}</span>
                  </div>
                  <button type="button" @click="removeProductItem(index)" class="text-red-500 hover:text-red-700 p-1" title="Remover">
                    <UIcon name="i-heroicons-trash" class="w-5 h-5" />
                  </button>
               </div>
             </div>
          </div>
          <div v-else class="text-center py-6 rounded-lg border-2 border-dashed border-gray-200">
             <p class="text-gray-400 text-sm">Nenhum produto adicionado</p>
          </div>
        </div>

      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, reactive, ref, watch } from "vue";
import { storeToRefs } from "pinia";

definePageMeta({
  layout: "admin",
});

interface Dish {
  id: string;
  name: string;
  price: number;
}

interface Product {
  id: string;
  name: string;
  sell_price: number;
  stock: number;
}

interface Client {
  id: string;
  name: string;
  phone: string | null;
}

interface Biker {
  id: string;
  name: string;
}

interface OrderItem {
  dish_id: string;
  dish_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  customizations?: any;
}

interface ProductItem {
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

const auth = useAuthStore();
const { user } = storeToRefs(auth);
const toast = useToast();

const isSaving = ref(false);
const isCreatingClient = ref(false);
const showNewClientForm = ref(false);

const availableDishes = ref<Dish[]>([]);
const availableProducts = ref<Product[]>([]);
const availableBikers = ref<Biker[]>([]);
const availableClients = ref<Client[]>([]);

const dishToAdd = ref<string>("");
const productToAdd = ref<string>("");

const items = ref<OrderItem[]>([]);
const productItems = ref<ProductItem[]>([]);

const newClient = reactive({ name: "", phone: "" });

const form = reactive({
  client_id: "",
  status: "pending",
  notes: "",
  biker_id: "",
  delivery_fee: 0,
});

const addressDetails = reactive({
  cep: "",
  logradouro: "",
  numero: "",
  complemento: "",
  bairro: "",
  cidade: "",
});

const cepLoading = ref(false);
const orderType = ref("delivery");

watch(orderType, (newVal) => {
  if (newVal === "pickup") {
    form.delivery_fee = 0;
  }
});

const deliveryFeeDisplay = computed(() => {
  if (!form.delivery_fee) return '';
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(form.delivery_fee);
});

const handleDeliveryFeeInput = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const digits = target.value.replace(/\D/g, '');
  const cents = parseInt(digits || '0', 10);
  form.delivery_fee = cents / 100;
  // Force the display to update
  nextTick(() => {
    target.value = deliveryFeeDisplay.value;
  });
};

const handleDeliveryFeePaste = (e: ClipboardEvent) => {
  e.preventDefault();
  const pastedValue = e.clipboardData?.getData('text') || '';
  
  let cleanStr = pastedValue.replace(/[^\d.,]/g, '');
  if (!cleanStr) return;
  
  if (cleanStr.includes(',') && cleanStr.includes('.')) {
     cleanStr = cleanStr.replace(/\./g, '').replace(',', '.');
  } else if (cleanStr.includes(',')) {
     cleanStr = cleanStr.replace(',', '.');
  }
  
  const parsedFloat = parseFloat(cleanStr);
  
  if (!isNaN(parsedFloat)) {
    form.delivery_fee = parsedFloat;
    const target = e.target as HTMLInputElement;
    nextTick(() => {
      target.value = deliveryFeeDisplay.value;
    });
  }
};

const applyMask = (value: string) => {
  return value.replace(/\D/g, '').replace(/^(\d{5})(\d)/, '$1-$2').substr(0, 9);
};

const handleCepInput = (e: Event) => {
  const target = e.target as HTMLInputElement;
  addressDetails.cep = applyMask(target.value);
};

const fetchAddressFromCep = async () => {
  const cepValue = addressDetails.cep.replace(/\D/g, '');
  if (cepValue.length === 8) {
    cepLoading.value = true;
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepValue}/json/`);
      const data = await response.json();
      if (!data.erro) {
        addressDetails.logradouro = data.logradouro || '';
        addressDetails.bairro = data.bairro || '';
        addressDetails.cidade = data.localidade || '';
        // Automatically focus the number input after auto-filling. Optional but good UX.
        document.querySelector<HTMLInputElement>('input[v-model="addressDetails.numero"]')?.focus();
      }
    } catch (e) {
      console.error("Erro ao buscar CEP:", e);
    } finally {
      cepLoading.value = false;
    }
  }
};

const selectedClient = computed(() => {
  if (!form.client_id) return null;
  return availableClients.value.find(c => c.id === form.client_id) || null;
});

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const orderTotal = computed(() => {
  const dishTotal = items.value.reduce((sum, item) => sum + item.total_price, 0);
  const productTotal = productItems.value.reduce((sum, item) => sum + item.total_price, 0);
  return dishTotal + productTotal + (form.delivery_fee || 0);
});

const loadDishes = async (companyId: string) => {
  try {
    const response = await $fetch<{ success: boolean; data?: Dish[] }>(`/api/dishes?companyId=${companyId}`);
    availableDishes.value = Array.isArray(response?.data) ? response.data : [];
  } catch (error) {
    console.error("Error loading dishes:", error);
    availableDishes.value = [];
  }
};

const loadProducts = async (companyId: string) => {
  try {
    const response = await $fetch<{ success: boolean; data?: Product[] }>(`/api/products?companyId=${companyId}&activeOnly=true`);
    availableProducts.value = Array.isArray(response?.data) ? response.data : [];
  } catch (error) {
    console.error("Error loading products:", error);
    availableProducts.value = [];
  }
};

const loadBikers = async (companyId: string) => {
  try {
    const response = await $fetch<{ success: boolean; data?: Biker[] }>(`/api/bikers?companyId=${companyId}`);
    availableBikers.value = Array.isArray(response?.data) ? response.data : [];
  } catch (error) {
    console.error("Error loading bikers:", error);
    availableBikers.value = [];
  }
};

const loadClients = async (companyId: string) => {
  try {
    const response = await $fetch<{ success: boolean; data?: Client[] }>(`/api/clients?companyId=${companyId}`);
    availableClients.value = Array.isArray(response?.data) ? response.data : [];
  } catch (error) {
    console.error("Error loading clients:", error);
    availableClients.value = [];
  }
};

const createNewClient = async () => {
  if (!newClient.name.trim()) {
    toast.add({ color: "warning", title: "Informe o nome do cliente" });
    return;
  }
  const companyId = user.value?.company?.id;
  if (!companyId) return;

  isCreatingClient.value = true;
  try {
    const response = await $fetch<{ success: boolean; data?: Client }>("/api/clients", {
      method: "POST",
      body: { company_id: companyId, name: newClient.name.trim(), phone: newClient.phone.trim() || null },
    });
    if (response.success && response.data) {
      availableClients.value.push(response.data);
      form.client_id = response.data.id;
      newClient.name = "";
      newClient.phone = "";
      showNewClientForm.value = false;
      toast.add({ color: "success", title: "Cliente criado com sucesso" });
    }
  } catch (error) {
    console.error("Error creating client:", error);
    toast.add({ color: "error", title: "Erro ao criar cliente" });
  } finally {
    isCreatingClient.value = false;
  }
};

const addDishToOrder = () => {
    if (!dishToAdd.value) return;
    const dish = availableDishes.value.find(d => d.id === dishToAdd.value);
    if (!dish) return;
    items.value.push({
        dish_id: dish.id,
        dish_name: dish.name,
        quantity: 1,
        unit_price: dish.price,
        total_price: dish.price
    });
    dishToAdd.value = "";
};

const addProductToOrder = () => {
    if (!productToAdd.value) return;
    const product = availableProducts.value.find(p => p.id === productToAdd.value);
    if (!product) return;
    if (product.stock <= 0) {
        toast.add({ color: "warning", title: `${product.name} está sem estoque` });
        return;
    }
    // Check if already in list — just increment quantity
    const existing = productItems.value.find(p => p.product_id === product.id);
    if (existing) {
        if (existing.quantity >= product.stock) {
            toast.add({ color: "warning", title: `Estoque insuficiente para ${product.name}` });
            return;
        }
        existing.quantity++;
        existing.total_price = existing.quantity * existing.unit_price;
    } else {
        productItems.value.push({
            product_id: product.id,
            product_name: product.name,
            quantity: 1,
            unit_price: product.sell_price,
            total_price: product.sell_price,
        });
    }
    productToAdd.value = "";
};

const updateQuantity = (index: number, change: number) => {
    const item = items.value[index];
    const newQty = item.quantity + change;
    if (newQty > 0) {
        item.quantity = newQty;
        item.total_price = item.quantity * item.unit_price;
    }
};

const updateProductQuantity = (index: number, change: number) => {
    const item = productItems.value[index];
    const product = availableProducts.value.find(p => p.id === item.product_id);
    const newQty = item.quantity + change;
    if (newQty > 0) {
        if (change > 0 && product && newQty > product.stock) {
            toast.add({ color: "warning", title: `Estoque insuficiente para ${item.product_name}` });
            return;
        }
        item.quantity = newQty;
        item.total_price = item.quantity * item.unit_price;
    }
};

const removeItem = (index: number) => { items.value.splice(index, 1); };
const removeProductItem = (index: number) => { productItems.value.splice(index, 1); };

const saveOrder = async () => {
  if (!form.client_id) {
    toast.add({ color: "warning", title: "Selecione um cliente" });
    return;
  }

  if (items.value.length === 0 && productItems.value.length === 0) {
    toast.add({ color: "warning", title: "Adicione pelo menos um item ao pedido" });
    return;
  }

  if (form.status === "delivering" && !form.biker_id) {
    toast.add({ color: "warning", title: "Selecione um entregador para o status \"Em entrega\"" });
    return;
  }

  const companyId = user.value?.company?.id;
  if (!companyId) {
    toast.add({ color: "error", title: "Empresa não encontrada" });
    return;
  }

  const client = selectedClient.value;

  isSaving.value = true;
  try {
    let fullAddress = "Retirada no local";
    
    if (orderType.value === "delivery") {
      const addressParts = [];
      if (addressDetails.logradouro) addressParts.push(addressDetails.logradouro);
      if (addressDetails.numero) addressParts.push(addressDetails.numero);
      if (addressDetails.complemento) addressParts.push(`(${addressDetails.complemento})`);
      if (addressDetails.bairro) addressParts.push(`- ${addressDetails.bairro}`);
      if (addressDetails.cidade) addressParts.push(`- ${addressDetails.cidade}`);
      if (addressParts.length > 0) addressParts.push("- PB, BR");
  
      fullAddress = addressParts.join(" ");
    }

    const payload = {
      companyId,
      client_id: form.client_id,
      customer_name: selectedClient.value?.name,
      customer_phone: selectedClient.value?.phone,
      customer_address: fullAddress,
      status: form.status,
      notes: form.notes,
      total: orderTotal.value,
      delivery_fee: form.delivery_fee || 0,
      items: items.value,
      product_items: productItems.value,
      biker_id: form.status === "delivering" ? form.biker_id || null : null,
    };

    await $fetch("/api/orders", {
      method: "POST",
      body: payload,
    });

    toast.add({ color: "success", title: "Pedido criado com sucesso" });
    await navigateTo("/admin/orders");
  } catch (error) {
    console.error("Error saving order:", error);
    toast.add({
      color: "error",
      title: "Erro ao criar pedido",
      description: "Tente novamente em instantes",
    });
  } finally {
    isSaving.value = false;
  }
};

onMounted(async () => {
  if (!user.value?.company?.id) {
    await auth.getCurrentUser();
  }
  
  const companyId = user.value?.company?.id;
  if (companyId) {
    await Promise.all([
      loadDishes(companyId),
      loadProducts(companyId),
      loadBikers(companyId),
      loadClients(companyId),
    ]);
  }
});
</script>
