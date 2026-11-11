import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCart = create(
  persist(
    (set) => ({
      items: [],

      add: (product, qty = 1) =>
        set((state) => {
          const max = product.stock ?? 99;
          const existing = state.items.find((item) => item.id === product._id);

          if (existing) {
            return {
              items: state.items.map((item) =>
                item.id === product._id
                  ? { ...item, qty: Math.min(item.qty + qty, max) }
                  : item
              ),
            };
          }

          return {
            items: [
              ...state.items,
              {
                id: product._id,
                slug: product.slug,
                name: product.name,
                brand: product.brand,
                price: product.price,
                image: product.images?.[0] ?? null,
                stock: max,
                qty: Math.min(qty, max),
              },
            ],
          };
        }),

      setQty: (id, qty) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id
              ? { ...item, qty: Math.max(1, Math.min(qty, item.stock)) }
              : item
          ),
        })),

      remove: (id) =>
        set((state) => ({ items: state.items.filter((item) => item.id !== id) })),

      clear: () => set({ items: [] }),
    }),
    { name: "volt-cart" }
  )
);

export const cartCount = (state) =>
  state.items.reduce((total, item) => total + item.qty, 0);

export const cartTotal = (state) =>
  state.items.reduce((total, item) => total + item.qty * item.price, 0);