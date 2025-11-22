<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-3xl font-bold text-gray-800">Produtos</h1>
      <button class="btn btn-primary" @click="isOpen = true">
        <PlusIcon class="w-5 h-5 mr-2" />
        Novo Produto
      </button>
    </div>

    <UCard class="bg-white shadow-md">
      <div class="overflow-x-auto">
        <table class="table w-full">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Categoria</th>
              <th>Preço Venda</th>
              <th>Estoque</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in products" :key="product.id">
              <td>{{ product.name }}</td>
              <td>{{ getCategoryName(product.category_id) }}</td>
              <td>{{ formatCurrency(product.sell_price) }}</td>
              <td>{{ product.quantity }}</td>
              <td>
                <div class="badge" :class="product.is_active ? 'badge-success' : 'badge-error'">
                  {{ product.is_active ? 'Ativo' : 'Inativo' }}
                </div>
              </td>
              <td>
                <div class="flex gap-2">
                  <button class="btn btn-sm btn-square btn-ghost" @click="editProduct(product)">
                    <PencilSquareIcon class="w-5 h-5 text-blue-500" />
                  </button>
                  <button class="btn btn-sm btn-square btn-ghost" @click="deleteProduct(product.id)">
                    <TrashIcon class="w-5 h-5 text-red-500" />
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="products.length === 0">
              <td colspan="6" class="text-center py-8 text-gray-500">
                Nenhum produto encontrado
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </UCard>

    <UModal v-model="isOpen">
      <UCard class="w-full max-w-2xl">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-xl font-semibold">{{ editingProduct ? 'Editar Produto' : 'Novo Produto' }}</h3>
            <button class="btn btn-ghost btn-sm btn-circle" @click="closeModal">
              <XMarkIcon class="w-5 h-5" />
            </button>
          </div>
        </template>
        
        <ProductsRegisterForm 
          :product="editingProduct" 
          :loading="isLoading"
          @submit="handleSubmit" 
        />
      </UCard>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { PlusIcon, PencilSquareIcon, TrashIcon, XMarkIcon } from '@heroicons/vue/24/solid'

definePageMeta({
  layout: 'admin',
})

interface Product {
  id: string
  name: string
  description: string | null
  buy_price: number
  sell_price: number
  quantity: number
  image: string | null
  is_active: boolean
  category_id: string | null
  variants: any[]
}

const { user } = useAuthStore()
const products = ref<Product[]>([])
const categories = ref<any[]>([])
const isOpen = ref(false)
const isLoading = ref(false)
const editingProduct = ref<Product | null>(null)

const fetchProducts = async () => {
  if (!user?.company?.id) return
  try {
    const { data } = await useFetch(`/api/products?companyId=${user.company.id}`)
    if (data.value?.data) {
      products.value = data.value.data
    }
  } catch (e) {
    console.error('Failed to fetch products', e)
  }
}

const fetchCategories = async () => {
  if (!user?.company?.id) return
  try {
    const { data } = await useFetch(`/api/categories?companyId=${user.company.id}`)
    if (data.value?.data) {
      categories.value = data.value.data
    }
  } catch (e) {
    console.error('Failed to fetch categories', e)
  }
}

const getCategoryName = (id: string) => {
  const category = categories.value.find((c: any) => c.id === id)
  return category ? category.name : '-'
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

const editProduct = (product: any) => {
  editingProduct.value = product
  isOpen.value = true
}

const deleteProduct = async (id: string) => {
  if (!confirm('Tem certeza que deseja excluir este produto?')) return
  
  try {
    await $fetch(`/api/products/${id}`, { method: 'DELETE' })
    await fetchProducts()
  } catch (e) {
    console.error('Failed to delete product', e)
    alert('Erro ao excluir produto')
  }
}

const closeModal = () => {
  isOpen.value = false
  editingProduct.value = null
}

const handleSubmit = async (values: any) => {
  isLoading.value = true
  try {
    const payload = {
      ...values,
      company_id: user?.company?.id
    }

    if (editingProduct.value) {
      await $fetch(`/api/products/${editingProduct.value.id}`, {
        method: 'PUT',
        body: payload
      })
    } else {
      await $fetch('/api/products', {
        method: 'POST',
        body: payload
      })
    }
    
    await fetchProducts()
    closeModal()
  } catch (e) {
    console.error('Failed to save product', e)
    alert('Erro ao salvar produto')
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  await Promise.all([fetchProducts(), fetchCategories()])
})
</script>
