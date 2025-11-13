import { defineStore } from "pinia";
import { type Service } from "@/models/services";
import { getServices } from "@/server/api";

const baseUrl = "/services";

const { getAll, create, deleteById, edit } = getServices(baseUrl);

export const useServiceStore = defineStore("service", {
  state: () => ({
    services: [] as Service[],
    loading: false,
  }),
  actions: {
    async add(service: Service) {
      this.loading = true;
      try {
        await create(service);
      } catch (err) {
        throw err;
      } finally {
        this.loading = false;
      }
    },
    async edit(service: Service) {
      this.loading = true;
      try {
        await edit(service);
      } catch (err) {
        throw err;
      } finally {
        this.loading = false;
      }
    },
    async delete(serviceId: string) {
      this.loading = true;
      try {
        await deleteById(serviceId);
      } catch (err) {
        throw err;
      } finally {
        this.loading = false;
      }
    },
    async getAll() {
      this.loading = true;
      try {
        const response = await getAll();
        this.services = response;
        return response;
      } catch (err) {
        throw err;
      } finally {
        this.loading = false;
      }
    },
  },
  persist: true,
});
