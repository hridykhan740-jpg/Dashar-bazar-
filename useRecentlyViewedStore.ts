import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '../types';

interface RecentlyViewedState {
  items: Product[];
  addItem: (product: Product) => void;
  clear: () => void;
}

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (product) => set((state) => {
        const filtered = state.items.filter(item => item.id !== product.id);
        return { items: [product, ...filtered].slice(0, 10) };
      }),
      clear: () => set({ items: [] }),
    }),
    { name: 'recently-viewed' }
  )
);
