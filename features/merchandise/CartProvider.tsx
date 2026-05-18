"use client";
import React from "react";
import type { CartItem } from "@/types/merchandise";
import type { OrderItem } from "@/lib/store";

// ── Types ────────────────────────────────────────────────────────────────────

export interface TicketCartItem extends OrderItem {
  eventId: string;
  eventTitle: string;
}

// ── Context ──────────────────────────────────────────────────────────────────

interface CartContextValue {
  // Merchandise
  items: CartItem[];
  count: number;
  total: number;
  addItem: (item: Omit<CartItem, "quantity">, qty?: number) => void;
  removeItem: (productId: string, size?: string) => void;
  updateQuantity: (productId: string, qty: number, size?: string) => void;
  clearCart: () => void;
  
  // Tickets
  ticketItems: TicketCartItem[];
  ticketCount: number;
  ticketTotal: number;
  addTicketItem: (item: TicketCartItem) => void;
  removeTicketItem: (eventId: string, type: string, attendanceType?: string) => void;
  updateTicketQuantity: (eventId: string, type: string, qty: number, attendanceType?: string) => void;
  clearTicketCart: () => void;
  
  // Combined
  combinedCount: number;
  combinedTotal: number;
  clearAll: () => void;
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

function ticketKey(eventId: string, type: string, attendanceType?: string) {
  return attendanceType ? `${eventId}__${type}__${attendanceType}` : `${eventId}__${type}`;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  // Merchandise state
  const [items, setItems] = React.useState<CartItem[]>([]);
  
  // Ticket state
  const [ticketItems, setTicketItems] = React.useState<TicketCartItem[]>([]);

  // Merchandise calculations
  const count = items.reduce((s, i) => s + i.quantity, 0);
  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);

  // Ticket calculations
  const ticketCount = ticketItems.reduce((s, i) => s + i.quantity, 0);
  const ticketTotal = ticketItems.reduce((s, i) => s + i.price * i.quantity, 0);

  // Combined calculations
  const combinedCount = count + ticketCount;
  const combinedTotal = total + ticketTotal;

  // Merchandise methods
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

  // Ticket methods
  const addTicketItem = React.useCallback((item: TicketCartItem) => {
    setTicketItems((prev) => {
      const key = ticketKey(item.eventId, item.type, item.attendanceType);
      const idx = prev.findIndex((i) => ticketKey(i.eventId, i.type, i.attendanceType) === key);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], quantity: copy[idx].quantity + item.quantity };
        return copy;
      }
      return [...prev, item];
    });
  }, []);

  const removeTicketItem = React.useCallback((eventId: string, type: string, attendanceType?: string) => {
    const key = ticketKey(eventId, type, attendanceType);
    setTicketItems((prev) => prev.filter((i) => ticketKey(i.eventId, i.type, i.attendanceType) !== key));
  }, []);

  const updateTicketQuantity = React.useCallback((eventId: string, type: string, qty: number, attendanceType?: string) => {
    if (qty <= 0) {
      removeTicketItem(eventId, type, attendanceType);
      return;
    }
    const key = ticketKey(eventId, type, attendanceType);
    setTicketItems((prev) =>
      prev.map((i) => (ticketKey(i.eventId, i.type, i.attendanceType) === key ? { ...i, quantity: qty } : i))
    );
  }, [removeTicketItem]);

  const clearTicketCart = React.useCallback(() => setTicketItems([]), []);

  // Combined methods
  const clearAll = React.useCallback(() => {
    setItems([]);
    setTicketItems([]);
  }, []);

  const value = React.useMemo(
    () => ({ 
      items, 
      count, 
      total, 
      addItem, 
      removeItem, 
      updateQuantity, 
      clearCart,
      ticketItems,
      ticketCount,
      ticketTotal,
      addTicketItem,
      removeTicketItem,
      updateTicketQuantity,
      clearTicketCart,
      combinedCount,
      combinedTotal,
      clearAll
    }),
    [
      items, 
      count, 
      total, 
      addItem, 
      removeItem, 
      updateQuantity, 
      clearCart,
      ticketItems,
      ticketCount,
      ticketTotal,
      addTicketItem,
      removeTicketItem,
      updateTicketQuantity,
      clearTicketCart,
      combinedCount,
      combinedTotal,
      clearAll
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
