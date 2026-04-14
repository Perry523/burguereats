<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <div class="bg-white rounded-lg shadow-2xl w-full max-w-md p-8">
      <h1 class="text-3xl font-bold text-center text-gray-800 mb-8">
        Painel de gerenciamento
      </h1>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <UInput
            v-model="email"
            type="email"
            placeholder="seu@email.com"
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
            class="w-full"
            size="xl"
          />
        </div>

        <div
          v-if="error"
          class="bg-red-50 border border-red-200 rounded-lg p-4"
        >
          <p class="text-red-700 text-sm">{{ error }}</p>
        </div>

        <UButton
          type="submit"
          :loading="isLoading"
          class="w-full flex justify-center text-center"
          size="xl"
        >
          Entrar
        </UButton>
      </form>

      <div class="mt-6 space-y-2">
        <!-- <p class="text-center text-sm text-gray-600">
          © 2026 Restaurante Admin
        </p> -->
        <p class="text-center text-sm">
          <NuxtLink
            to="/register-biker"
            class="text-green-600 font-medium hover:underline"
          >
            Não tem uma conta? Cadastre-se
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
});

const email = ref("");
const password = ref("");
const { isLoading, error, login } = useAuth();

const handleLogin = async () => {
  try {
    const user = await login(email.value.trim().toLowerCase(), password.value);
    if (user?.role === "biker") {
      await navigateTo("/admin/biker-dashboard");
    } else {
      await navigateTo("/admin");
    }
  } catch (err) {
    console.error("Login error:", err);
  }
};
</script>
