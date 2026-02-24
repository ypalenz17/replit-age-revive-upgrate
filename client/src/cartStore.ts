import { createContext, useContext, useSyncExternalStore } from 'react';

export interface CartItem {
  slug: string;
  name: string;
  image: string;
  price: number;
  isSubscribe: boolean;
  frequency: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

let state: CartState = { items: [], isOpen: false };
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function getSnapshot() {
  return state;
}

export function useCart() {
  const snap = useSyncExternalStore(subscribe, getSnapshot);

  return {
    items: snap.items,
    isOpen: snap.isOpen,
    totalItems: snap.items.reduce((s, i) => s + i.quantity, 0),
    totalPrice: snap.items.reduce((s, i) => s + i.price * i.quantity, 0),

    openCart() {
      state = { ...state, isOpen: true };
      emit();
    },
    closeCart() {
      state = { ...state, isOpen: false };
      emit();
    },
    addItem(item: Omit<CartItem, 'quantity'>, qty = 1, silent = false) {
      const existing = state.items.find((c) => c.slug === item.slug && c.isSubscribe === item.isSubscribe);
      const openDrawer = silent ? state.isOpen : true;
      if (existing) {
        state = {
          ...state,
          isOpen: openDrawer,
          items: state.items.map((c) =>
            c.slug === item.slug && c.isSubscribe === item.isSubscribe
              ? { ...c, quantity: c.quantity + qty }
              : c
          ),
        };
      } else {
        state = { isOpen: openDrawer, items: [...state.items, { ...item, quantity: qty }] };
      }
      emit();
    },
    updateQuantity(slug: string, isSubscribe: boolean, qty: number) {
      if (qty <= 0) {
        state = { ...state, items: state.items.filter((c) => !(c.slug === slug && c.isSubscribe === isSubscribe)) };
      } else {
        state = {
          ...state,
          items: state.items.map((c) =>
            c.slug === slug && c.isSubscribe === isSubscribe ? { ...c, quantity: qty } : c
          ),
        };
      }
      emit();
    },
    removeItem(slug: string, isSubscribe: boolean) {
      state = { ...state, items: state.items.filter((c) => !(c.slug === slug && c.isSubscribe === isSubscribe)) };
      emit();
    },
  };
}
