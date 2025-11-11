<template>
  <NuxtLayout name="admin">
    <div>
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Gerenciar Pratos</h1>
        <p class="text-gray-600 mt-2">Adicione, edite ou remova pratos do cardápio</p>
      </div>
      <NuxtLink to="/admin/pratos/novo">
        <UButton icon="i-heroicons-plus">
          Novo Prato
        </UButton>
      </NuxtLink>
    </div>

    <UCard>
      <template #header>
        <h3 class="text-lg font-semibold">Lista de Pratos</h3>
      </template>

      <div class="space-y-4">
        <div v-for="dish in dishes" :key="dish.id" class="flex items-center justify-between p-4 border rounded-lg">
          <div class="flex items-center space-x-4">
            <img :src="dish.image" :alt="dish.name" class="w-16 h-16 object-cover rounded-lg" />
            <div>
              <h4 class="font-semibold">{{ dish.name }}</h4>
              <p class="text-sm text-gray-600">{{ dish.description }}</p>
              <p class="text-sm font-medium text-green-600">R$ {{ dish.price.toFixed(2) }}</p>
            </div>
          </div>
          <div class="flex space-x-2">
            <UButton icon="i-heroicons-pencil-square" variant="outline" size="sm">
              Editar
            </UButton>
            <UButton icon="i-heroicons-trash" variant="outline" color="red" size="sm">
              Excluir
            </UButton>
          </div>
        </div>

        <div v-if="dishes.length === 0" class="text-center py-8 text-gray-500">
          <UIcon name="i-heroicons-squares-2x2" class="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>Nenhum prato cadastrado ainda.</p>
          <NuxtLink to="/admin/pratos/novo" class="text-blue-600 hover:underline">
            Clique aqui para adicionar o primeiro prato
          </NuxtLink>
        </div>
      </div>
    </UCard>
    </div>
  </NuxtLayout>
</template>

<script setup>
const dishes = ref([
  {
    id: 1,
    name: 'Risoto de Cogumelos',
    description: 'Risoto cremoso com mix de cogumelos frescos',
    price: 45.90,
    image: 'https://via.placeholder.com/150'
  },
  {
    id: 2,
    name: 'Filé Mignon',
    description: 'Filé mignon grelhado com molho de vinho',
    price: 68.50,
    image: 'https://via.placeholder.com/150'
  }
])
</script>