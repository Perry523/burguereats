<template>
  <form @submit.prevent="submit">
    <div class="flex flex-col space-y-4">
      <input-base :error="errors['name']" v-bind="name" label="Nome" />
      <div class="flex flex-col sm:flex-row gap-4">
        <input-base
          :error="errors['phone']"
          v-bind="phone"
          label="Telefone"
          v-maska
          data-maska="(##) #####-####"
        />
        <input-base :error="errors['pix']" v-bind="pix" label="Chave pix" />
      </div>
      <input-base :error="errors['email']" v-bind="email" label="Email" />
      <input-base
        type="password"
        :error="errors['password']"
        v-bind="password"
        label="Senha"
      />

      <div class="flex flex-col justify-center sm:flex-row gap-4">
        <input-base
          :error="errors['commission']"
          v-bind="commission"
          v-maska
          data-maska="###%"
          data-maska-reversed
          label="Comissão"
        />

        <div :class="`form-control`">
          <label class="text-sm whitespace-nowrap">Usuário ativo</label>
          <input
            v-bind="active"
            type="checkbox"
            class="toggle mx-auto bg-red-500 hover:bg-red-500 toggle-error checked:toggle-success mt-3"
          />
        </div>
      </div>
    </div>
    <base-button :loading class="w-full mt-4 mb-2">Salvar</base-button>
  </form>
</template>

<script setup lang="ts">
import { type Employees } from "@/models/employees";
import { useForm } from "vee-validate";
import * as yup from "yup";
const emit = defineEmits(["submit"]);
const props = defineProps(["data", "selectedType", "loading"]);
const validation = {
  name: yup.string().required("O nome é obrigatório"),
  phone: yup.string().required("O telefone é obrigatório"),
  pix: yup.string().required("Chave pix é obrigatória"),
  email: yup
    .string()
    .required("O email é obrigatório")
    .email("O email deve ser válido"),
  password: yup
    .string()
    .required("Campo obrigatório")
    .min(8, "A senha deve ter no mínimo 8 caracteres"),
  commission: yup.string().required("A comissão é obrigatória"),
  checkbox: yup.boolean(),

  // eslint-disable-next-line
} as any;

const validationSchema = yup.object().shape(validation);
const { handleSubmit, defineInputBinds, errors } = useForm<Employees>({
  validationSchema,
  initialValues: props.data,
});
const name = defineInputBinds("name");
const password = defineInputBinds("password");
const phone = defineInputBinds("phone");
const pix = defineInputBinds("pix");
const email = defineInputBinds("email");
const commission = defineInputBinds("commission");
const active = defineInputBinds("active");
const submit = handleSubmit((values: Employees) => {
  emit("submit", values);
});
</script>
```
