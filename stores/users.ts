import { getServices } from "@/server/api";
import { defineStore } from "pinia";
import { type User } from "~/models/user";

const baseUrl = "/users";

const { getAll, api } = getServices(baseUrl);

export const useUserStore = defineStore("users", {
  state: () => ({
    loading: false,
  }),
  actions: {
    async getUsers(typeUser: string) {
      this.loading = true;
      try {
        return await getAll(typeUser);
      } catch (err) {
        throw err;
      } finally {
        this.loading = false;
      }
    },
    async createUser(user: User) {
      this.loading = true;
      try {
        await api.post("/users", user);
      } catch (err) {
        throw err;
      } finally {
        this.loading = false;
      }
    },
    async createProfessional(user: User) {
      this.loading = true;
      try {
        await api.post("/professionals", user);
      } catch (err) {
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async editUser(typeUser: string, user: User) {
      this.loading = true;
      try {
        return await api.put(`/${typeUser}`, user);
      } catch (err) {
        throw err;
      } finally {
        this.loading = false;
      }
    },
    // eslint-disable-next-line
    async deleteUser(typeUser: string, id: string) {
      this.loading = true;
      try {
        // req to delete
        // this endpoint not working in api
        // await api.delete(`/${id}`);
      } catch (err) {
        throw err;
      } finally {
        this.loading = false;
      }
    },
  },
  persist: true,
});
