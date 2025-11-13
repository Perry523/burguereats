<template>
  <form class="flex flex-col gap-3" @submit="submit">
    <input-base v-model="name" :error="errors['name']" label="Nome" />
    <!-- <input-base
      v-model="description"
      :error="errors['description']"
      label="Descrição"
    /> -->

    <div class="flex flex-col sm:flex-row gap-4">
      <input-base
        :error="errors['total']"
        v-model="total"
        label="Valor"
        isCurrency
      />
      <!-- <input-base
        :error="errors['type']"
        v-model="type"
        :options="[
          { label: 'Entrada', value: 'profit' },
          { label: 'Saída', value: 'loss' }
        ]"
        label="Tipo"
      /> -->
    </div>
    <input-base
      v-model="notes"
      :error="errors['notes']"
      label="Observações"
      type="textarea"
    />
    <base-button :loading="loading" class="w-full mt-4 mb-2"
      >Salvar</base-button
    >
  </form>
</template>

<script setup lang="ts">
import { useForm } from "vee-validate";
import * as yup from "yup";

defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["submit"]);

const validationSchema = yup.object().shape({
  name: yup.string().required("O nome é obrigatório"),
  total: yup
    .number()
    .required("O valor é obrigatório")
    .min(0, "O valor deve ser maior ou igual a zero"),
  type: yup
    .string()
    .required("O tipo é obrigatório")
    .oneOf(["profit", "loss"], "Tipo inválido"),
  notes: yup.string().nullable(),
});

const { handleSubmit, defineField, errors } = useForm({
  validationSchema,
});

const [name] = defineField("name");
const [total] = defineField("total");
const [type] = defineField("type");
const [notes] = defineField("notes");
type.value = "loss";
function handleFormSubmit(values: object) {
  emit("submit", {
    ...values,
    category: "bill",
  });
}

const submit = handleSubmit(handleFormSubmit);
</script>
