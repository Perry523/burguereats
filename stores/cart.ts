import { defineStore } from "pinia";

export interface CartSideOption {
  id: string;
  name: string;
  priceIncrement: number;
  image?: string | null;
}

export interface CartSideSelection {
  categoryId: string;
  categoryName: string;
  options: CartSideOption[];
}

export interface CartItem {
  id: string;
  dishId: string;
  name: string;
  image?: string | null;
  basePrice: number;
  unitPrice: number;
  quantity: number;
  selectionKey: string;
  selections: CartSideSelection[];
}

interface CartState {
  items: CartItem[];
}

interface AddItemPayload {
  dish: {
    id: string;
    name: string;
    price: number;
    image?: string | null;
    sideCategories?: Array<{
      id: string;
      name: string;
      description?: string | null;
      isRequired: boolean;
      maxSelections?: number | null;
      sides: Array<{
        id: string;
        name: string;
        description?: string | null;
        priceIncrement: number;
        image?: string | null;
        isAvailable: boolean;
      }>;
    }>;
  };
  selections: Record<string, string[]>;
  quantity?: number;
}

const generateId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const calculateSelections = (payload: AddItemPayload): CartSideSelection[] => {
  const categories = payload.dish.sideCategories ?? [];
  return Object.entries(payload.selections).reduce<CartSideSelection[]>((acc, [categoryId, optionIds]) => {
    const category = categories.find((item) => item.id === categoryId);
    if (!category) {
      return acc;
    }
    const chosen = category.sides.filter((side) => optionIds.includes(side.id));
    if (!chosen.length) {
      return acc;
    }
    acc.push({
      categoryId,
      categoryName: category.name,
      options: chosen.map((side) => ({
        id: side.id,
        name: side.name,
        priceIncrement: side.priceIncrement,
        image: side.image ?? null,
      })),
    });
    return acc;
  }, []);
};

const selectionKeyFromSelections = (dishId: string, selections: CartSideSelection[]) =>
  `${dishId}::${selections
    .map(
      (selection) =>
        `${selection.categoryId}:${selection.options
          .map((option) => option.id)
          .sort()
          .join(",")}`
    )
    .sort()
    .join("|")}`;

const computeUnitPrice = (basePrice: number, selections: CartSideSelection[]) =>
  basePrice +
  selections.reduce(
    (total, selection) =>
      total +
      selection.options.reduce(
        (sum, option) => sum + (Number.isFinite(option.priceIncrement) ? option.priceIncrement : 0),
        0
      ),
    0
  );

export const useCartStore = defineStore("cart", {
  state: (): CartState => ({
    items: [],
  }),
  getters: {
    itemCount: (state) => state.items.reduce((total, item) => total + item.quantity, 0),
    totalAmount: (state) =>
      state.items.reduce((total, item) => total + item.unitPrice * item.quantity, 0),
  },
  actions: {
    addItem(payload: AddItemPayload) {
      const quantity = payload.quantity && payload.quantity > 0 ? payload.quantity : 1;
      const selections = calculateSelections(payload);
      const basePrice = Number.isFinite(payload.dish.price) ? payload.dish.price : 0;
      const unitPrice = computeUnitPrice(basePrice, selections);
      const selectionKey = selectionKeyFromSelections(payload.dish.id, selections);
      const existing = this.items.find((item) => item.selectionKey === selectionKey);

      if (existing) {
        existing.quantity += quantity;
        existing.unitPrice = unitPrice;
        return existing.id;
      }

      const item: CartItem = {
        id: generateId(),
        dishId: payload.dish.id,
        name: payload.dish.name,
        image: payload.dish.image ?? null,
        basePrice,
        unitPrice,
        quantity,
        selectionKey,
        selections,
      };

      this.items.push(item);
      return item.id;
    },
    updateItem(itemId: string, payload: AddItemPayload) {
      const targetIndex = this.items.findIndex((item) => item.id === itemId);
      if (targetIndex === -1) {
        return this.addItem(payload);
      }
      const target = this.items[targetIndex];
      const quantity = payload.quantity && payload.quantity > 0 ? payload.quantity : target.quantity;
      const selections = calculateSelections(payload);
      const basePrice = Number.isFinite(payload.dish.price) ? payload.dish.price : 0;
      const unitPrice = computeUnitPrice(basePrice, selections);
      const selectionKey = selectionKeyFromSelections(payload.dish.id, selections);
      const duplicateIndex = this.items.findIndex(
        (item, index) => index !== targetIndex && item.selectionKey === selectionKey
      );
      if (duplicateIndex !== -1) {
        this.items[duplicateIndex].quantity += quantity;
        this.items.splice(targetIndex, 1);
        return this.items[duplicateIndex].id;
      }
      const updated: CartItem = {
        ...target,
        dishId: payload.dish.id,
        name: payload.dish.name,
        image: payload.dish.image ?? null,
        basePrice,
        unitPrice,
        quantity,
        selectionKey,
        selections,
      };
      this.items.splice(targetIndex, 1, updated);
      return updated.id;
    },
    removeItem(itemId: string) {
      this.items = this.items.filter((item) => item.id !== itemId);
    },
    updateQuantity(itemId: string, quantity: number) {
      const target = this.items.find((item) => item.id === itemId);
      if (!target) {
        return;
      }
      if (!quantity || quantity < 1) {
        this.removeItem(itemId);
        return;
      }
      target.quantity = quantity;
    },
    clearCart() {
      this.items = [];
    },
  },
  persist: true,
});
