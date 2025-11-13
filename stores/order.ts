import { getServices } from "@/server/api";
import { type Order } from "@/models/order";
import { defineStore } from "pinia";

const baseUrl = "/orders";

const { create, deleteById, getAll, api } = getServices(baseUrl);

export const useOrderStore = defineStore("orders", {
  state: () => ({
    loading: false,
  }),
  actions: {
    async add(order: Order) {
      this.loading = true;
      try {
        await create(order);
      } catch (err) {
        throw err;
      } finally {
        this.loading = false;
      }
    },
    async deleteById(cashId: string) {
      this.loading = true;
      try {
        await deleteById(cashId);
      } catch (err) {
        throw err;
      } finally {
        this.loading = false;
      }
    },
    async getActives() {
      this.loading = true;
      const reqURL = "orders/active";
      try {
        return await getAll(reqURL);
      } catch (err) {
        throw err;
      } finally {
        this.loading = false;
      }
    },
    async getStarted() {
      this.loading = true;
      const reqURL = "orders/started";
      try {
        return await getAll(reqURL);
      } catch (err) {
        throw err;
      } finally {
        this.loading = false;
      }
    },
    async getFinisheds() {
      this.loading = true;
      const reqURL = "orders/finished";
      try {
        return await getAll(reqURL);
      } catch (err) {
        throw err;
      } finally {
        this.loading = false;
      }
    },
    async startOrder(orderId: number) {
      this.loading = true;
      const reqURL = `orders/${orderId}/start`;
      try {
        return await api.post(reqURL);
      } catch (err) {
        throw err;
      } finally {
        this.loading = false;
      }
    },
    async startChat(orderId: number) {
      this.loading = true;
      const reqURL = `/order/start/${orderId}`;
      try {
        return await api.post(reqURL);
      } catch (err) {
        throw err;
      } finally {
        this.loading = false;
      }
    },
  },
  persist: true,
});
