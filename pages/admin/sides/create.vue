<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-gray-800">Adicionar Categoria de Acompanhamento</h1>
        <p class="text-sm text-gray-500">Crie uma nova categoria de acompanhamentos</p>
      </div>
      <NuxtLink to="/admin/sides">
        <button
          type="button"
          class="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
        >
          Voltar para Lista
        </button>
      </NuxtLink>
    </div>

    <div class="max-w-4xl rounded-lg border border-gray-200 bg-white shadow-sm">
      <form @submit.prevent="saveCategory" class="space-y-6 p-6">
        <div class="grid gap-6 md:grid-cols-2">
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700">Nome *</label>
            <input
              v-model="form.name"
              type="text"
              required
              placeholder="Ex: Molhos, Bebidas, Sobremesas"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700">Ordem</label>
            <input
              v-model.number="form.order"
              type="number"
              min="0"
              placeholder="0"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <p class="mt-1 text-xs text-gray-500">Ordem de exibição (menor número aparece primeiro)</p>
          </div>
        </div>

        <!-- <div>
          <label class="mb-2 block text-sm font-medium text-gray-700">Descrição</label>
          <textarea
            v-model="form.description"
            rows="3"
            placeholder="Descrição da categoria de acompanhamentos"
            class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          ></textarea>
        </div> -->

        <!-- <div class="grid gap-6 md:grid-cols-2">
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700">Seleção obrigatória</label>
            <div class="flex items-center gap-2">
              <input
                v-model="form.isRequired"
                type="checkbox"
                class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span class="text-sm text-gray-600">{{ form.isRequired ? 'Cliente deve selecionar' : 'Seleção opcional' }}</span>
            </div>
          </div>
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700">Máximo de seleções</label>
            <input
              v-model.number="form.maxSelections"
              type="number"
              min="1"
              placeholder="Deixe vazio para ilimitado"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <p class="mt-1 text-xs text-gray-500">Limite quantos itens o cliente pode escolher</p>
          </div>
        </div> -->

        <div class="border-t border-gray-200 pt-6">
          <div class="mb-4 flex items-center justify-between">
            <h3 class="text-lg font-medium text-gray-900">Itens da Categoria</h3>
            <button
              type="button"
              class="rounded-lg border border-gray-200 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100"
              @click="addSideItem"
            >
              Adicionar Item
            </button>
          </div>

          <div
            v-if="form.sides.length === 0"
            class="rounded-lg border-2 border-dashed border-gray-200 py-8 text-center text-gray-500"
          >
            <p>Nenhum item adicionado ainda</p>
            <button
              type="button"
              class="mt-2 rounded-lg border border-gray-200 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100"
              @click="addSideItem"
            >
              Adicionar primeiro item
            </button>
          </div>

          <div v-else class="space-y-4">
            <div
              v-for="(side, index) in form.sides"
              :key="index"
              class="rounded-lg border border-gray-200 p-4"
            >
              <div class="mb-4 flex items-start justify-between">
                <h4 class="font-medium text-gray-900">Item {{ index + 1 }}</h4>
                <button
                  type="button"
                  class="rounded-lg border border-red-200 px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                  @click="removeSideItem(index)"
                >
                  Remover
                </button>
              </div>

              <div class="mt-4 flex flex-col gap-6 md:flex-row md:items-start">
                <div class="md:w-48 md:flex-shrink-0">
                  <label class="mb-2 block text-sm font-medium text-gray-700">Imagem do item</label>
                  <div v-if="side.imagePreview" class="space-y-3">
                    <div class="h-32 relative aspect-square overflow-hidden rounded-lg bg-gray-100">
                      <img :src="side.imagePreview" alt="Pré-visualização do item" class="h-32 w-full object-cover" />
                      <button
                        type="button"
                        class="absolute right-2 top-2 rounded-full bg-red-500 p-2 text-white shadow-lg hover:bg-red-600"
                        @click="removeSideImage(side)"
                      >
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <label class="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-100">
                      <input type="file" accept="image/*" class="hidden" @change="handleSideFileSelect($event, side)" />
                      Alterar imagem
                    </label>
                  </div>
                  <div v-else>
                    <label
                      class="relative h-32 block aspect-square w-full cursor-pointer rounded-lg border-2 border-dashed border-gray-300 transition-colors hover:border-orange-400"
                      @dragover.prevent="handleSideDragOver(side)"
                      @dragleave.prevent="handleSideDragLeave(side)"
                      @drop.prevent="handleSideDrop($event, side)"
                      :class="{ 'border-orange-400 bg-orange-50': side.isDragging }"
                    >
                      <input type="file" accept="image/*" class="hidden" @change="handleSideFileSelect($event, side)" />
                      <div class="absolute inset-0 flex flex-col items-center justify-center gap-2 p-6 text-center">
                        <svg class="h-10 w-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <!-- <p class="text-sm font-medium text-gray-700">Arraste uma imagem ou clique</p>
                        <p class="text-xs text-gray-500">PNG, JPG, WEBP até 5MB</p> -->
                      </div>
                    </label>
                  </div>
                  <div v-if="side.imageError" class="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2">
                    <p class="text-xs text-red-600">{{ side.imageError }}</p>
                  </div>
                </div>
                <div class="flex-1 space-y-4">
                  <div class="grid gap-4 md:grid-cols-2">
                    <div>
                      <label class="mb-1 block text-sm font-medium text-gray-700">Nome *</label>
                      <input
                        v-model="side.name"
                        type="text"
                        required
                        placeholder="Nome do item"
                        class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div>
                      <label class="mb-1 block text-sm font-medium text-gray-700">Preço adicional</label>
                      <CurrencyField
                        v-model="side.priceIncrement"
                        placeholder="0,00"
                        class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>
                  <!-- <div>
                    <label class="mb-1 block text-sm font-medium text-gray-700">Descrição</label>
                    <input
                      v-model="side.description"
                      type="text"
                      placeholder="Descrição do item"
                      class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div> -->
                  <label class="inline-flex items-center gap-3 text-sm font-medium text-gray-700">
                    <input
                      v-model="side.isAvailable"
                      type="checkbox"
                      class="sr-only"
                    />
                    <span
                      class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200"
                      :class="side.isAvailable ? 'bg-primary' : 'bg-gray-300'"
                    >
                      <span
                        class="inline-block h-5 w-5 rounded-full bg-white shadow transition duration-200 transform"
                        :class="side.isAvailable ? 'translate-x-5' : 'translate-x-1'"
                      ></span>
                    </span>
                    <span>{{ side.isAvailable ? 'Disponível' : 'Indisponível' }}</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-4 border-t border-gray-200 pt-6">
          <NuxtLink to="/admin/sides">
            <button
              type="button"
              class="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              Cancelar
            </button>
          </NuxtLink>
          <button
            type="submit"
            class="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="isSaving"
          >
            {{ isSaving ? 'Salvando...' : 'Salvar Categoria' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineComponent, h } from 'vue'
import type { FetchError } from 'ofetch'
import { useBRLCurrency } from '~/composables/useCurrency'

definePageMeta({
  layout: 'admin',
})

interface SideItemForm {
  name: string
  description: string
  priceIncrement: number | null
  image: string
  isAvailable: boolean
  imageFile: File | null
  imagePreview: string | null
  imageError: string | null
  objectUrl: string | null
  isDragging: boolean
}

const valuesAreEqual = (current: number | null | undefined, next: number | null | undefined) => {
  if (current === next) {
    return true
  }
  if (current === undefined || next === undefined) {
    return false
  }
  if (Number.isNaN(current) && Number.isNaN(next)) {
    return true
  }
  return false
}

const CurrencyField = defineComponent({
  name: 'CurrencyField',
  props: {
    modelValue: {
      type: Number,
      default: null,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit, attrs }) {
    const { inputRef, numberValue, setValue } = useBRLCurrency()

    watch(
      () => props.modelValue,
      value => {
        const normalized = value ?? null
        if (!valuesAreEqual(normalized, numberValue.value)) {
          setValue(normalized)
        }
      },
      { immediate: true }
    )

    watch(numberValue, value => {
      const normalized = value ?? null
      if (!valuesAreEqual(props.modelValue ?? null, normalized)) {
        emit('update:modelValue', normalized)
      }
    })

    return () =>
      h('input', {
        ref: inputRef,
        type: 'text',
        inputmode: 'decimal',
        ...attrs,
      })
  },
})

const MAX_IMAGE_SIZE = 5 * 1024 * 1024

const createSideItem = (): SideItemForm => ({
  name: '',
  description: '',
  priceIncrement: 0,
  image: '',
  isAvailable: true,
  imageFile: null,
  imagePreview: null,
  imageError: null,
  objectUrl: null,
  isDragging: false,
})

const cleanupSideImage = (side: SideItemForm) => {
  if (side.objectUrl) {
    URL.revokeObjectURL(side.objectUrl)
    side.objectUrl = null
  }
}

const updateSidePreview = (side: SideItemForm) => {
  cleanupSideImage(side)
  if (side.imageFile) {
    side.objectUrl = URL.createObjectURL(side.imageFile)
    side.imagePreview = side.objectUrl
    return
  }
  const manualUrl = side.image?.trim()
  side.imagePreview = manualUrl || null
}

const processSideFile = (file: File, side: SideItemForm) => {
  if (!file.type.startsWith('image/')) {
    side.imageError = 'Por favor, selecione apenas arquivos de imagem.'
    return
  }
  if (file.size > MAX_IMAGE_SIZE) {
    side.imageError = 'A imagem deve ter no máximo 5MB.'
    return
  }
  side.imageError = null
  side.imageFile = file
  side.image = ''
  updateSidePreview(side)
}

const handleSideFileSelect = (event: Event, side: SideItemForm) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    processSideFile(file, side)
  }
  if (target) {
    target.value = ''
  }
}

const handleSideDrop = (event: DragEvent, side: SideItemForm) => {
  side.isDragging = false
  const file = event.dataTransfer?.files?.[0]
  if (file) {
    processSideFile(file, side)
  }
}

const handleSideDragOver = (side: SideItemForm) => {
  side.isDragging = true
}

const handleSideDragLeave = (side: SideItemForm) => {
  side.isDragging = false
}

const removeSideImage = (side: SideItemForm) => {
  cleanupSideImage(side)
  side.imageFile = null
  side.imagePreview = null
  side.image = ''
  side.imageError = null
}

const toPriceValue = (value: number | null | undefined) => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }
  const parsed = Number(value ?? 0)
  return Number.isFinite(parsed) ? parsed : 0
}

const authStore = useAuthStore()

const isSaving = ref(false)

const form = reactive({
  name: '',
  description: '',
  isRequired: false,
  maxSelections: null as number | null,
  order: 0,
  sides: [] as SideItemForm[],
})

watch(
  () => form.sides.map(side => side.image),
  () => {
    form.sides.forEach(side => {
      if (!side.imageFile) {
        updateSidePreview(side)
      }
    })
  }
)

onBeforeUnmount(() => {
  form.sides.forEach(cleanupSideImage)
})

const addSideItem = () => {
  form.sides.push(createSideItem())
}

const removeSideItem = (index: number) => {
  const side = form.sides[index]
  if (side) {
    cleanupSideImage(side)
  }
  form.sides.splice(index, 1)
}

const uploadSideImage = async (side: SideItemForm, companyId: string) => {
  if (side.imageFile) {
    try {
      side.imageError = null
      const formData = new FormData()
      formData.append('file', side.imageFile)
      formData.append('companyId', companyId)
      formData.append('name', side.name.trim() || 'acompanhamento')
      const response = await $fetch<{ success?: boolean; data?: { url?: string } }>('/api/uploads/dish-image', {
        method: 'POST',
        body: formData,
      })
      const imageUrl = response?.data?.url?.trim()
      if (!imageUrl) {
        throw new Error('Não foi possível obter a URL da imagem')
      }
      side.image = imageUrl
      return imageUrl
    } catch (error) {
      const fetchError = error as FetchError<{ message?: string }>
      side.imageError = fetchError?.data?.message || fetchError?.message || 'Não foi possível enviar a imagem.'
      throw error
    }
  }
  const manualUrl = side.image?.trim()
  return manualUrl || null
}

const saveCategory = async () => {
  if (!form.name.trim()) {
    return
  }

  const companyId = authStore.user?.company?.id
  if (!companyId) {
    alert('Empresa não encontrada.')
    return
  }

  isSaving.value = true
  try {
    const preparedSides = [] as Array<{
      name: string
      description: string | null
      priceIncrement: number
      image: string | null
      isAvailable: boolean
    }>

    for (const side of form.sides.filter(item => item.name.trim())) {
      const imageUrl = await uploadSideImage(side, companyId)
      preparedSides.push({
        name: side.name.trim(),
        description: side.description?.trim() || null,
        priceIncrement: toPriceValue(side.priceIncrement),
        image: imageUrl,
        isAvailable: side.isAvailable,
      })
    }

    const payload = {
      name: form.name.trim(),
      description: form.description?.trim() || null,
      isRequired: form.isRequired,
      maxSelections: form.maxSelections,
      order: form.order,
      companyId,
      sides: preparedSides,
    }

    await $fetch('/api/side-categories', {
      method: 'POST',
      body: payload,
    })

    await navigateTo('/admin/sides')
  } catch (error) {
    console.error('Error saving side category:', error)
    alert('Erro ao salvar categoria. Tente novamente.')
  } finally {
    isSaving.value = false
  }
}
</script>
