<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Editar Entregador</h1>
        <p class="text-sm text-gray-500">Atualize os dados do entregador (biker)</p>
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
          form="edit-biker-form"
          :disabled="isSaving"
          class="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
        >
          {{ isSaving ? "Salvando..." : "Salvar alterações" }}
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div
      v-if="isLoadingBiker"
      class="flex items-center justify-center py-16"
    >
      <UIcon
        name="i-heroicons-arrow-path"
        class="w-8 h-8 animate-spin text-primary"
      />
    </div>

    <form
      v-else
      id="edit-biker-form"
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
            v-maska
            data-maska="(##) #####-####"
            type="text"
            placeholder="(00) 00000-0000"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Chave PIX
          </label>
          <input
            v-model="form.pix_key"
            type="text"
            placeholder="CPF, Email, Telefone ou Chave Aleatória"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Nova Senha <span class="text-gray-400 text-xs">(Deixe em branco para não alterar)</span>
          </label>
          <input
            v-model="form.password"
            type="password"
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

const route = useRoute();
const auth = useAuthStore();
const { user } = storeToRefs(auth);
const toast = useToast();

const isSaving = ref(false);
const isLoadingBiker = ref(true);
const bikerId = computed(() => route.params.id as string);

const form = reactive({
  name: "",
  email: "",
  phone: "",
  password: "",
  pix_key: "",
});

const loadBiker = async () => {
  try {
    const response = await $fetch<{ success: boolean; data: any }>(
      `/api/bikers/${bikerId.value}`,
    );
    if (response?.success && response.data) {
      form.name = response.data.name || "";
      form.email = response.data.email || "";
      form.phone = response.data.phone || "";
      form.pix_key = response.data.pix_key || "";
    } else {
      toast.add({ color: "error", title: "Entregador não encontrado" });
      navigateTo("/admin/bikers");
    }
  } catch (error) {
    console.error("Error loading biker:", error);
    toast.add({ color: "error", title: "Erro ao carregar entregador" });
    navigateTo("/admin/bikers");
  } finally {
    isLoadingBiker.value = false;
  }
};

const saveBiker = async () => {
  isSaving.value = true;
  try {
    const payload: any = {
      name: form.name,
      email: form.email,
      phone: form.phone.replace(/\D/g, ""),
      pix_key: form.pix_key,
    };
    if (form.password) {
      payload.password = form.password;
    }

    await $fetch(`/api/bikers/${bikerId.value}`, {
      method: "PUT",
      body: payload,
    });

    toast.add({ color: "success", title: "Entregador atualizado com sucesso" });
    await navigateTo("/admin/bikers");
  } catch (error: any) {
    console.error("Error updating biker:", error);
    toast.add({
      color: "error",
      title: "Erro ao atualizar entregador",
      description: error.data?.statusMessage || "Tente novamente em instantes",
    });
  } finally {
    isSaving.value = false;
  }
};

onMounted(async () => {
  if (!user.value?.company?.id && user.value?.role !== "admin") {
    await auth.getCurrentUser();
  }
  await loadBiker();
});
</script>
