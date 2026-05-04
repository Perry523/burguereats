import { readonly, ref } from "vue";
import { storeToRefs } from "pinia";
import { useAuthStore } from "~/stores/auth";

export const useAuth = () => {
  const authStore = useAuthStore();
  const { user, isAuthenticated, isLoading, activeCompanyId, currentCompanyId } = storeToRefs(authStore);
  const error = ref<string | null>(null);

  const errorMessages: Record<string, string> = {
    "Account is inactive":
      "Sua conta está inativa. Entre em contato com o administrador.",
    "Company is inactive":
      "A empresa vinculada à sua conta está inativa. Entre em contato com o administrador.",
    "Invalid email or password": "E-mail ou senha incorretos.",
    "Email and password are required": "Informe o e-mail e a senha.",
  };

  const login = async (email: string, password: string) => {
    error.value = null;

    try {
      return await authStore.login(email, password);
    } catch (err: any) {
      // $fetch throws FetchError — the server message lives in err.data.statusMessage
      const serverMsg: string =
        err?.data?.statusMessage || err?.statusMessage || err?.message || "";
      error.value =
        errorMessages[serverMsg] ||
        serverMsg ||
        "Ocorreu um erro ao tentar entrar. Tente novamente.";
      throw err;
    }
  };

  const logout = async () => {
    error.value = null;
    await authStore.logout();
  };

  const getCurrentUser = async () => {
    error.value = null;
    return authStore.getCurrentUser();
  };

  const setUser = (value: Parameters<typeof authStore.setUser>[0]) => {
    authStore.setUser(value);
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    activeCompanyId,
    currentCompanyId,
    error: readonly(error),
    login,
    logout,
    getCurrentUser,
    setUser,
  };
};
