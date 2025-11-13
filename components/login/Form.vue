<template>
  <form class="flex flex-col gap-3" @submit="submit">
    <input-base v-bind="email" :error="errors['email']" label="Email" />
    <input-base
      :error="errors['password']"
      v-bind="password"
      label="Senha"
      type="password"
    />
    <div class="text-right text-orange-600">
      <nuxt-link to="/forgot-password">
        <span
          class="text-sm inline-block hover:text-orange-600 hover:underline hover:cursor-pointer transition duration-200"
        >
          Esqueceu sua senha?
        </span>
      </nuxt-link>
    </div>
    <base-button type="submit" class="mt-2 w-full" :loading="loading"
      >Login</base-button
    >
  </form>
</template>
<script setup lang="ts">
import * as yup from "yup";
import { useForm } from "vee-validate";
defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["submit"]);
const validationSchema = yup.object().shape({
  email: yup.string().required("O email é obrigatório").email("Email inválido"),
  password: yup.string().required("A senha é obrigatória"),
  // .min(3, "A senha deve ter no mínimo 3 caracteres"),
});
const { handleSubmit, defineInputBinds, errors } = useForm({
  validationSchema,
});
const email = defineInputBinds("email");
const password = defineInputBinds("password");
function handleFormSubmit(values: object) {
  emit("submit", values);
}
const submit = handleSubmit(handleFormSubmit);
</script>
