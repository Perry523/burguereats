import { defineStore } from "pinia";

interface Sale {
  id: number;
  date: string;
  value: number;
  buyerEmail: string;
  purchaseSummary: string;
}

export const useSalesStore = defineStore("sales", {
  state: () => ({
    sales: [
      {
        id: 1,
        date: "2023-06-15",
        value: 100,
        buyerEmail: "john@example.com",
        purchaseSummary: "Product A, Product B",
      },
      {
        id: 2,
        date: "2023-06-20",
        value: 150,
        buyerEmail: "jane@example.com",
        purchaseSummary: "Product C, Product D",
      },
      {
        id: 3,
        date: "2023-06-25",
        value: 200,
        buyerEmail: "alex@example.com",
        purchaseSummary: "Product A, Product D",
      },
    ] as Sale[],
  }),
});
