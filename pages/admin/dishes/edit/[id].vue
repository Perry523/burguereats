<template>
  <div>
    <div v-if="isLoading" class="space-y-4">
      <div class="h-8 w-1/3 rounded-lg bg-gray-200 animate-pulse"></div>
      <div class="h-48 w-full rounded-lg bg-gray-200 animate-pulse"></div>
      <div class="h-6 w-1/2 rounded-lg bg-gray-200 animate-pulse"></div>
    </div>
    <div v-else-if="dish" class="space-y-6">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Editar Prato</h1>
          <p class="text-sm text-gray-500">Atualize as informações do prato</p>
        </div>
        <div class="flex items-center gap-3">
          <NuxtLink to="/admin/dishes">
            <button
              type="button"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
          </NuxtLink>
          <button
            type="submit"
            form="edit-dish-form"
            :disabled="isSaving"
            class="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary disabled:opacity-50"
          >
            {{ isSaving ? "Salvando..." : "Atualizar prato" }}
          </button>
        </div>
      </div>

      <form
        id="edit-dish-form"
        @submit.prevent="saveDish"
        class="grid grid-cols-1 gap-6 lg:grid-cols-3"
      >
        <div class="space-y-6 lg:col-span-1">
          <div class="rounded-lg border border-gray-200 bg-white p-6">
            <h2 class="mb-4 text-lg font-semibold text-gray-800">
              Imagem do prato
            </h2>
            <div v-if="imagePreview" class="space-y-4">
              <div
                class="relative aspect-square overflow-hidden rounded-lg bg-gray-100"
              >
                <img
                  :src="imagePreview"
                  alt="Pré-visualização"
                  class="h-full w-full object-cover"
                />
                <button
                  type="button"
                  @click="removeImage"
                  class="absolute right-2 top-2 rounded-full bg-red-500 p-2 text-white shadow-lg hover:bg-red-600"
                >
                  <svg
                    class="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div v-else>
              <label
                class="relative block aspect-square w-full cursor-pointer rounded-lg border-2 border-dashed border-gray-300 transition-colors hover:border-orange-400"
                @dragover.prevent="isDragging = true"
                @dragleave.prevent="isDragging = false"
                @drop.prevent="handleDrop"
                :class="{ 'border-orange-400 bg-orange-50': isDragging }"
              >
                <input
                  type="file"
                  accept="image/*"
                  @change="handleFileSelect"
                  class="hidden"
                />
                <div
                  class="absolute inset-0 flex flex-col items-center justify-center p-6 text-center"
                >
                  <svg
                    class="mb-3 h-12 w-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <p class="mb-1 text-sm font-medium text-gray-700">
                    Arraste uma imagem ou clique
                  </p>
                  <p class="text-xs text-gray-500">PNG, JPG, WEBP até 5MB</p>
                </div>
              </label>
            </div>
            <!-- <div class="mt-4">
              <label class="mb-2 block text-sm font-medium text-gray-700">Ou insira uma URL</label>
              <input
                v-model="form.imageUrl"
                type="url"
                placeholder="https://exemplo.com/imagem.jpg"
                class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-primary"
              />
            </div> -->
            <div
              v-if="imageError"
              class="mt-4 rounded-lg border border-red-200 bg-red-50 p-3"
            >
              <p class="text-sm text-red-600">{{ imageError }}</p>
            </div>
          </div>
        </div>

        <div class="space-y-6 lg:col-span-2">
          <div class="rounded-lg border border-gray-200 bg-white p-6">
            <h2 class="mb-4 text-lg font-semibold text-gray-800">
              Informações principais
            </h2>
            <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div class="md:col-span-2">
                <label class="mb-2 block text-sm font-medium text-gray-700">
                  Nome do prato <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="form.name"
                  type="text"
                  required
                  placeholder="Ex: Filé Mignon ao Molho Madeira"
                  class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label class="mb-2 block text-sm font-medium text-gray-700">
                  Preço <span class="text-red-500">*</span>
                </label>
                <Currency
                  v-model="form.price"
                  class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <div class="mt-4">
              <label class="mb-2 block text-sm font-medium text-gray-700"
                >Descrição</label
              >
              <textarea
                v-model="form.description"
                rows="3"
                placeholder="Descreva os ingredientes e o modo de preparo..."
                class="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-primary"
              ></textarea>
            </div>

            <div class="mt-4 flex items-center gap-3">
              <button
                type="button"
                @click="form.isAvailable = !form.isAvailable"
                :class="form.isAvailable ? 'bg-green-500' : 'bg-gray-300'"
                class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
              >
                <span
                  :class="form.isAvailable ? 'translate-x-6' : 'translate-x-1'"
                  class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                />
              </button>
              <span class="text-sm font-medium text-gray-700">
                {{ form.isAvailable ? "Disponível" : "Indisponível" }}
              </span>
            </div>
          </div>

          <div class="rounded-lg border border-gray-200 bg-white p-6">
            <h2 class="mb-4 text-lg font-semibold text-gray-800">Categorias</h2>
            <div class="space-y-4">
              <div>
                <label class="mb-2 block text-sm font-medium text-gray-700">
                  Categorias <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="categoryToAdd"
                  @change="handleCategorySelection"
                  :disabled="!availableCategoryOptions.length"
                  class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-primary"
                >
                  <option value="" disabled>Selecione uma categoria</option>
                  <option
                    v-for="option in availableCategoryOptions"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </option>
                </select>
                <p class="mt-1 text-xs text-gray-500">
                  {{
                    availableCategoryOptions.length
                      ? "Escolha uma categoria para adicionar"
                      : "Todas as categorias foram adicionadas"
                  }}
                </p>
              </div>

              <div
                v-if="selectedCategoryOptions.length"
                class="grid gap-3 sm:grid-cols-2"
              >
                <div
                  v-for="category in selectedCategoryOptions"
                  :key="`edit-selected-category-${category.value}`"
                  class="flex items-center justify-between gap-3 rounded-lg border border-orange-200 bg-orange-50 px-4 py-3"
                >
                  <span class="text-sm font-semibold text-orange-700">{{
                    category.label
                  }}</span>
                  <button
                    type="button"
                    @click="removeCategory(category.value)"
                    class="text-xs font-semibold text-primary hover:text-orange-700"
                  >
                    Remover
                  </button>
                </div>
              </div>
              <div
                v-else
                class="rounded-lg border border-dashed border-gray-200 px-4 py-3 text-sm text-gray-500"
              >
                Nenhuma categoria selecionada
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
    <div v-else class="py-12 text-center">
      <p class="text-gray-500">Prato não encontrado</p>
      <NuxtLink to="/admin/dishes">
        <button
          type="button"
          class="mt-4 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Voltar para lista
        </button>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  watch,
} from "vue";
import type { FetchError } from "ofetch";

definePageMeta({
  layout: "admin",
});

interface DishCategoryTag {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
}

interface DishSideCategory {
  id: string;
  name: string;
  description?: string | null;
  isRequired: boolean;
  maxSelections?: number | null;
  order: number;
}

interface DishRecord {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  category: string;
  image?: string | null;
  isAvailable: boolean;
  categories: DishCategoryTag[];
  sideCategories: DishSideCategory[];
  companyId: string;
}

interface CategoryOption {
  value: string;
  label: string;
  slug: string;
  order: number;
}

interface CategoryRecord {
  id: string;
  name: string;
  slug: string;
  order: number;
  description?: string | null;
}

const route = useRoute();
const auth = useAuth();
const { user } = auth;
const { getCurrentUser } = auth;
const toast = useToast();

const dishId = route.params.id as string;

const dish = ref<DishRecord | null>(null);
const categoryOptions = ref<CategoryOption[]>([]);
const isLoading = ref(true);
const isSaving = ref(false);
const imageFile = ref<File | null>(null);
const imagePreview = ref<string | null>(null);
const imageError = ref<string | null>(null);
const objectUrl = ref<string | null>(null);
const isDragging = ref(false);
const originalImageUrl = ref<string | null>(null);

const form = reactive({
  name: "",
  description: "",
  price: 0,
  categoryIds: [] as string[],
  sideCategoryIds: [] as string[],
  isAvailable: true,
  imageUrl: "",
});

const categoryToAdd = ref("");
const selectedCategoryOptions = computed(() =>
  form.categoryIds
    .map((id) => categoryOptions.value.find((option) => option.value === id))
    .filter((option): option is CategoryOption => Boolean(option))
);
const availableCategoryOptions = computed(() =>
  categoryOptions.value.filter(
    (option) => !form.categoryIds.includes(option.value)
  )
);

const removeCategory = (value: string) => {
  form.categoryIds = form.categoryIds.filter((id) => id !== value);
};

const handleCategorySelection = () => {
  const value = categoryToAdd.value;
  if (!value) {
    return;
  }
  form.categoryIds = uniqueArray([...form.categoryIds, value]);
  categoryToAdd.value = "";
};

const uniqueArray = (values: string[]) =>
  Array.from(
    new Set(values.filter((value) => typeof value === "string" && value))
  );

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    processFile(target.files[0]);
  }
  isDragging.value = false;
};

const handleDrop = (event: DragEvent) => {
  isDragging.value = false;
  if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
    processFile(event.dataTransfer.files[0]);
  }
};

const processFile = (file: File) => {
  if (!file.type.startsWith("image/")) {
    imageError.value = "Por favor, selecione apenas arquivos de imagem.";
    imageFile.value = null;
    return;
  }
  if (file.size > 5 * 1024 * 1024) {
    imageError.value = "A imagem deve ter no máximo 5MB.";
    imageFile.value = null;
    return;
  }
  imageError.value = null;
  imageFile.value = file;
  form.imageUrl = "";
};

const removeImage = () => {
  imageFile.value = null;
  form.imageUrl = "";
  imageError.value = null;
  if (objectUrl.value) {
    URL.revokeObjectURL(objectUrl.value);
    objectUrl.value = null;
  }
  imagePreview.value = null;
};

const updatePreview = () => {
  if (objectUrl.value) {
    URL.revokeObjectURL(objectUrl.value);
    objectUrl.value = null;
  }
  if (imageFile.value) {
    objectUrl.value = URL.createObjectURL(imageFile.value);
    imagePreview.value = objectUrl.value;
    return;
  }
  const manualUrl = form.imageUrl.trim();
  imagePreview.value = manualUrl ? manualUrl : null;
};

watch(imageFile, updatePreview);
watch(() => form.imageUrl, updatePreview);

onBeforeUnmount(() => {
  if (objectUrl.value) {
    URL.revokeObjectURL(objectUrl.value);
  }
});

const formatCategoryLabel = (slug: string) =>
  slug
    .split("-")
    .filter((segment) => segment.length)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");

const loadCategories = async (
  companyId: string,
  fallback?: DishRecord | null
) => {
  try {
    const response = await $fetch<{
      success: boolean;
      data?: CategoryRecord[];
    }>(`/api/categories?companyId=${companyId}`);
    const fetched = Array.isArray(response?.data) ? response.data : [];

    const optionMap = new Map<string, CategoryOption>();

    for (const record of fetched) {
      optionMap.set(record.id, {
        value: record.id,
        label: record.name || formatCategoryLabel(record.slug),
        slug: record.slug,
        order: typeof record.order === "number" ? record.order : 0,
      });
    }

    if (fallback?.categories?.length) {
      for (const category of fallback.categories) {
        const identifier = category.id;
        if (!identifier || optionMap.has(identifier)) {
          continue;
        }
        const slug = category.slug;
        if (!slug) {
          continue;
        }
        optionMap.set(identifier, {
          value: identifier,
          label: category.name || formatCategoryLabel(slug),
          slug,
          order: Number.MAX_SAFE_INTEGER,
        });
      }
    }

    const options = Array.from(optionMap.values()).sort(
      (a, b) => a.order - b.order || a.label.localeCompare(b.label)
    );
    categoryOptions.value = options;

    const validSelection = uniqueArray(
      form.categoryIds.filter((id) => optionMap.has(id))
    );
    if (validSelection.length !== form.categoryIds.length) {
      form.categoryIds = validSelection;
    }
  } catch (error) {
    console.error("Error loading categories:", error);
    categoryOptions.value = [];
    form.categoryIds = [];
  }
};

const fetchDish = async () => {
  try {
    const response = await $fetch<{ success: boolean; data?: DishRecord }>(
      `/api/dishes/${dishId}`
    );
    if (response.success && response.data) {
      dish.value = response.data;
      form.name = response.data.name;
      form.description = response.data.description ?? "";
      form.price = Number(response.data.price);
      form.categoryIds = uniqueArray(
        (response.data.categories || [])
          .filter((c) => Boolean(c))
          .map((category) => category.id)
          .filter((value): value is string => typeof value === "string")
      );
      form.sideCategoryIds = uniqueArray(
        (response.data.sideCategories || [])
          .filter((c) => Boolean(c))
          .map((category) => category.id)
          .filter((value): value is string => typeof value === "string")
      );
      form.isAvailable = response.data.isAvailable;
      originalImageUrl.value = response.data.image ?? null;
      form.imageUrl = response.data.image ?? "";
      return response.data;
    }
    dish.value = null;
    return null;
  } catch (error) {
    console.error("Error fetching dish:", error);
    dish.value = null;
    return null;
  }
};

const resolveCategorySlug = (id: string) =>
  categoryOptions.value.find((option) => option.value === id)?.slug ??
  dish.value?.categories.find((category) => category.id === id)?.slug ??
  "";

const uploadDishImage = async (companyId: string) => {
  if (!imageFile.value) {
    return null;
  }
  try {
    imageError.value = null;
    const formData = new FormData();
    formData.append("file", imageFile.value);
    formData.append("companyId", companyId);
    formData.append("name", form.name.trim() || "prato");
    const response = await $fetch<{
      success?: boolean;
      data?: { url?: string };
    }>("/api/uploads/dish-image", {
      method: "POST",
      body: formData,
    });
    const imageUrl = response?.data?.url;
    if (typeof imageUrl !== "string" || !imageUrl.trim()) {
      throw new Error("Não foi possível obter a URL da imagem");
    }
    return imageUrl;
  } catch (error) {
    const fetchError = error as FetchError<{ message?: string }>;
    imageError.value =
      fetchError?.data?.message ||
      fetchError?.message ||
      "Não foi possível enviar a imagem.";
    throw error;
  }
};

const resolveDishImage = async (companyId: string) => {
  if (imageFile.value) {
    return uploadDishImage(companyId);
  }
  const manualUrl = form.imageUrl.trim();
  if (manualUrl) {
    if (manualUrl !== originalImageUrl.value) {
      return manualUrl;
    }
    return undefined;
  }
  if (originalImageUrl.value) {
    return null;
  }
  return undefined;
};

const saveDish = async () => {
  if (!form.name.trim()) {
    toast.add({ color: "warning", title: "Informe o nome do prato" });
    return;
  }
  if (!form.categoryIds.length) {
    toast.add({
      color: "warning",
      title: "Selecione pelo menos uma categoria",
    });
    return;
  }
  const companyId = dish.value?.companyId ?? user.value?.company?.id;
  if (!companyId) {
    toast.add({ color: "error", title: "Empresa não encontrada" });
    return;
  }
  isSaving.value = true;
  try {
    const resolvedCategoryIds = uniqueArray(form.categoryIds);
    const primarySlug = resolveCategorySlug(resolvedCategoryIds[0]);
    if (!primarySlug) {
      toast.add({
        color: "error",
        title: "Não foi possível identificar a categoria selecionada",
      });
      isSaving.value = false;
      return;
    }
    const payload: Record<string, unknown> = {
      name: form.name.trim(),
      description: form.description.trim() || null,
      price: Number(form.price),
      isAvailable: form.isAvailable,
      categoryIds: resolvedCategoryIds,
      sideCategoryIds: uniqueArray(form.sideCategoryIds),
      category: primarySlug,
    };
    const imageResult = await resolveDishImage(companyId);
    if (imageResult !== undefined) {
      payload.imageUrl = imageResult;
    }
    await $fetch(`/api/dishes/${dishId}`, {
      method: "PUT",
      body: payload,
    });
    toast.add({ color: "success", title: "Prato atualizado com sucesso" });
    await navigateTo("/admin/dishes");
  } catch (error) {
    console.error("Error saving dish:", error);
    toast.add({
      color: "error",
      title: "Erro ao atualizar prato",
      description: "Tente novamente em instantes",
    });
  } finally {
    isSaving.value = false;
  }
};

const fetchResources = async () => {
  isLoading.value = true;
  try {
    const dishRecord = await fetchDish();
    const companyId = dishRecord?.companyId ?? user.value?.company?.id;
    if (companyId) {
      await loadCategories(companyId, dishRecord);
    } else {
      categoryOptions.value = [];
    }
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  if (!user.value?.company?.id) {
    await getCurrentUser();
  }
  await fetchResources();
});
</script>
