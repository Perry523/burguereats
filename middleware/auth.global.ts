import { useLoginStore } from "~/stores/user";

export default defineNuxtRouteMiddleware((to) => {
  // const nuxtApp = useNuxtApp();
  // const loginStore = useLoginStore();
  // const user = useSupabaseUser();

  // // Check if user is authenticated via Supabase or has token
  // const isLoggedIn = !!user.value || loginStore.isLoggedIn;

  // const guestRoutes = [
  //   "/login",
  //   "/login/",
  //   "/criar-conta",
  //   "/criar-conta/",
  //   "/setup-instagram",
  //   "/setup-instagram/",
  //   "/forgot-password",
  //   "/forgot-password/",
  //   "/recover-password",
  //   "/recover-password/",
  // ];

  // if (!guestRoutes.includes(to.path) && !isLoggedIn) {
  //   return nuxtApp.$router.push("/login");
  //   // const toast = useToast()
  //   // toast.error('Sessão expirada')
  // }

  // if (guestRoutes.includes(to.path) && isLoggedIn) {
  //   // Allow setup-instagram even if logged in
  //   if (to.path.includes("/setup-instagram")) {
  //     return;
  //   }
  //   return nuxtApp.$router.push("/");
  // }
});
