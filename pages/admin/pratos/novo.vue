<template>
  <NuxtLayout name="admin">
    <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Novo Prato</h1>
      <p class="text-gray-600 mt-2">Adicione um novo prato ao cardápio</p>
    </div>

    <UCard class="max-w-2xl">
      <form @submit.prevent="submitForm" class="space-y-6">
        <UFormGroup label="Nome do Prato" required>
          <UInput v-model="form.name" placeholder="Ex: Risoto de Cogumelos" />
        </UFormGroup>

        <UFormGroup label="Descrição" required>
          <UTextarea
            v-model="form.description"
            placeholder="Descreva o prato, ingredientes principais, etc."
            rows="3"
          />
        </UFormGroup>

        <UFormGroup label="Preço (R$)" required>
          <UInput
            v-model="form.price"
            type="number"
            step="0.01"
            placeholder="0.00"
          />
        </UFormGroup>

        <UFormGroup label="Categoria" required>
          <USelect
            v-model="form.category"
            :options="categories"
            placeholder="Selecione uma categoria"
          />
        </UFormGroup>

        <UFormGroup label="Imagem">
          <UInput
            v-model="form.image"
            placeholder="URL da imagem"
            type="url"
          />
        </UFormGroup>

        <UFormGroup label="Disponível">
          <UToggle v-model="form.available" />
        </UFormGroup>

        <div class="flex space-x-4">
          <UButton type="submit" :loading="loading">
            Salvar Prato
          </UButton>
          <NuxtLink to="/admin/pratos">
            <UButton variant="outline">
              Cancelar
            </UButton>
          </NuxtLink>
        </div>
      </form>
    </UCard>
    </div>
  </NuxtLayout>
</template>

<script setup>
const form = ref({
  name: '',
  description: '',
  price: '',
  category: '',
  image: '',
  available: true
})

const loading = ref(false)

const categories = [
  { label: 'Entradas', value: 'entradas' },
  { label: 'Pratos Principais', value: 'pratos-principais' },
  { label: 'Sobremesas', value: 'sobremesas' },
  { label: 'Bebidas', value: 'bebidas' }
]

const submitForm = async () => {
  loading.value = true
  try {
    // Here you would typically send the data to your API
    console.log('Saving dish:', form.value)
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
    // Redirect to dishes list
    await navigateTo('/admin/pratos')
  } catch (error) {
    console.error('Error saving dish:', error)
  } finally {
    loading.value = false
  }
}
</script>