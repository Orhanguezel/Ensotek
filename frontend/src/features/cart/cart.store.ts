import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartState } from './cart.types';

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity = 1) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((item) => item.product_id === product.id);

        if (existingItem) {
          set({
            items: currentItems.map((item) =>
              item.product_id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          });
        } else {
          set({ items: [...currentItems, { product_id: product.id, product, quantity }] });
        }
      },
      removeItem: (productId) => {
        set({ items: get().items.filter((item) => item.product_id !== productId) });
      },
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set({
          items: get().items.map((item) =>
            item.product_id === productId ? { ...item, quantity } : item
          ),
        });
      },
      clearCart: () => set({ items: [] }),
      totalItems: () => get().items.reduce((total, item) => total + item.quantity, 0),
      totalPrice: () => get().items.reduce((total, item) => total + item.product.price * item.quantity, 0),
    }),
    {
      name: 'cart-storage',
    }
  )
);
