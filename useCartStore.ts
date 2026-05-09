import { create } from 'zustand';
import { CartItem, Product, Coupon } from '../types';

interface CartState {
  items: CartItem[];
  coupon: Coupon | null;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (coupon: Coupon) => void;
  removeCoupon: () => void;
  totalItems: () => number;
  totalPrice: () => number;
  discountTotal: () => number;
  grandTotal: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  coupon: null,
  addItem: (product, quantity = 1) => {
    set((state) => {
      const existing = state.items.find((item) => item.id === product.id);
      if (existing) {
        return {
          items: state.items.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
          ),
        };
      }
      return { items: [...state.items, { ...product, quantity }] };
    });
  },
  removeItem: (productId) => {
    set((state) => ({ items: state.items.filter((item) => item.id !== productId) }));
  },
  updateQuantity: (productId, quantity) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item
      ),
    }));
  },
  clearCart: () => set({ items: [], coupon: null }),
  applyCoupon: (coupon) => set({ coupon }),
  removeCoupon: () => set({ coupon: null }),
  totalItems: () => get().items.reduce((acc, item) => acc + item.quantity, 0),
  totalPrice: () => get().items.reduce((acc, item) => acc + (item.discountPrice || item.price) * item.quantity, 0),
  discountTotal: () => {
    const total = get().totalPrice();
    const coupon = get().coupon;
    if (!coupon || !coupon.isActive) return 0;
    
    // Check min spend
    if (coupon.minSpend && total < coupon.minSpend) return 0;

    if (coupon.discountType === 'PERCENTAGE') {
      return (total * coupon.discountValue) / 100;
    } else {
      return Math.min(total, coupon.discountValue);
    }
  },
  grandTotal: () => get().totalPrice() - get().discountTotal(),
}));
