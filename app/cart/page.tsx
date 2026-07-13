"use client";
import { ShoppingBag, Ticket, Trash2, Plus, Minus, ShoppingCart } from "lucide-react";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/features/merchandise/CartProvider";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { formatCurrency } from "@/lib/utils";

// ── Animations ──────────────────────────────────────────────────────────────

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const spring = { type: "spring" as const, damping: 20, stiffness: 300 };

// ── Component ───────────────────────────────────────────────────────────────

export default function CartPage() {
  const {
    items,
    count,
    total,
    removeItem,
    updateQuantity,
    ticketItems,
    ticketCount,
    ticketTotal,
    removeTicketItem,
    updateTicketQuantity,
    combinedCount,
    combinedTotal,
    clearAll,
  } = useCart();
  const router = useRouter();

  const hasItems = items.length > 0 || ticketItems.length > 0;

  return (
    <div className="min-h-screen bg-navy-950 py-12 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-lime/10 blur-[120px] rounded-full" />
        <div className="absolute -bottom-40 -right-40 w-[400px] h-[400px] bg-green-600/10 blur-[100px] rounded-full" />
      </div>

      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 relative z-10">
        <AnimatePresence mode="wait">
          {!hasItems ? (
            /* ── Empty State ──────────────────────────────────────── */
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-6 py-20 text-center"
            >
              <span className="text-7xl text-navy-400">
                <ShoppingCart className="h-4 w-4 inline-block" />
              </span>
              <p className="text-xl font-bold text-navy-200">
                Your cart is empty.
              </p>
              <p className="text-sm text-navy-400 font-medium max-w-xs">
                Browse events to find tickets and merchandise.
              </p>
              <Button href="/explore" size="lg">
                Discover Experiences
              </Button>
            </motion.div>
          ) : (
            /* ── Cart Content ─────────────────────────────────────── */
            <motion.div key="cart" {...fadeUp} transition={spring}>
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12 text-center"
              >
                <Link
                  href="/explore"
                  className="inline-flex items-center gap-2 text-navy-400 hover:text-white mb-6 transition-colors font-bold text-sm"
                >
                  <Icon name="chevron-left" size={16} /> Back to Events
                </Link>
                <h1 className="text-4xl font-black text-white">Your Cart</h1>
                <p className="mt-2 text-sm text-navy-300 font-medium">
                  {combinedCount} item{combinedCount !== 1 ? "s" : ""} in your
                  cart
                  {ticketCount > 0 && count > 0 && (
                    <span className="text-navy-400">
                      {" "}
                      &middot; {ticketCount} ticket
                      {ticketCount !== 1 ? "s" : ""}
                      , {count} merch item{count !== 1 ? "s" : ""}
                    </span>
                  )}
                </p>
              </motion.div>

              <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 items-start">
                {/* ── Left: Cart Items ──────────────────────────────── */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, ...spring }}
                  className="lg:col-span-7 space-y-8"
                >
                  {/* Tickets Section */}
                  {ticketItems.length > 0 && (
                    <div className="rounded-[2rem] border border-white/10 bg-dark/50 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-lime/20 flex items-center justify-center">
                            <Ticket className="h-5 w-5 text-lime" />
                          </div>
                          <div>
                            <h2 className="text-xl font-black text-white">
                              Tickets
                            </h2>
                            <p className="text-[10px] font-black uppercase tracking-widest text-navy-400">
                              {ticketCount} item{ticketCount !== 1 ? "s" : ""}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() =>
                            ticketItems.forEach((item) =>
                              removeTicketItem(
                                item.eventId,
                                item.type,
                                item.attendanceType,
                              ),
                            )
                          }
                          className="flex items-center gap-1.5 text-xs font-bold text-navy-400 transition hover:text-white"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Clear
                        </button>
                      </div>

                      <div className="space-y-4">
                        <AnimatePresence mode="popLayout">
                          {ticketItems.map((item) => {
                            const key = item.attendanceType
                              ? `${item.eventId}-${item.type}-${item.attendanceType}`
                              : `${item.eventId}-${item.type}`;

                            return (
                              <motion.div
                                key={key}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95, x: -20 }}
                                className="flex items-center gap-4 rounded-2xl bg-white/5 border border-white/5 p-4"
                              >
                                {/* Icon */}
                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-lime/20">
                                  <Ticket className="h-6 w-6 text-lime" />
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                  <h3 className="truncate text-sm font-black text-white">
                                    {item.eventTitle}
                                  </h3>
                                  <p className="text-[10px] font-black uppercase tracking-widest text-navy-400 mt-0.5">
                                    {item.type} Ticket
                                    {item.attendanceType &&
                                      ` \u00B7 ${item.attendanceType === "physical" ? "Physical" : "Virtual"}`}
                                  </p>
                                </div>

                                {/* Quantity */}
                                <div className="flex items-center rounded-xl border border-white/10 bg-white/5">
                                  <button
                                    onClick={() =>
                                      updateTicketQuantity(
                                        item.eventId,
                                        item.type,
                                        item.quantity - 1,
                                        item.attendanceType,
                                      )
                                    }
                                    className="flex h-9 w-9 items-center justify-center text-navy-300 transition hover:text-white"
                                  >
                                    <Minus className="h-3.5 w-3.5" />
                                  </button>
                                  <span className="w-8 text-center text-sm font-bold text-white tabular-nums">
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() =>
                                      updateTicketQuantity(
                                        item.eventId,
                                        item.type,
                                        item.quantity + 1,
                                        item.attendanceType,
                                      )
                                    }
                                    className="flex h-9 w-9 items-center justify-center text-navy-300 transition hover:text-white"
                                  >
                                    <Plus className="h-3.5 w-3.5" />
                                  </button>
                                </div>

                                {/* Total + Remove */}
                                <div className="flex flex-col items-end gap-1.5">
                                  <span className="text-sm font-bold text-lime tabular-nums">
                                    {formatCurrency(
                                      item.price * item.quantity,
                                    )}
                                  </span>
                                  <button
                                    onClick={() =>
                                      removeTicketItem(
                                        item.eventId,
                                        item.type,
                                        item.attendanceType,
                                      )
                                    }
                                    className="text-navy-500 transition hover:text-white"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </motion.div>
                            );
                          })}
                        </AnimatePresence>
                      </div>
                    </div>
                  )}

                  {/* Merchandise Section */}
                  {items.length > 0 && (
                    <div className="rounded-[2rem] border border-white/10 bg-dark/50 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                            <ShoppingBag className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h2 className="text-xl font-black text-white">
                              Merchandise
                            </h2>
                            <p className="text-[10px] font-black uppercase tracking-widest text-navy-400">
                              {count} item{count !== 1 ? "s" : ""}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() =>
                            items.forEach((item) =>
                              removeItem(item.productId, item.size),
                            )
                          }
                          className="flex items-center gap-1.5 text-xs font-bold text-navy-400 transition hover:text-white"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Clear
                        </button>
                      </div>

                      <div className="space-y-4">
                        <AnimatePresence mode="popLayout">
                          {items.map((item) => {
                            const key = item.size
                              ? `${item.productId}-${item.size}`
                              : item.productId;

                            return (
                              <motion.div
                                key={key}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95, x: -20 }}
                                className="flex items-center gap-4 rounded-2xl bg-white/5 border border-white/5 p-4"
                              >
                                {/* Product image */}
                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/5 text-2xl">
                                  {item.image}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                  <h3 className="truncate text-sm font-black text-white">
                                    {item.name}
                                  </h3>
                                  {item.size && (
                                    <p className="text-[10px] font-black uppercase tracking-widest text-navy-400 mt-0.5">
                                      Size: {item.size}
                                    </p>
                                  )}
                                </div>

                                {/* Quantity */}
                                <div className="flex items-center rounded-xl border border-white/10 bg-white/5">
                                  <button
                                    onClick={() =>
                                      updateQuantity(
                                        item.productId,
                                        item.quantity - 1,
                                        item.size,
                                      )
                                    }
                                    className="flex h-9 w-9 items-center justify-center text-navy-300 transition hover:text-white"
                                  >
                                    <Minus className="h-3.5 w-3.5" />
                                  </button>
                                  <span className="w-8 text-center text-sm font-bold text-white tabular-nums">
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() =>
                                      updateQuantity(
                                        item.productId,
                                        item.quantity + 1,
                                        item.size,
                                      )
                                    }
                                    className="flex h-9 w-9 items-center justify-center text-navy-300 transition hover:text-white"
                                  >
                                    <Plus className="h-3.5 w-3.5" />
                                  </button>
                                </div>

                                {/* Total + Remove */}
                                <div className="flex flex-col items-end gap-1.5">
                                  <span className="text-sm font-bold text-lime tabular-nums">
                                    {formatCurrency(
                                      item.price * item.quantity,
                                    )}
                                  </span>
                                  <button
                                    onClick={() =>
                                      removeItem(item.productId, item.size)
                                    }
                                    className="text-navy-500 transition hover:text-white"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </motion.div>
                            );
                          })}
                        </AnimatePresence>
                      </div>
                    </div>
                  )}

                  {/* Clear All */}
                  <div className="flex justify-end">
                    <button
                      onClick={clearAll}
                      className="flex items-center gap-1.5 text-xs font-bold text-navy-400 transition hover:text-white"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Clear entire cart
                    </button>
                  </div>

                  {/* Trust Signals */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      { icon: "shield", text: "Secure Checkout" },
                      { icon: "check", text: "Verified Events" },
                      { icon: "refresh-cw", text: "Refundable" },
                    ].map((t, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 rounded-2xl bg-green-600/10 border border-success-500/20 px-4 py-3 text-green-600"
                      >
                        <Icon
                          name={t.icon as any}
                          size={16}
                        />
                        <span className="text-[10px] font-black uppercase tracking-widest">
                          {t.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* ── Right: Order Summary ───────────────────────────── */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, ...spring }}
                  className="lg:col-span-5 space-y-6"
                >
                  <div className="rounded-[2rem] border border-white/10 bg-dark/50 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
                    <h3 className="text-sm font-black uppercase tracking-widest text-white mb-6">
                      Order Summary
                    </h3>

                    <div className="space-y-4">
                      {ticketItems.length > 0 && (
                        <div className="space-y-3">
                          {ticketItems.map((item) => {
                            const key = item.attendanceType
                              ? `${item.eventId}-${item.type}-${item.attendanceType}`
                              : `${item.eventId}-${item.type}`;
                            return (
                              <div
                                key={key}
                                className="flex justify-between items-center"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="h-10 w-10 rounded-2xl bg-lime/20 flex items-center justify-center">
                                    <Ticket className="h-4 w-4 text-lime" />
                                  </div>
                                  <div>
                                    <p className="text-sm font-bold text-white">
                                      {item.eventTitle}
                                    </p>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-navy-400">
                                      {item.type} Ticket &middot; &times;
                                      {item.quantity}
                                    </p>
                                  </div>
                                </div>
                                <span className="text-sm font-bold text-white tabular-nums">
                                  {formatCurrency(item.price * item.quantity)}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {items.length > 0 && (
                        <div className="space-y-3">
                          {items.map((item) => {
                            const key = item.size
                              ? `${item.productId}-${item.size}`
                              : item.productId;
                            return (
                              <div
                                key={key}
                                className="flex justify-between items-center"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="h-10 w-10 rounded-2xl bg-white/5 flex items-center justify-center text-lg">
                                    {item.image}
                                  </div>
                                  <div>
                                    <p className="text-sm font-bold text-white">
                                      {item.name}
                                    </p>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-navy-400">
                                      {item.size || "One Size"} &middot;
                                      &times;{item.quantity}
                                    </p>
                                  </div>
                                </div>
                                <span className="text-sm font-bold text-white tabular-nums">
                                  {formatCurrency(item.price * item.quantity)}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Subtotals */}
                    <div className="mt-6 space-y-2 border-t border-white/10 pt-4">
                      {ticketCount > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-navy-300">
                            Tickets ({ticketCount})
                          </span>
                          <span className="text-white font-bold tabular-nums">
                            {formatCurrency(ticketTotal)}
                          </span>
                        </div>
                      )}
                      {count > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-navy-300">
                            Merchandise ({count})
                          </span>
                          <span className="text-white font-bold tabular-nums">
                            {formatCurrency(total)}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm">
                        <span className="text-navy-300">Shipping</span>
                        <span className="text-green-600 font-bold">Free</span>
                      </div>
                    </div>

                    {/* Total */}
                    <div className="mt-4 flex justify-between border-t border-white/10 pt-4">
                      <span className="text-sm font-black text-white">
                        Total
                      </span>
                      <span className="text-xl font-black text-lime tabular-nums">
                        {formatCurrency(combinedTotal)}
                      </span>
                    </div>

                    {/* Desktop CTA */}
                    <div className="hidden lg:block mt-6">
                      <Button
                        size="xl"
                        className="w-full h-16 text-lg font-black shadow-2xl shadow-primary-500/20"
                        onClick={() => router.push("/checkout?type=combined")}
                      >
                        Proceed to Checkout
                      </Button>
                      <p className="mt-4 text-center text-xs text-navy-400 font-medium">
                        Secure payment powered by{" "}
                        <span className="text-white font-bold">
                          Guestly Pay
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Mobile Sticky CTA */}
                  <div className="lg:hidden sticky bottom-4 z-50">
                    <Button
                      size="xl"
                      className="w-full h-16 text-lg font-black shadow-3xl shadow-primary-500/40"
                      onClick={() => router.push("/checkout?type=combined")}
                    >
                      {formatCurrency(combinedTotal)}
                    </Button>
                  </div>

                  <Link
                    href="/explore"
                    className="block text-center text-sm font-bold text-navy-400 transition hover:text-white"
                  >
                    Continue Shopping
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
