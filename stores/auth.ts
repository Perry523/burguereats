import { defineStore } from "pinia";

export interface AuthCompany {
  id: string;
  name?: string | null;
  email?: string | null;
  type?: string | null;
  city?: string | null;
  state?: string | null;
  zipCode?: string | null;
  logo?: string | null;
}

export interface AuthUser {
  id: string;
  name?: string | null;
  email?: string | null;
  company?: AuthCompany | null;
  role?: 'admin' | 'biker';
}

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
}

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    user: null,
    isLoading: false,
  }),
  getters: {
    isAuthenticated: (state) => state.user !== null,
  },
  actions: {
    setUser(user: AuthUser | null) {
      this.user = user;
    },
    clearUser() {
      this.user = null;
    },
    async login(email: string, password: string) {
      this.isLoading = true;

      try {
        const response = await $fetch("/api/auth/login", {
          method: "POST",
          body: { email, password },
        });

        if (response.success) {
          this.setUser(response.data as any);
          return response.data;
        }

        throw new Error("Login failed");
      } catch (err) {
        this.clearUser();
        throw err;
      } finally {
        this.isLoading = false;
      }
    },
    async logout() {
      try {
        await $fetch("/api/auth/logout", { method: "POST" });
      } catch (err) {
        console.error("Logout error:", err);
      } finally {
        this.clearUser();
      }
    },
    async getCurrentUser() {
      try {
        const response = await $fetch("/api/auth/me");
        if (response.success) {
          this.setUser(response.data as any);
          return response.data;
        }

        this.clearUser();
        return null;
      } catch (err) {
        console.error("Get current user error:", err);
        this.clearUser();
        return null;
      }
    },
  },
  // persist: {
  //   storage: piniaPluginPersistedstate.localStorage(),
  // },
  persist: true,
});
