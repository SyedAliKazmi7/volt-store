import { create } from "zustand";
import { persist } from "zustand/middleware";

// Each cart line has a key. Older saved carts have no key, so fall back to the id.
export const lineKey = (item) => item.key ?? item.id;

export const useCart = create(
  persist(
    (set) => ({
      items: [],

      // "note" describes a custom design. The same product with a different note is a separate line.
      add: (product, qty = 1, note = "") =>
        set((state) => {
          const max = product.stock ?? 99;
          const key = note ? `${product._id}::${note}` : product._id;
          const existing = state.items.find((item) => lineKey(item) === key);

          if (existing) {
            return {
              items: state.items.map((item) =>
                lineKey(item) === key ? { ...item, qty: Math.min(item.qty + qty, max) } : item
              ),
            };
          }

          return {
            items: [
              ...state.items,
              {
                key,
                id: product._id,
                slug: product.slug,
                name: product.name,
                brand: product.brand,
                price: product.price,
                image: product.images?.[0] ?? null,
                stock: max,
                qty: Math.min(qty, max),
                note,
              },
            ],
          };
        }),

      setQty: (key, qty) =>
        set((state) => ({
          items: state.items.map((item) =>
            lineKey(item) === key ? { ...item, qty: Math.max(1, Math.min(qty, item.stock)) } : item
          ),
        })),

      remove: (key) =>
        set((state) => ({ items: state.items.filter((item) => lineKey(item) !== key) })),

      clear: () => set({ items: [] }),
    }),
    { name: "volt-cart" }
  )
);

export const cartCount = (state) =>
  state.items.reduce((total, item) => total + item.qty, 0);

export const cartTotal = (state) =>
  state.items.reduce((total, item) => total + item.qty * item.price, 0);