<template>
  <form class="flex flex-col gap-3" @submit="submit">
    <input-base v-model="name" :error="errors['name']" label="Nome" />
    <input-base
      v-model="description"
      :error="errors['description']"
      label="Descrição"
    />
    <div class="flex flex-col sm:flex-row gap-4">
      <input-base
        :error="errors['price']"
        v-model="price"
        label="Preço"
        isCurrency
      />
      <input-base
        :error="errors['duration']"
        v-model="duration"
        v-maska
        data-maska="####"
        label="Duração"
      >
        <template #append>
          <div class="absolute inset-y-0 right-0 flex items-center text-black">
            <div class="mr-2">minutos</div>
          </div>
        </template>
      </input-base>
    </div>
    <div class="flex items-center justify-between gap-2 sm:gap-4">
      <div class="flex items-center gap-2">
        <!-- <input type="checkbox" v-model="hasProduct" /> -->
        <div class="text-sm sm:text-base">Vincular produtos</div>
      </div>
      <button
        v-if="hasProduct"
        type="button"
        class="btn btn-primary btn-sm"
        @click="addProduct"
      >
        <PlusIcon class="w-4" />
      </button>
    </div>
    <div v-if="hasProduct" class="flex flex-col gap-2 sm:gap-4">
      <div
        v-for="(product, index) in products"
        :key="index"
        class="flex items-end gap-2"
      >
        <autocomplete
          v-model="products[index]"
          :options="filteredProducts"
          option-label="name"
          option-value="id"
          label="Produto"
          class="flex-1"
          :loading="loadingProducts"
          @input="
            ($event) => {
              loadingProducts = true;
              useDelay(async () => await fetchProducts($event), 500);
            }
          "
          @create="isOpened = true"
        />
        <div class="mx-auto">
          <div class="sm:hidden text-sm mb-1">Remover</div>
          <button
            type="button"
            class="btn btn-error self-end mb-1 btn-sm btn-circle ml-2"
            @click="removeProduct(index)"
          >
            <TrashIcon class="w-4" />
          </button>
        </div>
      </div>
    </div>
    <base-button :loading="loading" class="w-full mt-4 mb-2"
      >Salvar</base-button
    >
  </form>

  <base-dialog v-model="isOpened" title="Cadastrar novo produto">
    <products-register-form v-if="isOpened" @submit="handleProductCreate" />
  </base-dialog>
</template>

<script setup lang="ts">
import { useForm } from "vee-validate";
import * as yup from "yup";
import { type Service } from "@/models/services";
import { api } from "~/server/api";
import { PlusIcon, TrashIcon } from "@heroicons/vue/24/solid";

const props = defineProps({
  service: {
    type: Object as () => Service,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["submit"]);

const validationSchema = yup.object().shape({
  name: yup.string().required("O nome do serviço é obrigatório"),
  description: yup.string().required("A descrição do serviço é obrigatória"),
  price: yup
    .string()
    .required("O preço do serviço é obrigatório")
    .min(0, "O preço deve ser maior ou igual a zero"),
  duration: yup
    .number()
    .required("A duração do serviço é obrigatória")
    .min(1, "A duração deve ser maior que zero")
    .integer("A duração deve ser um número inteiro"),
  products: yup.array().of(
    yup.object().shape({
      name: yup.string().required("O nome da variante é obrigatório"),
    })
  ),
});

const { handleSubmit, defineField, errors } = useForm({
  validationSchema,
  initialValues: { products: [], ...props.service },
});

const loadingProducts = ref(false);
const isOpened = ref(false);
const filteredProducts = ref([]);
const hasProduct = ref(true);

const [name] = defineField("name");
const [description] = defineField("description");
const [price] = defineField("price");
const [duration] = defineField("duration");
const [products] = defineField("products");

async function fetchProducts(query: string) {
  try {
    loadingProducts.value = true;
    const response = await api(`/products-filter`, {
      params: { search: query },
    });
    filteredProducts.value = response.data;
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
  } finally {
    loadingProducts.value = false;
  }
}

function handleFormSubmit(values: Service) {
  emit("submit", { ...values, products: products.value });
}

function removeProduct(index: number) {
  products.value.splice(index, 1);
}

function addProduct() {
  products.value.push({} as never);
}

async function handleProductCreate(values: Product) {
  try {
    await api.post("/products", values);
    isOpened.value = false;
  } catch (error) {
    console.error("Erro ao criar produto:", error);
  }
}
// @ts-expect-error: handleFormSubmit is a function
const submit = handleSubmit(handleFormSubmit);

watch(hasProduct, (val) => {
  if (val && !products.value.length) {
    addProduct();
  } else {
    products.value = [];
  }
});
</script>
