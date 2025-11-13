<template>
  <form class="grid grid-cols-12 gap-2" @submit="submit">
    <autocomplete
      v-model="selectedProduct"
      :options="filteredProducts"
      :error="errors['product_id']"
      option-label="name"
      option-value="id"
      return-object
      label="Produto"
      class="col-span-12"
      :class="hasVariants ? 'sm:col-span-6' : 'sm:col-span-12'"
      :loading="loadingProducts"
      @input="handleProductSearch"
      @create="handleCreate"
    />
    <input-base
      v-model="product_variant_id"
      :options="selectedProduct?.variants"
      option-label="name"
      option-value="id"
      :error="errors['product_variant_id']"
      label="Variante"
      placeholder="Selecione uma variante"
      class="col-span-12 sm:col-span-6"
      :disabled="!variants.length"
      v-if="hasVariants"
    />
    <input-base
      v-model="stock_movement"
      :options="types"
      :error="errors['stock_movement']"
      label="Tipo"
      class="col-span-6 sm:col-span-4"
      placeholder="Selecione o tipo"
    />

    <input-base
      v-model="reason"
      :options="reasons"
      :error="errors['reason']"
      label="Motivo"
      placeholder="Selecione a razão"
      class="col-span-6 sm:col-span-4"
    />

    <input-base
      type="number"
      v-model="quantity"
      :error="errors['quantity']"
      label="Quantidade"
      placeholder="Digite a quantidade"
      class="col-span-12 sm:col-span-4"
    />
    <input-base
      v-if="['purchase', 'sale'].includes(reason)"
      is-currency
      v-model="base_price"
      @input="sideUpdate = false"
      :error="errors['base_price']"
      label="Preço Unitário"
      placeholder="Digite o preço unitário"
      class="col-span-6 sm:col-span-6"
    />
    <input-base
      v-if="['purchase', 'sale'].includes(reason)"
      is-currency
      v-model="total"
      :error="errors['total']"
      label="Preço Total"
      @focusout="
        () => {
          sideUpdate = true;
          base_price = total / quantity;
        }
      "
      placeholder="Digite o preço unitário"
      class="col-span-6 sm:col-span-6"
    />
    <input-base
      v-model="notes"
      label="Observação"
      class="col-span-12"
      type="textarea"
    />
    <base-button
      :loading="isLoading || loading"
      class="btn btn-primary col-span-12 w-full mt-4"
    >
      Salvar Movimentação
    </base-button>
  </form>

  <base-dialog title="Cadastrar novo produto" v-model="isOpened">
    <products-register-form
      v-if="isOpened"
      @submit="handleProductCreate"
      :loading="isLoading"
    />
  </base-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { useForm } from "vee-validate";
import * as yup from "yup";
import { api } from "~/server/api";
import { useDelay } from "@/utils/useDelay";
const emit = defineEmits(["submit"]);

const selectedProduct = ref<Product>();
const isOpened = ref(false);
const loadingProducts = ref(false);
const isLoading = ref(false);
const filteredProducts = ref<Product[]>([]);
const hasVariants = computed(() => selectedProduct.value?.variants?.length);
const variants = computed(() => selectedProduct.value?.variants || []);
const props = defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  product: {
    type: Object as () => Product,
    required: false,
  },
});
const types = [
  { label: "Adição", value: "addition" },
  { label: "Remoção", value: "removal" },
];

const reasons = [
  { label: "Compra", value: "purchase" },
  { label: "Venda", value: "sale" },
  { label: "Avaria", value: "waste" },
  { label: "Usado", value: "used" },
  { label: "Outro", value: "other" },
];

const validationSchema = yup.object({
  product_id: yup.number().required("Selecione um produto"),
  stock_movement: yup.string().required("Selecione o tipo de movimentação"),
  reason: yup.string().required("Selecione a razão da movimentação"),
  product_variant_id: yup.number().when("hasVariants", {
    is: true,
    then: (schema) => schema.required("Selecione uma variante"),
    otherwise: (schema) => schema.notRequired(),
  }),
  quantity: yup
    .number()
    .required("A quantidade é obrigatória")
    .min(1, "A quantidade deve ser pelo menos 1"),
  total: yup
    .number()
    .required("O preço é obrigatório")
    .min(0, "O preço deve ser maior ou igual a zero"),
  notes: yup.string().nullable(),
});

const { handleSubmit, errors, defineField } = useForm({
  validationSchema,
});
const [product_id] = defineField("product_id");
const [quantity] = defineField("quantity");
const [total] = defineField("total");
const [stock_movement] = defineField("stock_movement");
const [reason] = defineField("reason");
const [notes] = defineField("notes");
const [product_variant_id] = defineField("product_variant_id");
const base_price = ref();

async function fetchProducts(query: string) {
  try {
    loadingProducts.value = true;
    const response = await api(`/products-filter`, {
      params: { search: query || "" },
    });
    filteredProducts.value = response.data;
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
  } finally {
    loadingProducts.value = false;
  }
}

function handleProductSearch(query: string) {
  // Only fetch if the user is actually typing (not when selecting from dropdown)
  if (query && (!selectedProduct.value || selectedProduct.value.name !== query)) {
    loadingProducts.value = true;
    useDelay(async () => await fetchProducts(query), 500);
  }
}

function handleCreate() {
  isOpened.value = true;
}

async function handleProductCreate(values: Record<string, unknown>) {
  try {
    isLoading.value = true;
    const response = await api.post("/products", values);
    selectedProduct.value = response.data;
    isOpened.value = false;
  } catch (error) {
    console.error("Erro ao criar produto:", error);
  } finally {
    isLoading.value = false;
  }
}

function handleFormSubmit(values: object) {
  emit("submit", values);
}
const sideUpdate = ref(false);
const submit = handleSubmit(handleFormSubmit);
quantity.value = 1;
watch(selectedProduct, (val) => {
  if (!val) return;
  product_id.value = val.id;
  product_variant_id.value = undefined;
  if (val.variants?.length === 1) product_variant_id.value = val.variants[0].id;
  if (!val.variants?.length) base_price.value = val.base_price;

  // Ensure the selected product is in the filteredProducts array for the autocomplete to display it
  if (!filteredProducts.value.find(p => p.id === val.id)) {
    filteredProducts.value = [val, ...filteredProducts.value];
  }
});
watch(product_variant_id, (val) => {
  if (!val) return;
  const variant = selectedProduct.value?.variants?.filter(
    (variant) => variant.id === val
  );
  if (!variant) return;
  base_price.value = variant[0].base_price;
});
watch(base_price, (val) => {
  if (!sideUpdate.value) {
    total.value = val * quantity.value;
  }
});
watch(quantity, (val) => {
  total.value = base_price.value * val;
});
watch(stock_movement, (val) => {
  if (val === "addition") reason.value = "purchase";
  if (val === "removal" && reason.value === "purchase")
    reason.value = undefined;
});

onMounted(async () => {
  if (props.product) {
    selectedProduct.value = props.product;
    // Add the selected product to filteredProducts so it shows in the autocomplete
    filteredProducts.value = [props.product];
    console.log(props.product);
  } else {
    // Load initial products when no product is pre-selected
    await fetchProducts("");
  }
});
</script>
