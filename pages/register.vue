<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <div class="bg-white rounded-lg shadow-2xl w-full max-w-md p-8">
      <h1 class="text-3xl font-bold text-center text-gray-800 mb-8">Criar conta</h1>

      <form @submit.prevent="handleRegister" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Nome completo
          </label>
          <UInput
            v-model="fullName"
            type="text"
            placeholder="Seu nome"
            required
            class="w-full"
            size="xl"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Nome da empresa
          </label>
          <UInput
            v-model="companyName"
            type="text"
            placeholder="Sua empresa"
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
        >
          Cadastrar
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

const supabase = useSupabase()
const fullName = ref('')
const companyName = ref('')
const email = ref('')
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

  const trimmedName = fullName.value.trim()
  if (!trimmedName.length) {
    error.value = 'Informe um nome válido'
    return
  }

  const trimmedCompanyName = companyName.value.trim()
  if (!trimmedCompanyName.length) {
    error.value = 'Informe o nome da empresa'
    return
  }

  isLoading.value = true
  error.value = ''
  successMessage.value = ''

  try {
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email.value,
      password: password.value,
      options: {
        data: {
          full_name: trimmedName,
        },
      },
    })

    const isAlreadyRegistered =
      signUpError?.message?.toLowerCase().includes('already registered') ?? false

    if (signUpError && !isAlreadyRegistered) {
      error.value = signUpError.message
      return
    }

    if (!data?.user && !isAlreadyRegistered) {
      error.value = 'Não foi possível criar a conta. Tente novamente.'
      return
    }

    let companyId: string | null = null

    try {
      const companyResponse = await $fetch<{ success: boolean; data: { id: string } }>(
        '/api/companies',
        {
          method: 'POST',
          body: {
            name: trimmedCompanyName,
            email: email.value,
          },
        }
      )

      companyId = companyResponse.data.id
    } catch (companyError) {
      try {
        const companiesResponse = await $fetch<{ success: boolean; data: Array<{ id: string; email: string; name: string }> }>(
          '/api/companies'
        )
        const existingCompany = companiesResponse.data.find(
          (company) => company.email === email.value || company.name === trimmedCompanyName
        )
        if (existingCompany) {
          companyId = existingCompany.id
        } else {
          throw companyError
        }
      } catch {
        throw companyError
      }
    }

    if (!companyId) {
      throw new Error('Não foi possível vincular a empresa ao cadastro')
    }

    try {
      await $fetch('/api/admins', {
        method: 'POST',
        body: {
          name: trimmedName,
          email: email.value,
          password: password.value,
          companyId,
        },
      })
    } catch (adminError) {
      try {
        const adminsResponse = await $fetch<{ success: boolean; data: Array<{ email: string }> }>('/api/admins')
        const existingAdmin = adminsResponse.data.find((admin) => admin.email === email.value)
        if (!existingAdmin) {
          throw adminError
        }
      } catch {
        throw adminError
      }
    }

    successMessage.value = 'Cadastro realizado com sucesso. Redirecionando para o login...'
    setTimeout(() => {
      navigateTo('/login')
    }, 1500)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Falha ao criar conta'
  } finally {
    isLoading.value = false
  }
}
</script>
