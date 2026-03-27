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
  companyId?: string | null;
  role?: 'admin' | 'manager' | 'biker';
  wallet?: number;
}

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  activeCompanyId: string | null;
}

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    user: null,
    isLoading: false,
    activeCompanyId: null,
  }),
  getters: {
    isAuthenticated: (state) => state.user !== null,
    currentCompanyId: (state) => state.activeCompanyId || state.user?.company?.id || state.user?.companyId || null,
  },
  actions: {
    setUser(user: AuthUser | null) {
      this.user = user;
      if (user) {
        // If manager or biker, activeCompanyId is fixed
        if (user.role !== 'admin') {
          this.activeCompanyId = user.company?.id || user.companyId || null;
        } else if (!this.activeCompanyId) {
          // If admin and no active company selected, default to their own if any
          this.activeCompanyId = user.company?.id || user.companyId || null;
        }
      } else {
        this.activeCompanyId = null;
      }
    },
    setActiveCompanyId(id: string | null) {
      this.activeCompanyId = id;
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
