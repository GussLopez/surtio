import { Product, ProductItem } from "@/types";
import { sileo } from "sileo";
import { create } from "zustand";

interface CartItem extends Product {
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addToCart: (product: ProductItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  getTotal: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],

  addToCart: (product) => {
    if (product.stock <= 0) return;

    const items = get().items
    const existing = items.find((item) => item.id === product.id);
    const quantityToAdd = product.quantity ?? 1;

    const currentQuantity = existing ? existing.quantity : 0;
    const newTotalQuantity = currentQuantity + quantityToAdd;

    if (newTotalQuantity > product.stock) {
      sileo.warning({
        title: 'Stock insuficiente',
        description: 'No hay stock suficiente de ese producto',
        autopilot: false
      })
      return;
    }
    if (existing) {
      if (existing.quantity + quantityToAdd > product.stock) return;

      set({
        items: get().items.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantityToAdd }
            : item,
        ),
      });
    } else {
      set({
        items: [...get().items, { ...product, quantity: quantityToAdd }],
      });
    }
  },

  removeFromCart: (id) =>
    set({
      items: get().items.filter((item) => item.id !== id),
    }),

  clearCart: () => set({ items: [] }),

  getTotal: () =>
    get().items.reduce((total, item) => total + item.price * item.quantity, 0),
}));
