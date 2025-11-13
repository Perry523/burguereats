<template>
  <form class="flex flex-col gap-3" @submit="submit">
    <input-base
      v-model="name"
      :error="errors['name']"
      label="Nome Completo"
      placeholder="Seu nome completo"
    />
    <input-base
      v-model="email"
      :error="errors['email']"
      label="Email"
      placeholder="seu@email.com"
      type="email"
    />
    <input-base
      v-model="instagram_link"
      :error="errors['instagram_link']"
      label="Link do Instagram (opcional)"
      placeholder="https://instagram.com/seuusuario"
    />

    <div class="flex gap-3">
      <input-base
        :error="errors['password']"
        v-model="password"
        name="password"
        label="Senha"
        type="password"
        placeholder="Mínimo 8 caracteres"
      />
      <input-base
        :error="errors['password_confirmation']"
        v-model="password_confirmation"
        name="password_confirmation"
        label="Confirmar senha"
        type="password"
        placeholder="Confirme sua senha"
      />
    </div>

    <base-button :loading="loading" class="w-full my-5 text-lg"
      >Criar conta</base-button
    >
    <div class="text-center">
      <div class="mb-3">
        Já possui uma conta?
        <nuxt-link to="/login" class="text-primary">Faça login</nuxt-link>
      </div>
    </div>
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
  email: yup
    .string()
    .required("O email é obrigatório")
    .email("O email deve ser válido"),
  instagram_link: yup
    .string()
    .nullable()
    .url("Link do Instagram deve ser uma URL válida")
    .matches(
      /^https?:\/\/(www\.)?instagram\.com\/[a-zA-Z0-9_.]+\/?$/,
      "Link deve ser do Instagram (ex: https://instagram.com/usuario)"
    ),
  password: yup
    .string()
    .required("A senha é obrigatória")
    .min(8, "A senha deve ter no mínimo 8 caracteres"),
  password_confirmation: yup
    .string()
    .required("Campo obrigatório")
    .oneOf([yup.ref("password")], "As senhas não coincidem"),
});

const { handleSubmit, defineField, errors } = useForm({
  validationSchema,
});

const [name] = defineField("name");
const [email] = defineField("email");
const [instagram_link] = defineField("instagram_link");
const [password] = defineField("password");
const [password_confirmation] = defineField("password_confirmation");

function handleFormSubmit(values: Record<string, unknown>) {
  emit("submit", values);
}

const submit = handleSubmit(handleFormSubmit);
</script>
