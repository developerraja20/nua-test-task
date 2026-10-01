import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartItem, Product } from '../types';
import { analytics } from '../services/analytics';

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (productId: number) => number;
  getTotalItemsCount: () => number;
  getTotalPrice: () => number;
  getTotalDiscountedPrice: () => number;
  getTotalSavings: () => number;
}

export function calculateDiscountedPrice(
  price: number,
  discountPercentage: number = 0
): number {
  if (!discountPercentage || discountPercentage <= 0) return price;
  const discounted = price * (1 - discountPercentage / 100);
  return Number(discounted.toFixed(2));
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product: Product, quantity: number = 1) => {
        const { items } = get();
        const existingIndex = items.findIndex(
          (item) => item.product.id === product.id
        );

        let updatedItems: CartItem[];

        if (existingIndex > -1) {
          const currentQty = items[existingIndex].quantity;
          const newQty = currentQty + quantity;
          updatedItems = [...items];
          updatedItems[existingIndex] = {
            ...items[existingIndex],
            quantity: newQty,
          };
        } else {
          updatedItems = [...items, { product, quantity }];
        }

        set({ items: updatedItems });

        analytics.logAddToCart(
          {
            id: product.id,
            title: product.title,
            price: product.price,
          },
          quantity
        );
      },

      removeItem: (productId: number) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }));
      },

      updateQuantity: (productId: number, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      getItemQuantity: (productId: number) => {
        const item = get().items.find((i) => i.product.id === productId);
        return item ? item.quantity : 0;
      },

      getTotalItemsCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getTotalPrice: () => {
        const total = get().items.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        );
        return Number(total.toFixed(2));
      },

      getTotalDiscountedPrice: () => {
        const total = get().items.reduce((sum, item) => {
          const discountedUnit = calculateDiscountedPrice(
            item.product.price,
            item.product.discountPercentage
          );
          return sum + discountedUnit * item.quantity;
        }, 0);
        return Number(total.toFixed(2));
      },

      getTotalSavings: () => {
        const original = get().getTotalPrice();
        const discounted = get().getTotalDiscountedPrice();
        return Number(Math.max(0, original - discounted).toFixed(2));
      },
    }),
    {
      name: 'shopping-cart-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
