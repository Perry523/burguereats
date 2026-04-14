<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <div class="bg-white rounded-lg shadow-2xl w-full max-w-md p-8">
      <h1 class="text-3xl font-bold text-center text-gray-800 mb-8">Novo Cadastro</h1>

      <form @submit.prevent="handleRegister" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Nome completo
          </label>
          <UInput
            v-model="name"
            type="text"
            placeholder="Seu nome"
            required
            class="w-full"
            size="xl"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <UInput
            v-model="email"
            type="email"
            placeholder="voce@email.com"
            required
            class="w-full"
            size="xl"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Telefone / WhatsApp
          </label>
          <UInput
            v-model="phone"
            type="text"
            placeholder="(00) 00000-0000"
            required
            class="w-full"
            size="xl"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Senha
          </label>
          <UInput
            v-model="password"
            type="password"
            placeholder="••••••••"
            required
            minlength="6"
            class="w-full"
            size="xl"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Confirmar senha
          </label>
          <UInput
            v-model="confirmPassword"
            type="password"
            placeholder="••••••••"
            required
            minlength="6"
            class="w-full"
            size="xl"
          />
        </div>

        <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
          <p class="text-red-700 text-sm">{{ error }}</p>
        </div>

        <div v-if="successMessage" class="bg-green-50 border border-green-200 rounded-lg p-4">
          <p class="text-green-700 text-sm">{{ successMessage }}</p>
        </div>

        <UButton
          type="submit"
          :loading="isLoading"
          class="w-full flex justify-center text-center"
          size="xl"
          color="success"
        >
          Cadastrar como Entregador
        </UButton>
      </form>

      <p class="text-center text-sm text-gray-600 mt-6">
        Já tem uma conta?
        <NuxtLink to="/login" class="text-primary font-medium hover:underline">
          Entrar
        </NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
})

const name = ref('')
const email = ref('')
const phone = ref('')
const password = ref('')
const confirmPassword = ref('')
const isLoading = ref(false)
const error = ref('')
const successMessage = ref('')

const handleRegister = async () => {
  if (password.value !== confirmPassword.value) {
    error.value = 'As senhas precisam ser iguais'
    return
  }

  const trimmedName = name.value.trim()
  if (!trimmedName.length) {
    error.value = 'Informe um nome válido'
    return
  }

  const trimmedEmail = email.value.trim().toLowerCase()
  const trimmedPhone = phone.value.trim()

  isLoading.value = true
  error.value = ''
  successMessage.value = ''

  try {
    const response = await $fetch<{ success: boolean; message: string }>('/api/bikers/register', {
      method: 'POST',
      body: {
        name: trimmedName,
        email: trimmedEmail,
        phone: trimmedPhone,
        password: password.value,
      },
    })

    if (response.success) {
      successMessage.value = 'Cadastro realizado com sucesso! Redirecionando...'
      setTimeout(() => {
        navigateTo('/login')
      }, 2000)
    } else {
      throw new Error(response.message || 'Erro ao realizar cadastro')
    }
  } catch (err: any) {
    console.error('Registration error:', err)
    error.value = err.data?.statusMessage || err.message || 'Falha ao criar conta'
  } finally {
    isLoading.value = false
  }
}
</script>
