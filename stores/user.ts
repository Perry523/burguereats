import { defineStore } from "pinia";
interface UserInfo {
  id?: string;
  name: string;
  email: string;
  image: string;
  phone: string;
  instagram_link?: string | null;
  instagram_accounts?: string[] | null;
}
export const useLoginStore = defineStore("login", {
  state: () => ({
    token: "",
    userInfo: {} as UserInfo,
    role: "",
  }),
  getters: {
    isLoggedIn: (state) => !!state.token.length,
  },
  actions: {
    login(token: string) {
      const router = useRouter();
      this.token = token;
      router.push("/");
      // connectToSocket();
    },
    logout() {
      this.token = "";
      this.userInfo = {} as UserInfo;
      this.role = "";

      // Clear any localStorage items if needed
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_user');
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
      }
      // disconnectFromSocket();
    },
    setUser(user: UserInfo) {
      this.userInfo = user;
    },
    setRole(role: string) {
      this.role = role;
    },
  },
  persist: true,
});
