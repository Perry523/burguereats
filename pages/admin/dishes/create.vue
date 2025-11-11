<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Adicionar Prato</h1>
        <p class="text-sm text-gray-500">Crie um novo prato para o cardápio</p>
      </div>
      <div class="flex items-center gap-3">
        <NuxtLink to="/admin/dishes">
          <button type="button" class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            Cancelar
          </button>
        </NuxtLink>
        <button 
          type="submit" 
          form="create-dish-form"
          :disabled="isSaving"
          class="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary disabled:opacity-50"
        >
          {{ isSaving ? 'Salvando...' : 'Salvar prato' }}
        </button>
      </div>
    </div>

    <!-- Form -->
    <form id="create-dish-form" @submit.prevent="saveDish" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <!-- Left Column - Image (1/3 width) -->
      <div class="lg:col-span-1 space-y-6">
        <div class="bg-white rounded-lg border border-gray-200 p-6">
          <h2 class="text-lg font-semibold text-gray-800 mb-4">Imagem do prato</h2>
          
          <!-- Image Preview or Upload Zone -->
          <div v-if="imagePreview" class="space-y-4">
            <div class="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
              <img :src="imagePreview" alt="Preview" class="w-full h-full object-cover" />
              <button
                type="button"
                @click="removeImage"
                class="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-lg"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div v-else>
            <!-- Dropzone -->
            <label
              class="relative block w-full aspect-square border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-400 transition-colors cursor-pointer"
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
              <div class="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                <svg class="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p class="text-sm font-medium text-gray-700 mb-1">
                  Arraste uma imagem ou clique
                </p>
                <p class="text-xs text-gray-500">
                  PNG, JPG, WEBP até 5MB
                </p>
              </div>
            </label>
          </div>

          <!-- URL Input -->
          <!-- <div class="mt-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Ou insira uma URL
            </label>
            <input
              v-model="form.imageUrl"
              type="url"
              placeholder="https://exemplo.com/imagem.jpg"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div> -->

          <!-- Error Message -->
          <div v-if="imageError" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p class="text-sm text-red-600">{{ imageError }}</p>
          </div>
        </div>
      </div>

      <!-- Right Column - Form Fields (2/3 width) -->
      <div class="lg:col-span-2 space-y-6">
        
        <!-- Main Information -->
        <div class="bg-white rounded-lg border border-gray-200 p-6">
          <h2 class="text-lg font-semibold text-gray-800 mb-4">Informações principais</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Nome do prato <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.name"
                type="text"
                required
                placeholder="Ex: Filé Mignon ao Molho Madeira"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Preço <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <span class="absolute left-3 top-2 text-gray-500">R$</span>
                <input
                  v-model.number="form.price"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  placeholder="0.00"
                  class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div class="mt-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Descrição
            </label>
            <textarea
              v-model="form.description"
              rows="3"
              placeholder="Descreva os ingredientes e o modo de preparo..."
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
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
              {{ form.isAvailable ? 'Disponível' : 'Indisponível' }}
            </span>
          </div>
        </div>

        <!-- Categories -->
        <div class="bg-white rounded-lg border border-gray-200 p-6">
          <h2 class="text-lg font-semibold text-gray-800 mb-4">Categorias</h2>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Categorias <span class="text-red-500">*</span>
              </label>
              <select
                v-model="categoryToAdd"
                @change="handleCategorySelection"
                :disabled="!availableCategoryOptions.length"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="" disabled>Selecione uma categoria</option>
                <option v-for="cat in availableCategoryOptions" :key="cat.value" :value="cat.value">
                  {{ cat.label }}
                </option>
              </select>
              <p class="text-xs text-gray-500 mt-1">
                {{ availableCategoryOptions.length ? 'Escolha uma categoria para adicionar' : 'Todas as categorias foram adicionadas' }}
              </p>
            </div>

            <div v-if="selectedCategoryOptions.length" class="grid gap-3 sm:grid-cols-2">
              <div
                v-for="category in selectedCategoryOptions"
                :key="`selected-category-${category.value}`"
                class="flex items-center justify-between gap-3 rounded-lg border border-orange-200 bg-orange-50 px-4 py-3"
              >
                <span class="text-sm font-semibold text-orange-700">{{ category.label }}</span>
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
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import type { FetchError } from "ofetch";

definePageMeta({
  layout: "admin",
});

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

interface DishForm {
  name: string;
  description: string;
  price: number;
  categoryIds: string[];
  isAvailable: boolean;
  imageUrl: string;
}

const auth = useAuthStore();
const { user } = storeToRefs(auth);
const toast = useToast();

const categoryOptions = ref<CategoryOption[]>([]);
const isSaving = ref(false);
const imageFile = ref<File | null>(null);
const imagePreview = ref<string | null>(null);
const imageError = ref<string | null>(null);
const objectUrl = ref<string | null>(null);
const isDragging = ref(false);

const form = reactive<DishForm>({
  name: "",
  description: "",
  price: 0,
  categoryIds: [],
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
  categoryOptions.value.filter((option) => !form.categoryIds.includes(option.value))
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

const uniqueArray = (values: string[]) => Array.from(new Set(values.filter((value) => typeof value === "string" && value)));

const formatCategoryLabel = (slug: string) =>
  slug
    .split("-")
    .filter((segment) => segment.length)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");

const toSlug = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    processFile(target.files[0]);
  }
};

const handleDrop = (event: DragEvent) => {
  isDragging.value = false;
  if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
    processFile(event.dataTransfer.files[0]);
  }
};

const processFile = (file: File) => {
  // Validate file type
  if (!file.type.startsWith('image/')) {
    imageError.value = "Por favor, selecione apenas arquivos de imagem.";
    return;
  }

  // Validate file size (5MB)
  if (file.size > 5 * 1024 * 1024) {
    imageError.value = "A imagem deve ter no máximo 5MB.";
    return;
  }

  imageError.value = null;
  imageFile.value = file;
  form.imageUrl = ""; // Clear URL input when file is selected
};

const removeImage = () => {
  imageFile.value = null;
  form.imageUrl = "";
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

const loadCategories = async (companyId: string) => {
  try {
    const response = await $fetch<{ success: boolean; data?: CategoryRecord[] }>(`/api/categories?companyId=${companyId}`);
    const fetched = Array.isArray(response?.data) ? response.data : [];
    const options = fetched
      .map((record) => ({
        value: record.id,
        label: record.name || formatCategoryLabel(record.slug),
        slug: record.slug,
        order: typeof record.order === "number" ? record.order : 0,
      }))
      .sort((a, b) => (a.order - b.order) || a.label.localeCompare(b.label));

    categoryOptions.value = options;
    form.categoryIds = uniqueArray(form.categoryIds.filter((id) => options.some((option) => option.value === id)));
  } catch (error) {
    console.error("Error loading categories:", error);
    categoryOptions.value = [];
    form.categoryIds = [];
  }
};

const fetchResources = async () => {
  const companyId = user.value?.company?.id;
  if (!companyId) {
    return;
  }

  try {
    await loadCategories(companyId);
  } catch (error) {
    console.error("Error fetching resources:", error);
  }
};

const resolveCategorySlug = (id: string) =>
  categoryOptions.value.find((option) => option.value === id)?.slug ?? "";

const uploadDishImage = async (companyId: string) => {
  if (imageFile.value) {
    try {
      imageError.value = null;
      const formData = new FormData();
      formData.append("file", imageFile.value);
      formData.append("companyId", companyId);
      formData.append("name", form.name.trim() || "prato");
      const response = await $fetch<{ success?: boolean; data?: { url?: string } }>("/api/uploads/dish-image", {
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
      imageError.value = fetchError?.data?.message || fetchError?.message || "Não foi possível enviar a imagem.";
      throw error;
    }
  }

  const manualUrl = form.imageUrl.trim();
  return manualUrl ? manualUrl : null;
};

const saveDish = async () => {
  if (!form.name.trim()) {
    toast.add({ color: "warning", title: "Informe o nome do prato" });
    return;
  }

  if (!form.categoryIds.length) {
    toast.add({ color: "warning", title: "Selecione pelo menos uma categoria" });
    return;
  }

  const companyId = user.value?.company?.id;
  if (!companyId) {
    toast.add({ color: "error", title: "Empresa não encontrada" });
    return;
  }

  isSaving.value = true;
  try {
    const primarySlug = resolveCategorySlug(form.categoryIds[0]);
    if (!primarySlug) {
      toast.add({ color: "error", title: "Não foi possível identificar a categoria selecionada" });
      isSaving.value = false;
      return;
    }

    const imageUrl = await uploadDishImage(companyId);

    const payload: Record<string, unknown> = {
      name: form.name.trim(),
      description: form.description.trim() || null,
      price: Number(form.price),
      isAvailable: form.isAvailable,
      categoryIds: uniqueArray(form.categoryIds),
      companyId,
      category: primarySlug,
    };

    if (imageUrl) {
      payload.imageUrl = imageUrl;
    }

    await $fetch("/api/dishes", {
      method: "POST",
      body: payload,
    });

    toast.add({ color: "success", title: "Prato criado com sucesso" });
    await navigateTo("/admin/dishes");
  } catch (error) {
    console.error("Error saving dish:", error);
    toast.add({ color: "error", title: "Erro ao salvar prato", description: "Tente novamente em instantes" });
  } finally {
    isSaving.value = false;
  }
};

onMounted(async () => {
  if (!user.value?.company?.id) {
    await auth.getCurrentUser();
  }
  await fetchResources();
});
</script>