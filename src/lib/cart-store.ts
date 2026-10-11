"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  slug: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  updateQuantity: (slug: string, quantity: number) => void;
  removeItem: (slug: string) => void;
  clear: () => void;
};

export const useCartStore = create<CartState>()(persist((set) => ({
  items: [],
  addItem: (item) => set((state) => {
    const existing = state.items.find((entry) => entry.slug === item.slug);
    if (existing) return { items: state.items.map((entry) => entry.slug === item.slug ? { ...entry, quantity: entry.quantity + 1 } : entry) };
    return { items: [...state.items, { ...item, quantity: 1 }] };
  }),
  updateQuantity: (slug, quantity) => set((state) => ({ items: quantity <= 0 ? state.items.filter((item) => item.slug !== slug) : state.items.map((item) => item.slug === slug ? { ...item, quantity: Math.min(quantity, 25) } : item) })),
  removeItem: (slug) => set((state) => ({ items: state.items.filter((item) => item.slug !== slug) })),
  clear: () => set({ items: [] }),
}), { name: "aditi-cart", skipHydration: true }));
