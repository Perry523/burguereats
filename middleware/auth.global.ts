import { useAuthStore } from "~/stores/auth";

export default defineNuxtRouteMiddleware(async (to, from) => {
  if (import.meta.client) {
    const loginRoutes = ["/login", "/register"];
    const user = useAuthStore().isAuthenticated;
    if (to.path === "/") {
      return true;
    }
    if (loginRoutes.includes(to.path) ) {
      if (user) {
        return navigateTo("/admin");
      } else {
        return true;
      }
    } else {
      console.log("user");
      if (!user) {
        return navigateTo("/login");
      } else {
        return true;
      }
    }
  }
});
