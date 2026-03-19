<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Adicionar Entregador</h1>
        <p class="text-sm text-gray-500">Crie um novo registro de entregador (biker)</p>
      </div>
      <div class="flex items-center gap-3">
        <NuxtLink to="/admin/bikers">
          <button
            type="button"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancelar
          </button>
        </NuxtLink>
        <button
          type="submit"
          form="create-biker-form"
          :disabled="isSaving"
          class="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
        >
          {{ isSaving ? "Salvando..." : "Salvar entregador" }}
        </button>
      </div>
    </div>

    <form
      id="create-biker-form"
      @submit.prevent="saveBiker"
      class="max-w-2xl bg-white rounded-lg border border-gray-200 p-6 space-y-6"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Nome completo <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.name"
            type="text"
            required
            placeholder="Ex: Pedro Santos"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Email <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.email"
            type="email"
            required
            placeholder="entregador@exemplo.com"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Telefone
          </label>
          <input
            v-model="form.phone"
            type="text"
            placeholder="(00) 00000-0000"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Senha <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.password"
            type="password"
            required
            minlength="6"
            placeholder="Mínimo 6 caracteres"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";

definePageMeta({
  layout: "admin",
});

const auth = useAuthStore();
const { user } = storeToRefs(auth);
const toast = useToast();

const isSaving = ref(false);

const form = reactive({
  name: "",
  email: "",
  phone: "",
  password: "",
});

const saveBiker = async () => {
  const companyId = user.value?.company?.id;
  if (!companyId) {
    toast.add({ color: "error", title: "Empresa não encontrada" });
    return;
  }

  isSaving.value = true;
  try {
    const payload = {
      ...form,
      companyId,
    };

    await $fetch("/api/bikers", {
      method: "POST",
      body: payload,
    });

    toast.add({ color: "success", title: "Entregador criado com sucesso" });
    await navigateTo("/admin/bikers");
  } catch (error: any) {
    console.error("Error saving biker:", error);
    toast.add({
      color: "error",
      title: "Erro ao criar entregador",
      description: error.data?.statusMessage || "Tente novamente em instantes",
    });
  } finally {
    isSaving.value = false;
  }
};

onMounted(async () => {
  if (!user.value?.company?.id) {
    await auth.getCurrentUser();
  }
});
</script>
