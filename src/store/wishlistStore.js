import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],
      toggleWishlist: (product) => {
        const existing = get().items.find((i) => i.id === product.id);
        if (existing) {
          set({ items: get().items.filter((i) => i.id !== product.id) });
        } else {
          set({ items: [...get().items, product] });
        }
      },
      isInWishlist: (id) => get().items.some((i) => i.id === id),
    }),
    { name: 'anti-tarnish-wishlist' }
  )
);

export default useWishlistStore;
