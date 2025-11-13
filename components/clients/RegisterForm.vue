<template>
  <!-- form que cadastra e edita usuarios -->
  <form @submit.prevent="submit">
    <div class="flex flex-col space-y-4">
      <input-base :error="errors['name']" v-model="name" label="Nome" />
      <input-base
        :error="errors['phone']"
        data-maska="(##) #####-####"
        v-model="phone"
        label="Telefone"
      />
      <input-base
        :error="errors['email']"
        v-model="email"
        label="Email (Opcional)"
      />
      <input-base
        :error="errors['password']"
        v-model="password"
        :label="data ? 'Alterar Senha' : 'Senha'"
        type="password"
        v-if="!data"
      />
      <input-base
        :error="errors['confirmPassword']"
        v-if="!data"
        v-model="confirmPassword"
        label="Confirmar Senha"
        type="password"
      />
    </div>
    <base-button :loading="loading" class="w-full mt-4 mb-2"
      >Salvar</base-button
    >
  </form>
</template>

<script setup lang="ts">
import * as yup from "yup";
import { useForm } from "vee-validate";
import { type User } from "@/models/user";
const emit = defineEmits(["submit"]);
const props = defineProps(["data", "selectedType", "loading"]);
const validation = {
  name: yup.string().required("O nome é obrigatório"),
  email: yup.string(),
  // .required("O email é obrigatório")
  // .email("O email deve ser válido"),
  phone: yup.string().required("O telefone é obrigatório"),
  password: yup
    .string()
    .required()
    .min(8, "A senha deve ter no mínimo 8 caracteres"),
  confirmPassword: yup
    .string()
    .required("A confirmação da senha é obrigatória")
    .oneOf([yup.ref("password")], "As senhas devem ser iguais"),
  // eslint-disable-next-line
} as any;
if (props.data) {
  validation.password = yup
    .string()
    .min(8, "A senha deve ter no mínimo 8 caracteres");
  validation.confirmPassword = undefined;
}
const validationSchema = yup.object().shape(validation);
const { handleSubmit, defineField, errors } = useForm({
  validationSchema,
  initialValues: props.data,
});
const [name] = defineField("name");
const [email] = defineField("email");
const [phone] = defineField("phone");
const [password] = defineField("password");
const [confirmPassword] = defineField("confirmPassword");
const submit = handleSubmit((values: User) => {
  emit("submit", values);
});
</script>
```
