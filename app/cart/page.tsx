"use client";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/features/merchandise/CartProvider";
import Button from "@/components/ui/Button";

// ── Icons ────────────────────────────────────────────────────────────────────

function TrashIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
  );
}

function MinusIcon() {
  return (
    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path d="M5 12h14" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  );
}

function CartEmptyIcon() {
  return (
    <svg className="h-16 w-16 text-neutral-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
      <path d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121 0 2.002-.881 2.002-2V5.272M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
    </svg>
  );
}

// ── Component ────────────────────────────────────────────────────────────────

export default function CartPage() {
  const { items, count, total, removeItem, updateQuantity, clearCart } = useCart();
  const router = useRouter();

  if (items.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <CartEmptyIcon />
        <h1 className="text-lg font-bold text-neutral-900">Your cart is empty</h1>
        <p className="text-sm text-neutral-500">Browse event stores to find merchandise you love.</p>
        <Link href="/explore">
          <Button variant="outline">Explore Events</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-8">
      {/* Breadcrumb */}
      <nav className="mb-4 flex items-center gap-1.5 text-xs text-neutral-400">
        <Link href="/" className="hover:text-neutral-600">Home</Link>
        <span>/</span>
        <span className="text-neutral-600">Cart</span>
      </nav>

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Shopping Cart</h1>
          <p className="mt-1 text-sm text-neutral-500">{count} item{count !== 1 ? "s" : ""} in your cart</p>
        </div>
        <button
          onClick={clearCart}
          className="flex items-center gap-1.5 text-xs font-medium text-red-500 transition hover:text-red-700"
        >
          <TrashIcon />
          Clear all
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Items */}
        <div className="space-y-3 lg:col-span-2">
          {items.map((item) => {
            const key = item.size ? `${item.productId}-${item.size}` : item.productId;

            return (
              <div
                key={key}
                className="flex items-center gap-4 rounded-2xl border border-neutral-100 bg-white p-4 shadow-sm"
              >
                {/* Product image */}
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-neutral-50 text-4xl">
                  {item.image}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="truncate text-sm font-semibold text-neutral-900">{item.name}</h3>
                  {item.size && (
                    <p className="mt-0.5 text-xs text-neutral-500">Size: {item.size}</p>
                  )}
                  <p className="mt-1 text-sm font-bold text-primary-600 tabular-nums">${item.price}</p>
                </div>

                {/* Quantity */}
                <div className="flex items-center rounded-lg border border-neutral-200 bg-white">
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity - 1, item.size)}
                    className="flex h-8 w-8 items-center justify-center text-neutral-500 transition hover:text-neutral-900"
                  >
                    <MinusIcon />
                  </button>
                  <span className="w-8 text-center text-sm font-semibold text-neutral-900 tabular-nums">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity + 1, item.size)}
                    className="flex h-8 w-8 items-center justify-center text-neutral-500 transition hover:text-neutral-900"
                  >
                    <PlusIcon />
                  </button>
                </div>

                {/* Item total + remove */}
                <div className="flex flex-col items-end gap-1">
                  <span className="text-sm font-bold text-neutral-900 tabular-nums">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                  <button
                    onClick={() => removeItem(item.productId, item.size)}
                    className="text-neutral-400 transition hover:text-red-500"
                  >
                    <TrashIcon />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="h-fit rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-neutral-900">Order Summary</h2>

          <div className="mt-4 space-y-2 border-b border-neutral-100 pb-4">
            <div className="flex justify-between text-sm text-neutral-600">
              <span>Subtotal ({count} items)</span>
              <span className="tabular-nums">${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-neutral-600">
              <span>Shipping</span>
              <span className="text-success-600">Free</span>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <span className="text-sm font-semibold text-neutral-900">Total</span>
            <span className="text-lg font-bold text-neutral-900 tabular-nums">${total.toFixed(2)}</span>
          </div>

          <Button
            size="lg"
            className="mt-5 w-full"
            onClick={() => router.push("/checkout?type=merch")}
          >
            Proceed to Checkout
          </Button>

          <Link
            href="/explore"
            className="mt-3 block text-center text-xs text-primary-600 transition hover:text-primary-700"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
