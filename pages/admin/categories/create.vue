<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Adicionar Categoria</h1>
        <p class="text-sm text-gray-500">Crie uma nova categoria para organizar o cardápio.</p>
      </div>
      <div class="flex items-center gap-3">
        <NuxtLink to="/admin/categories">
          <button class="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
            Cancelar
          </button>
        </NuxtLink>
        <button
          type="submit"
          form="create-category-form"
          :disabled="isSaving || !canSubmit"
          class="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary disabled:cursor-not-allowed disabled:opacity-50"
        >
          {{ isSaving ? "Salvando..." : "Salvar categoria" }}
        </button>
      </div>
    </div>

    <form id="create-category-form" @submit.prevent="saveCategory" class="max-w-3xl space-y-6">
      <div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm space-y-6">
        <div class="grid gap-6 md:grid-cols-2">
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700">
              Nome da categoria <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.name"
              type="text"
              required
              placeholder="Ex: Pratos principais"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700">Ordem de exibição</label>
            <input
              v-model.number="form.order"
              type="number"
              min="0"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-primary"
            />
            <p class="mt-1 text-xs text-gray-500">Defina a posição em que a categoria aparece no cardápio.</p>
          </div>
        </div>

        <div>
          <label class="mb-2 block text-sm font-medium text-gray-700">Descrição</label>
          <textarea
            v-model="form.description"
            rows="4"
            placeholder="Descreva a categoria para facilitar o entendimento da equipe."
            class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-primary"
          ></textarea>
        </div>

        <p class="text-xs text-gray-400">Slug gerado automaticamente: {{ slugSuggestion || "-" }}</p>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";

definePageMeta({
  layout: "admin",
});

const auth = useAuth();
const { user } = auth;
const { getCurrentUser } = auth;
const toast = useToast();

const isSaving = ref(false);

const form = reactive({
  name: "",
  description: "",
  order: 0,
});

const toSlug = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const slugSuggestion = computed(() => toSlug(form.name));

const canSubmit = computed(() => Boolean(form.name.trim()));

const saveCategory = async () => {
  if (!canSubmit.value) {
    toast.add({ color: "warning", title: "Informe o nome da categoria" });
    return;
  }

  const companyId = user.value?.company?.id;
  if (!companyId) {
    toast.add({ color: "error", title: "Empresa não encontrada" });
    return;
  }

  const slug = slugSuggestion.value;
  if (!slug) {
    toast.add({ color: "warning", title: "Informe um nome válido" });
    return;
  }

  const order = Number.isFinite(form.order) ? form.order : 0;

  isSaving.value = true;
  try {
    await $fetch("/api/categories", {
      method: "POST",
      body: {
        name: form.name.trim(),
        slug,
        description: form.description.trim() || null,
        companyId,
        order,
      },
    });
    toast.add({ color: "success", title: "Categoria criada com sucesso" });
    await navigateTo("/admin/categories");
  } catch (error) {
    console.error("Error creating category:", error);
    toast.add({ color: "error", title: "Erro ao criar categoria" });
  } finally {
    isSaving.value = false;
  }
};

onMounted(async () => {
  if (!user.value?.company?.id) {
    await getCurrentUser();
  }
});
</script>
