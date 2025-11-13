import { getServices } from "@/server/api";
import { defineStore } from "pinia";
import type { Cash } from "../utils/models";

const baseUrl = "/cash";

const { create, deleteById, getAll, edit } = getServices(baseUrl);

export const useCashStore = defineStore("cash", {
  state: () => ({
    cashs: [] as Cash[],
    loading: false,
  }),
  actions: {
    async add(cash: Cash) {
      this.loading = true;
      try {
        await create(cash);
      } catch (err) {
        throw err;
      } finally {
        this.loading = false;
      }
    },
    async delete(cashId: string) {
      this.loading = true;
      try {
        await deleteById(cashId);
      } catch (err) {
        throw err;
      } finally {
        this.loading = false;
      }
    },
    async edit(cash: Cash) {
      this.loading = true;
      try {
        await edit(cash);
      } catch (err) {
        throw err;
      } finally {
        this.loading = false;
      }
    },
    async getAll() {
      this.loading = true;
      try {
        return await getAll();
      } catch (err) {
        throw err;
      } finally {
        this.loading = false;
      }
    },
  },
  persist: true,
});
