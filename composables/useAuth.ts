import { readonly, ref } from "vue";
import { storeToRefs } from "pinia";
import { useAuthStore } from "~/stores/auth";

export const useAuth = () => {
  const authStore = useAuthStore();
  const { user, isAuthenticated, isLoading, activeCompanyId, currentCompanyId } = storeToRefs(authStore);
  const error = ref<string | null>(null);

  const login = async (email: string, password: string) => {
    error.value = null;

    try {
      return await authStore.login(email, password);
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Login failed";
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
