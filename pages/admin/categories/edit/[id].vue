<template>
  <div class="space-y-6">
    <div v-if="isLoading" class="space-y-4">
      <div class="h-8 w-1/3 rounded-lg bg-gray-200 animate-pulse"></div>
      <div class="h-40 w-full rounded-lg bg-gray-100 animate-pulse"></div>
    </div>

    <template v-else>
      <div v-if="category" class="space-y-6">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Editar Categoria</h1>
            <p class="text-sm text-gray-500">Atualize as informações da categoria selecionada.</p>
          </div>
          <div class="flex flex-wrap items-center gap-3">
            <NuxtLink to="/admin/categories">
              <button class="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
                Cancelar
              </button>
            </NuxtLink>
            <button
              type="submit"
              form="edit-category-form"
              :disabled="isSaving || !canSubmit"
              class="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary disabled:cursor-not-allowed disabled:opacity-50"
            >
              {{ isSaving ? "Salvando..." : "Atualizar categoria" }}
            </button>
          </div>
        </div>

        <form id="edit-category-form" @submit.prevent="saveCategory" class="max-w-3xl space-y-6">
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
                class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-primary"
              ></textarea>
            </div>

            <p class="text-xs text-gray-400">Slug gerado automaticamente: {{ slugSuggestion || "-" }}</p>

            <div class="flex items-center justify-between border-t pt-6">
              <span class="text-xs text-gray-400">Atualizado em {{ formatDate(category.updatedAt) }}</span>
              <button
                type="button"
                class="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                @click="deleteCategory"
              >
                Remover categoria
              </button>
            </div>
          </div>
        </form>
      </div>

      <div v-else class="py-12 text-center">
        <p class="text-gray-500">Categoria não encontrada</p>
        <NuxtLink to="/admin/categories">
          <button class="mt-4 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
            Voltar para lista
          </button>
        </NuxtLink>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";

definePageMeta({
  layout: "admin",
});

interface CategoryRecord {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  order: number;
  companyId: string;
  createdAt: string;
  updatedAt: string;
}

const route = useRoute();
const categoryId = route.params.id as string;

const auth = useAuth();
const { user } = auth;
const { getCurrentUser } = auth;
const toast = useToast();

const category = ref<CategoryRecord | null>(null);
const isLoading = ref(true);
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

const formatDate = (value: string) => {
  const date = new Date(value);
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

const fetchCategory = async () => {
  isLoading.value = true;
  try {
    const response = await $fetch<{ success: boolean; data?: CategoryRecord }>(`/api/categories/${categoryId}`);
    if (response.success && response.data) {
      category.value = response.data;
      form.name = response.data.name;
      form.description = response.data.description ?? "";
      form.order = Number.isFinite(response.data.order) ? response.data.order : 0;
    } else {
      category.value = null;
    }
  } catch (error) {
    console.error("Error fetching category:", error);
    category.value = null;
  } finally {
    isLoading.value = false;
  }
};

const saveCategory = async () => {
  if (!canSubmit.value) {
    toast.add({ color: "warning", title: "Informe o nome da categoria" });
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
    await $fetch(`/api/categories/${categoryId}`, {
      method: "PUT",
      body: {
        name: form.name.trim(),
        slug,
        description: form.description.trim() || null,
        order,
      },
    });
    toast.add({ color: "success", title: "Categoria atualizada" });
    await navigateTo("/admin/categories");
  } catch (error) {
    console.error("Error updating category:", error);
    toast.add({ color: "error", title: "Erro ao atualizar categoria" });
  } finally {
    isSaving.value = false;
  }
};

const deleteCategory = async () => {
  if (!category.value) {
    return;
  }
  if (!confirm("Tem certeza que deseja remover esta categoria?")) {
    return;
  }

  try {
    await $fetch(`/api/categories/${categoryId}`, { method: "DELETE" });
    toast.add({ color: "success", title: "Categoria removida" });
    await navigateTo("/admin/categories");
  } catch (error) {
    console.error("Error deleting category:", error);
    toast.add({ color: "error", title: "Erro ao remover categoria" });
  }
};

onMounted(async () => {
  if (!user.value?.company?.id) {
    await getCurrentUser();
  }
  await fetchCategory();
});
</script>
