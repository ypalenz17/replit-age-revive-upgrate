import { useSyncExternalStore } from 'react';

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

type CartItemInput = Omit<CartItem, 'quantity'>;

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

function matchesItem(c: CartItem, item: CartItemInput) {
  return c.slug === item.slug && c.isSubscribe === item.isSubscribe;
}

function openCart() {
  state = { ...state, isOpen: true };
  emit();
}

function closeCart() {
  state = { ...state, isOpen: false };
  emit();
}

function clearCart() {
  state = { items: [], isOpen: false };
  emit();
}

function addItem(item: CartItemInput, qty = 1, silent = false) {
  const normalizedQty = Number.isFinite(qty) ? Math.floor(qty) : 0;
  if (normalizedQty <= 0) {
    return;
  }

  const safeItem: CartItemInput = {
    ...item,
    price: Number.isFinite(item.price) && item.price >= 0 ? item.price : 0,
    frequency: item.frequency || (item.isSubscribe ? "Delivered monthly" : "One-time"),
  };

  const existing = state.items.find((c) => matchesItem(c, safeItem));
  const openDrawer = silent ? state.isOpen : true;

  if (existing) {
    state = {
      ...state,
      isOpen: openDrawer,
      items: state.items.map((c) =>
        matchesItem(c, safeItem)
          ? {
              ...c,
              name: safeItem.name,
              image: safeItem.image,
              price: safeItem.price,
              frequency: safeItem.frequency,
              quantity: c.quantity + normalizedQty,
            }
          : c,
      ),
    };
  } else {
    state = { isOpen: openDrawer, items: [...state.items, { ...safeItem, quantity: normalizedQty }] };
  }

  emit();
}

function updateQuantity(slug: string, isSubscribe: boolean, qty: number) {
  if (!Number.isFinite(qty)) {
    return;
  }

  const normalizedQty = Math.floor(qty);

  if (normalizedQty <= 0) {
    state = { ...state, items: state.items.filter((c) => !(c.slug === slug && c.isSubscribe === isSubscribe)) };
  } else {
    state = {
      ...state,
      items: state.items.map((c) =>
        c.slug === slug && c.isSubscribe === isSubscribe ? { ...c, quantity: normalizedQty } : c,
      ),
    };
  }

  emit();
}

function removeItem(slug: string, isSubscribe: boolean) {
  state = { ...state, items: state.items.filter((c) => !(c.slug === slug && c.isSubscribe === isSubscribe)) };
  emit();
}

export const __cartTestUtils = {
  reset() {
    state = { items: [], isOpen: false };
    emit();
  },
  getState() {
    return state;
  },
  openCart,
  closeCart,
  clearCart,
  addItem,
  updateQuantity,
  removeItem,
};

export function useCart() {
  const snap = useSyncExternalStore(subscribe, getSnapshot);

  return {
    items: snap.items,
    isOpen: snap.isOpen,
    totalItems: snap.items.reduce((s, i) => s + i.quantity, 0),
    totalPrice: snap.items.reduce((s, i) => s + i.price * i.quantity, 0),

    openCart,
    closeCart,
    clearCart,
    addItem,
    updateQuantity,
    removeItem,
  };
}
