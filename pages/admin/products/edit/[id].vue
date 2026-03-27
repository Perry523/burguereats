<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Editar Produto</h1>
        <p class="text-sm text-gray-500">Atualize as informações do produto</p>
      </div>
      <div class="flex items-center gap-3">
        <NuxtLink to="/admin/products">
          <button
            type="button"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancelar
          </button>
        </NuxtLink>
        <button
          type="submit"
          form="edit-product-form"
          :disabled="isSaving"
          class="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary disabled:opacity-50"
        >
          {{ isSaving ? "Salvando..." : "Salvar alterações" }}
        </button>
      </div>
    </div>

    <div v-if="isLoading" class="space-y-6">
      <div class="h-96 rounded-lg bg-gray-100 animate-pulse"></div>
    </div>

    <!-- Form -->
    <form
      v-else
      id="edit-product-form"
      @submit.prevent="saveProduct"
      class="grid grid-cols-1 lg:grid-cols-3 gap-6"
    >
      <!-- Left Column - Image (1/3 width) -->
      <div class="lg:col-span-1 space-y-6">
        <div class="bg-white rounded-lg border border-gray-200 p-6">
          <h2 class="text-lg font-semibold text-gray-800 mb-4">
            Imagem do produto
          </h2>

          <!-- Image Preview or Upload Zone -->
          <div v-if="imagePreview" class="space-y-4">
            <div
              class="relative aspect-square rounded-lg overflow-hidden bg-gray-100"
            >
              <img
                :src="imagePreview"
                alt="Preview"
                class="w-full h-full object-cover"
              />
              <button
                type="button"
                @click="removeImage"
                class="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-lg"
              >
                <UIcon name="i-heroicons-trash" class="w-4 h-4" />
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
              <div
                class="absolute inset-0 flex flex-col items-center justify-center p-6 text-center"
              >
                <UIcon
                  name="i-heroicons-photo"
                  class="w-12 h-12 text-gray-400 mb-3"
                />
                <p class="text-sm font-medium text-gray-700 mb-1">
                  Arraste uma imagem ou clique
                </p>
                <p class="text-xs text-gray-500">PNG, JPG, WEBP até 5MB</p>
              </div>
            </label>
          </div>

          <!-- URL Input -->
          <!-- <div class="mt-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Ou insira uma URL
            </label>
            <input
              v-model="form.image"
              type="url"
              placeholder="https://exemplo.com/imagem.jpg"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div> -->

          <!-- Error Message -->
          <div
            v-if="imageError"
            class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg"
          >
            <p class="text-sm text-red-600">{{ imageError }}</p>
          </div>
        </div>
      </div>

      <!-- Right Column - Form Fields (2/3 width) -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Main Information -->
        <div class="bg-white rounded-lg border border-gray-200 p-6">
          <h2 class="text-lg font-semibold text-gray-800 mb-4">
            Informações principais
          </h2>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Nome do produto <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.name"
                type="text"
                required
                placeholder="Ex: Coca-Cola Lata"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Categoria <span class="text-red-500">*</span>
              </label>
              <select
                v-model="form.category"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="" disabled>Selecione uma categoria</option>
                <option
                  v-for="cat in categoryOptions"
                  :key="cat.value"
                  :value="cat.label"
                >
                  {{ cat.label }}
                </option>
              </select>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Preço de Venda <span class="text-red-500">*</span>
                </label>
                <Currency
                  v-model="form.sell_price"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Estoque Atual <span class="text-red-500">*</span>
                </label>
                <input
                  v-model.number="form.stock"
                  type="number"
                  min="0"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, reactive, ref, watch } from "vue";
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

const auth = useAuthStore();
const { user } = storeToRefs(auth);
const toast = useToast();
const router = useRouter();
const route = useRoute();
const productId = route.params.id as string;

const categoryOptions = ref<CategoryOption[]>([]);
const isSaving = ref(false);
const isLoading = ref(true);
const imageFile = ref<File | null>(null);
const imagePreview = ref<string | null>(null);
const imageError = ref<string | null>(null);
const objectUrl = ref<string | null>(null);
const isDragging = ref(false);

const form = reactive({
  name: "",
  category: "",
  sell_price: 0,
  buy_price: 0,
  stock: 0,
  image: "",
});

const formatCategoryLabel = (slug: string) =>
  slug
    .split("-")
    .filter((segment) => segment.length)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");

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
  if (!file.type.startsWith("image/")) {
    imageError.value = "Por favor, selecione apenas arquivos de imagem.";
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    imageError.value = "A imagem deve ter no máximo 5MB.";
    return;
  }

  imageError.value = null;
  imageFile.value = file;
  form.image = "";
};

const removeImage = () => {
  imageFile.value = null;
  form.image = "";
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

  const manualUrl = form.image.trim();
  imagePreview.value = manualUrl ? manualUrl : null;
};

watch(imageFile, updatePreview);
watch(() => form.image, updatePreview);

onBeforeUnmount(() => {
  if (objectUrl.value) {
    URL.revokeObjectURL(objectUrl.value);
  }
});

const loadCategories = async (companyId: string) => {
  try {
    const response = await $fetch<{
      success: boolean;
      data?: CategoryRecord[];
    }>(`/api/categories?companyId=${companyId}`);
    const fetched = Array.isArray(response?.data) ? response.data : [];
    const options = fetched
      .map((record) => ({
        value: record.id,
        label: record.name || formatCategoryLabel(record.slug),
        slug: record.slug,
        order: typeof record.order === "number" ? record.order : 0,
      }))
      .sort((a, b) => a.order - b.order || a.label.localeCompare(b.label));

    categoryOptions.value = options;
  } catch (error) {
    console.error("Error loading categories:", error);
    categoryOptions.value = [];
  }
};

interface Product {
  id: string;
  name: string;
  category: string;
  sell_price: number;
  buy_price: number;
  stock: number;
  image?: string | null;
}

const fetchProduct = async (companyId: string) => {
  try {
    const response = await $fetch<{ success: boolean; data?: Product[] }>(
      `/api/products?companyId=${companyId}&_t=${Date.now()}`
    );
    const product = response.data?.find((p) => p.id === productId);

    if (product) {
      form.name = product.name;
      form.category = product.category;
      form.sell_price = product.sell_price;
      form.buy_price = product.buy_price;
      form.stock = product.stock;
      form.image = product.image || "";

      if (form.image) {
        imagePreview.value = form.image;
      }
    } else {
      toast.add({ color: "error", title: "Produto não encontrado" });
      router.push("/admin/products");
    }
  } catch (error) {
    console.error("Error fetching product:", error);
    toast.add({ color: "error", title: "Erro ao carregar produto" });
  } finally {
    isLoading.value = false;
  }
};

const uploadProductImage = async (companyId: string) => {
  if (imageFile.value) {
    try {
      imageError.value = null;
      const formData = new FormData();
      formData.append("file", imageFile.value);
      formData.append("companyId", companyId);
      formData.append("name", form.name.trim() || "produto");
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
  }

  const manualUrl = form.image.trim();
  return manualUrl ? manualUrl : null;
};

const companyId = computed(() => auth.currentCompanyId || user.value?.company?.id || '');

const saveProduct = async () => {
  if (!form.name.trim()) {
    toast.add({ color: "warning", title: "Informe o nome do produto" });
    return;
  }

  if (!form.category) {
    toast.add({ color: "warning", title: "Selecione uma categoria" });
    return;
  }

  if (!companyId.value) {
    toast.add({ color: "error", title: "Empresa não encontrada" });
    return;
  }

  isSaving.value = true;
  try {
    const imageUrl = await uploadProductImage(companyId.value);

    const payload = {
      name: form.name.trim(),
      category: form.category,
      sell_price: Number(form.sell_price),
      buy_price: Number(form.buy_price),
      stock: Number(form.stock),
      image: imageUrl,
    };

    const response = await $fetch<{ success: boolean; error?: string }>(
      `/api/products/${productId}`,
      {
        method: "PUT",
        body: payload,
      }
    );

    if (response.success) {
      toast.add({ color: "success", title: "Produto atualizado com sucesso" });
      await navigateTo("/admin/products");
    } else {
      throw new Error(response.error || "Erro desconhecido");
    }
  } catch (error) {
    console.error("Error updating product:", error);
    toast.add({
      color: "error",
      title: "Erro ao atualizar produto",
      description: "Tente novamente em instantes",
    });
  } finally {
    isSaving.value = false;
  }
};

onMounted(async () => {
  if (!user.value?.company?.id) {
    await auth.getCurrentUser();
  }
  const cid = companyId.value;
  if (cid) {
    await Promise.all([loadCategories(cid), fetchProduct(cid)]);
  }
});
</script>
