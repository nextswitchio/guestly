"use client";
import React from "react";
import type { CartItem } from "@/types/merchandise";

// ── Context ──────────────────────────────────────────────────────────────────

interface CartContextValue {
  items: CartItem[];
  count: number;
  total: number;
  addItem: (item: Omit<CartItem, "quantity">, qty?: number) => void;
  removeItem: (productId: string, size?: string) => void;
  updateQuantity: (productId: string, qty: number, size?: string) => void;
  clearCart: () => void;
}

const CartContext = React.createContext<CartContextValue | null>(null);

// ── Hook ─────────────────────────────────────────────────────────────────────

export function useCart() {
  const ctx = React.useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}

// ── Provider ─────────────────────────────────────────────────────────────────

function cartKey(productId: string, size?: string) {
  return size ? `${productId}__${size}` : productId;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<CartItem[]>([]);

  const count = items.reduce((s, i) => s + i.quantity, 0);
  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);

  const addItem = React.useCallback((item: Omit<CartItem, "quantity">, qty = 1) => {
    setItems((prev) => {
      const key = cartKey(item.productId, item.size);
      const idx = prev.findIndex((i) => cartKey(i.productId, i.size) === key);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], quantity: copy[idx].quantity + qty };
        return copy;
      }
      return [...prev, { ...item, quantity: qty }];
    });
  }, []);

  const removeItem = React.useCallback((productId: string, size?: string) => {
    const key = cartKey(productId, size);
    setItems((prev) => prev.filter((i) => cartKey(i.productId, i.size) !== key));
  }, []);

  const updateQuantity = React.useCallback((productId: string, qty: number, size?: string) => {
    if (qty <= 0) {
      removeItem(productId, size);
      return;
    }
    const key = cartKey(productId, size);
    setItems((prev) =>
      prev.map((i) => (cartKey(i.productId, i.size) === key ? { ...i, quantity: qty } : i))
    );
  }, [removeItem]);

  const clearCart = React.useCallback(() => setItems([]), []);

  const value = React.useMemo(
    () => ({ items, count, total, addItem, removeItem, updateQuantity, clearCart }),
    [items, count, total, addItem, removeItem, updateQuantity, clearCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
