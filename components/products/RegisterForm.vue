<template>
  <form class="flex flex-col gap-2 sm:gap-4" @submit="submit">
    <input-base v-model="name" :error="errors['name']" label="Nome" />

    <div v-if="!hasVariants" class="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start">
      <input-base is-currency :error="errors['buy_price']" v-model="buy_price" label="Preço de Compra" />
      <input-base is-currency :error="errors['sell_price']" v-model="sell_price" label="Preço de Venda" />
      <input-base type="number" :disabled="!props.product" :readonly="!!props.product" v-model="quantity"
        :error="errors['quantity']" label="Quantidade no estoque">
        <template #append>
          <PencilSquareIcon v-if="!!props.product" @click="emit('editQuantity')"
            class="!h-[39px] p-2 !w-[39px] min-h-0 btn btn-primary absolute inset-y-0 right-0" />
        </template>
      </input-base>
    </div>

    <div class="flex flex-col gap-2">
      <label class="text-sm font-medium text-gray-700">Categoria</label>
      <select v-model="category_id" class="select select-bordered w-full" :class="{ 'select-error': errors['category_id'] }">
        <option :value="null">Selecione uma categoria</option>
        <option v-for="category in categories" :key="category.id" :value="category.id">
          {{ category.name }}
        </option>
      </select>
      <span v-if="errors['category_id']" class="text-error text-xs">{{ errors['category_id'] }}</span>
    </div>

    <input-base v-model="description" type="textarea" rows="2" :error="errors['description']" label="Descrição"
      placeholder="Descrição do produto" />
    <div class="flex items-center justify-between gap-2 sm:gap-4">
      <div class="flex items-center gap-2">
        <input type="checkbox" v-model="hasVariants" />
        <div class="text-sm sm:text-base">Produto com variantes</div>
      </div>
      <button v-if="hasVariants" type="button" class="btn btn-primary btn-sm" @click="addVariant">
        Nova variante
      </button>
    </div>
    <div v-if="hasVariants" class="flex flex-col gap-2 sm:gap-4">
      <div v-for="(variant, index) in variants" :key="index" class="grid grid-cols-12 items-end gap-2">
        <input-base v-model="variant.name" :error="!variant.name.length && errors[`variants`] ? errors[`variants`] : ''
          " label="Variante" placeholder="Ex: Cor, Tamanho, etc." class="col-span-12 sm:col-span-4" />
        <input-base v-model="variant.base_price" is-currency :error="errors[`variants.${index}.base_price`]"
          label="Preço" class="col-span-6 sm:col-span-2" input-classes="px-2" />
        <input-base v-model="variant.additional_price" is-currency :error="errors[`variants.${index}.additional_price`]"
          class="col-span-6 sm:col-span-2" input-classes="px-2">
          <template #label>
            Adicional
            <div class="tooltip tooltip-top"
              data-tip="Taxa adicional que o cliente pagará ao escolher esse produto no serviço">
              <QuestionMarkCircleIcon class="w-4 -mb-[2px] ml-auto" />
            </div>
          </template>
        </input-base>
        <input-base type="number" disabled class="col-span-6 sm:col-span-2" v-model="variant.quantity"
          :error="errors[`variants.${index}.quantity`]" label="Quantidade" />
        <div class="col-span-3 sm:col-span-1">
          <div class="text-sm mb-2 ml-2">Ativo</div>
          <input type="checkbox" class="toggle toggle-primary" v-model="variant.is_active"
            :error="errors[`variants.${index}.quantity`]" />
        </div>
        <div>
          <div class="sm:hidden text-sm mb-1">Remover</div>
          <button type="button" class="btn btn-error self-end mb-1 btn-sm btn-circle ml-3"
            @click="removeVariant(index)">
            <TrashIcon class="w-4" />
          </button>
        </div>
      </div>
    </div>
    <base-button :loading class="btn btn-primary w-full mt-4">Salvar</base-button>
  </form>
</template>

<script setup lang="ts">
import { useForm } from "vee-validate";
import * as yup from "yup";
import { QuestionMarkCircleIcon, TrashIcon, PencilSquareIcon } from "@heroicons/vue/24/solid";

const props = defineProps({
  product: {
    type: Object as () => Product,
    required: false,
  },
  loading: {
    type: Boolean,
    default: false
  }
});

interface Variant {
  name: string;
  additional_price: number;
  base_price: number;
  quantity: number;
  is_active: boolean;
}

interface ProductForm {
  name: string;
  buy_price: number;
  sell_price: number;
  category_id: string | null;
  quantity: number;
  description: string;
  variants: Variant[];
  hasVariants: boolean;
}

const emit = defineEmits(["submit", "editQuantity"]);

function addVariant() {
  variants.value.push({
    name: "",
    additional_price: 0,
    base_price: 0,
    quantity: 0,
    is_active: true,
  });
}

function removeVariant(index: number) {
  variants.value.splice(index, 1);
}

const validationSchema = yup.object().shape({
  name: yup.string().required("O nome do produto é obrigatório"),
  buy_price: yup.number().min(0, "O preço deve ser maior ou igual a zero"),
  sell_price: yup.number().when("hasVariants", {
    is: false,
    then: (schema) => schema.required("O preço de venda é obrigatório"),
    otherwise: (schema) =>
      schema.min(0, "O preço deve ser maior ou igual a zero"),
  }),
  category_id: yup.string().nullable(),
  quantity: yup.number().when("hasVariants", {
    is: false,
    then: (schema) => schema.required("O preço base é obrigatório"),
    otherwise: (schema) =>
      schema.min(0, "O preço deve ser maior ou igual a zero"),
  }),
  description: yup.string().nullable(),
  hasVariants: yup.boolean(),
  variants: yup.array().of(
    yup.object().shape({
      name: yup.string().required("O nome da variante é obrigatório"),
      additional_price: yup
        .number()
        .required("O preço adicional é obrigatório")
        .min(0, "O preço deve ser maior ou igual a zero"),
      base_price: yup
        .number()
        .required("O preço adicional é obrigatório")
        .min(0, "O preço deve ser maior ou igual a zero"),
      quantity: yup
        .number()
        .required("A quantidade é obrigatória")
        .min(0, "A quantidade deve ser maior ou igual a zero"),
      is_active: yup.boolean(),
    })
  ),
});

const { handleSubmit, defineField, errors } = useForm<ProductForm>({
  validationSchema,
  initialValues: {
    variants: [] as Variant[],
    name: props.product?.name || "",
    buy_price: props.product?.buy_price || 0,
    sell_price: props.product?.sell_price || 0,
    category_id: props.product?.category_id || null,
    description: props.product?.description || "",
    hasVariants: !!props.product?.variants?.length,
    quantity: props.product?.quantity || 0,
  },
});

const [name] = defineField("name");
const [buy_price] = defineField("buy_price");
const [sell_price] = defineField("sell_price");
const [category_id] = defineField("category_id");
const [quantity] = defineField("quantity");
const [description] = defineField("description");
const [variants] = defineField("variants");
const [hasVariants] = defineField("hasVariants");
function handleFormSubmit(values: object) {
  emit("submit", { ...values, variants: variants.value });
}

const submit = handleSubmit(handleFormSubmit);

watch(hasVariants, (val) => {
  if (val && !variants.value.length) {
    addVariant();
  } else {
    variants.value = [];
  }
});

const categories = ref([]);
const { user } = useAuthStore();

onMounted(async () => {
  if (user?.company?.id) {
    try {
      const { data } = await useFetch<any>(`/api/categories?companyId=${user.company.id}`);
      if (data.value?.data) {
        categories.value = data.value.data;
      }
    } catch (e) {
      console.error("Failed to fetch categories", e);
    }
  }
});
</script>
