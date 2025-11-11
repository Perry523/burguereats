<template>
  <div>
    <h1 class="text-3xl font-bold text-gray-800 mb-8">Configurações</h1>

    <UCard class="bg-white shadow-md mb-6">
      <template #header>
        <h2 class="text-xl font-semibold text-gray-800">Informações da Empresa</h2>
      </template>

      <form @submit.prevent="saveCompany" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Nome</label>
            <UInput v-model="company.name" placeholder="Nome da empresa" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <UInput v-model="company.email" type="email" placeholder="Email" />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
            <UInput v-model="company.phone" placeholder="Telefone" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">CEP</label>
            <UInput v-model="company.zipCode" placeholder="CEP" />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Endereço</label>
          <UInput v-model="company.address" placeholder="Rua, número" />
        </div>

        <div class="grid grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Cidade</label>
            <UInput v-model="company.city" placeholder="Cidade" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Estado</label>
            <UInput v-model="company.state" placeholder="Estado" />
          </div>
        </div>

        <div class="flex justify-end pt-4">
          <UButton type="submit" >
            Salvar Configurações
          </UButton>
        </div>
      </form>
    </UCard>

    <UCard class="bg-white shadow-md">
      <template #header>
        <h2 class="text-xl font-semibold text-gray-800">Informações da Conta</h2>
      </template>

      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Nome</label>
          <p class="text-gray-900">{{ user?.name }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <p class="text-gray-900">{{ user?.email }}</p>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
})

const { user } = useAuthStore()
const company = reactive({
  name: '',
  email: '',
  phone: '',
  zipCode: '',
  address: '',
  city: '',
  state: '',
})

const saveCompany = async () => {
  try {
    await $fetch(`/api/companies/${user?.company.id}`, {
      method: 'PUT',
      body: company,
    })
  } catch (error) {
    console.error('Error saving company:', error)
  }
}

onMounted(async () => {
  // if (!user??.company?.id) {
  //   await useAuth().getCurrentUser()
  // }
  Object.assign(company, user?.company)
})
</script>
