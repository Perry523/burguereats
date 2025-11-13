<template>
  <form class="flex flex-col gap-3" @submit="submit">
    <input-base
      :error="errors['date']"
      v-model="currentDate"
      label="Dia"
      type="date"
      input-classes="w-full"
    />
    <input-base
      :error="errors['startHour']"
      v-model="startHour"
      label="Horário inicial"
      data-maska="##:##"
      input-classes="w-full"
      :create-register="false"
    />
    <input-base
      :error="errors['endHour']"
      v-model="endHour"
      label="Horário final"
      data-maska="##:##"
      input-classes="w-full"
      :create-register="false"
    />
    <base-button :loading="loading" class="w-full mt-4 mb-2"
      >Bloquear horário</base-button
    >
  </form>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import { useForm } from "vee-validate";
import * as yup from "yup";

const props = defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  date: {
    type: String,
    required: false,
  },
});

const emit = defineEmits(["submit"]);

const validationSchema = yup.object().shape({
  date: yup.string().required("A data é obrigatória"),
  startHour: yup.string().required("O horário inicial é obrigatório"),
  endHour: yup
    .string()
    .required("O horário final é obrigatório")
    .test(
      "is-greater",
      "Horário final deve ser maior que o inicial",
      function (value) {
        if (!value || !this.parent.startHour) return true;
        return value > this.parent.startHour;
      }
    ),
});

const initialValue = {
  date: props.date ? dayjs(props.date).format("YYYY-MM-DD") : undefined,
  startHour: undefined,
  endHour: undefined,
};

const { handleSubmit, defineField, errors } = useForm({
  validationSchema,
  initialValues: initialValue,
});

const [currentDate] = defineField("date");
const [startHour] = defineField("startHour");
const [endHour] = defineField("endHour");

function handleFormSubmit(values: object) {
  emit("submit", values);
}

const submit = handleSubmit(handleFormSubmit);
</script>
