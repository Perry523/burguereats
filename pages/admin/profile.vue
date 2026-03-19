<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-3xl font-bold text-gray-900">Meu Perfil</h1>
      <p class="text-sm text-gray-500">Atualize suas informações pessoais</p>
    </div>

    <!-- Profile Form -->
    <div class="bg-white rounded-lg border border-gray-200 p-6">
      <h2 class="text-lg font-semibold text-gray-800 mb-4">Informações Pessoais</h2>
      <form @submit.prevent="saveProfile" class="space-y-4 max-w-lg">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Nome</label>
          <input
            v-model="profileForm.name"
            type="text"
            required
            class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Seu nome"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            v-model="profileForm.email"
            type="email"
            required
            class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="seu@email.com"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
          <input
            v-model="profileForm.phone"
            type="text"
            class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="(00) 00000-0000"
          />
        </div>

        <button
          type="submit"
          :disabled="isSavingProfile"
          class="px-6 py-2.5 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 transition-colors"
        >
          {{ isSavingProfile ? 'Salvando...' : 'Salvar alterações' }}
        </button>
      </form>
    </div>

    <!-- Change Password -->
    <div class="bg-white rounded-lg border border-gray-200 p-6">
      <h2 class="text-lg font-semibold text-gray-800 mb-4">Alterar Senha</h2>
      <form @submit.prevent="changePassword" class="space-y-4 max-w-lg">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Senha Atual</label>
          <input
            v-model="passwordForm.currentPassword"
            type="password"
            required
            class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="••••••••"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Nova Senha</label>
          <input
            v-model="passwordForm.newPassword"
            type="password"
            required
            minlength="6"
            class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Mínimo 6 caracteres"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Confirmar Nova Senha</label>
          <input
            v-model="passwordForm.confirmPassword"
            type="password"
            required
            minlength="6"
            class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Confirme a nova senha"
          />
        </div>

        <button
          type="submit"
          :disabled="isChangingPassword"
          class="px-6 py-2.5 text-sm font-semibold text-white bg-slate-800 rounded-lg hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
        >
          {{ isChangingPassword ? 'Alterando...' : 'Alterar senha' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "admin",
});

const auth = useAuthStore();
const toast = useToast();

const isSavingProfile = ref(false);
const isChangingPassword = ref(false);

const profileForm = reactive({
  name: auth.user?.name || "",
  email: auth.user?.email || "",
  phone: "",
});

const passwordForm = reactive({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

// Load user phone from the server
onMounted(async () => {
  if (!auth.user) {
    await auth.getCurrentUser();
  }
  profileForm.name = auth.user?.name || "";
  profileForm.email = auth.user?.email || "";

  // Fetch full profile to get phone
  try {
    const res = await $fetch<{ success: boolean; data: any }>("/api/auth/me");
    if (res.success && res.data) {
      profileForm.phone = res.data.phone || "";
    }
  } catch (e) {
    // Ignore, phone just stays empty
  }
});

const saveProfile = async () => {
  isSavingProfile.value = true;
  try {
    await $fetch("/api/users/profile", {
      method: "PUT",
      body: {
        name: profileForm.name,
        email: profileForm.email,
        phone: profileForm.phone,
      },
    });

    // Update the local auth store
    if (auth.user) {
      auth.user.name = profileForm.name;
      auth.user.email = profileForm.email;
    }

    toast.add({ color: "success", title: "Perfil atualizado com sucesso" });
  } catch (error: any) {
    console.error("Error saving profile:", error);
    toast.add({
      color: "error",
      title: "Erro ao atualizar perfil",
      description: error?.data?.statusMessage || "Tente novamente",
    });
  } finally {
    isSavingProfile.value = false;
  }
};

const changePassword = async () => {
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    toast.add({
      color: "warning",
      title: "As senhas não coincidem",
    });
    return;
  }

  isChangingPassword.value = true;
  try {
    await $fetch("/api/users/change-password", {
      method: "POST",
      body: {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      },
    });

    passwordForm.currentPassword = "";
    passwordForm.newPassword = "";
    passwordForm.confirmPassword = "";

    toast.add({ color: "success", title: "Senha alterada com sucesso" });
  } catch (error: any) {
    console.error("Error changing password:", error);
    const msg = error?.data?.statusMessage || "Tente novamente";
    toast.add({
      color: "error",
      title: "Erro ao alterar senha",
      description: msg === "Current password is incorrect" ? "Senha atual incorreta" : msg,
    });
  } finally {
    isChangingPassword.value = false;
  }
};
</script>
