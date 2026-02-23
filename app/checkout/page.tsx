"use client";
import React, { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import OrderSummary from "@/components/tickets/OrderSummary";
import PaymentMethodSelector from "@/components/tickets/PaymentMethodSelector";
import Button from "@/components/ui/Button";
import { useCart } from "@/features/merchandise/CartProvider";

type Order = {
  id: string;
  eventId: string;
  items: Array<{ type: "General" | "VIP"; quantity: number; price: number }>;
  total: number;
  status: "pending" | "paid";
};

/* Step indicator */
function Steps({ current, labels }: { current: number; labels: string[] }) {
  return (
    <div className="mb-8 flex items-center justify-center gap-2">
      {labels.map((s, i) => (
        <React.Fragment key={s}>
          <div className="flex items-center gap-1.5">
            <div
              className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${i <= current
                ? "bg-primary-600 text-white"
                : "bg-neutral-200 text-neutral-500"
                }`}
            >
              {i + 1}
            </div>
            <span
              className={`hidden text-xs font-medium sm:inline ${i <= current ? "text-neutral-900" : "text-neutral-400"
                }`}
            >
              {s}
            </span>
          </div>
          {i < labels.length - 1 && (
            <div
              className={`h-px w-8 ${i < current ? "bg-primary-600" : "bg-neutral-200"
                }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

// ── Merch checkout summary ──────────────────────────────────────────────────

function MerchSummary({ items, total }: { items: { name: string; quantity: number; price: number; image: string; size?: string }[]; total: number }) {
  return (
    <div className="rounded-xl border border-neutral-100 bg-white p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-neutral-900">Order Summary</h3>
      <div className="mt-3 space-y-3">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-neutral-50 text-xl">
              {item.image}
            </span>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium text-neutral-900">{item.name}</p>
              {item.size && <p className="text-[11px] text-neutral-400">Size: {item.size}</p>}
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-neutral-900 tabular-nums">${(item.price * item.quantity).toFixed(2)}</p>
              <p className="text-[11px] text-neutral-400">×{item.quantity}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-between border-t border-neutral-100 pt-3">
        <span className="text-sm font-semibold text-neutral-900">Total</span>
        <span className="text-base font-bold text-neutral-900 tabular-nums">${total.toFixed(2)}</span>
      </div>
    </div>
  );
}

// ── Checkout content ────────────────────────────────────────────────────────

function CheckoutContent() {
  const params = useSearchParams();
  const router = useRouter();
  const checkoutType = params.get("type") || "ticket"; // "ticket" | "merch"
  const orderId = params.get("orderId") || "";

  const { items: cartItems, total: cartTotal, clearCart } = useCart();

  const [order, setOrder] = React.useState<Order | null>(null);
  const [method, setMethod] = React.useState<"wallet" | "card">("wallet");
  const [loading, setLoading] = React.useState(checkoutType === "ticket");
  const [processing, setProcessing] = React.useState(false);

  const isMerch = checkoutType === "merch";

  React.useEffect(() => {
    if (!isMerch && orderId) {
      async function load() {
        const res = await fetch(`/api/orders?id=${orderId}`);
        const data = await res.json();
        if (res.ok) setOrder(data.order as Order);
        setLoading(false);
      }
      load();
    }
  }, [orderId, isMerch]);

  function proceed() {
    if (isMerch) {
      // Simulate merch payment flow
      setProcessing(true);
      setTimeout(() => {
        clearCart();
        router.replace("/confirmation/merch-order?type=merch");
      }, 1500);
      return;
    }
    if (!order) return;
    router.replace(`/payment?orderId=${order.id}&method=${method}`);
  }

  const stepLabels = isMerch ? ["Cart", "Checkout", "Done"] : ["Tickets", "Checkout", "Payment"];
  const isEmpty = isMerch ? cartItems.length === 0 : !order;
  const showLoading = !isMerch ? loading : false;

  return (
    <ProtectedRoute allowRoles={["attendee"]}>
      <div className="container py-8">
        {/* Breadcrumb */}
        <nav className="mb-4 flex items-center gap-1.5 text-xs text-neutral-400">
          <Link href="/" className="hover:text-neutral-600">Home</Link>
          <span>/</span>
          {isMerch && (
            <>
              <Link href="/cart" className="hover:text-neutral-600">Cart</Link>
              <span>/</span>
            </>
          )}
          <span className="text-neutral-600">Checkout</span>
        </nav>

        <Steps current={1} labels={stepLabels} />

        {showLoading ? (
          <div className="mx-auto max-w-2xl space-y-4">
            <div className="h-48 animate-pulse rounded-xl bg-neutral-200" />
            <div className="h-32 animate-pulse rounded-xl bg-neutral-200" />
          </div>
        ) : isEmpty ? (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <span className="text-4xl">{isMerch ? "🛒" : "🎟️"}</span>
            <p className="text-sm text-neutral-500">
              {isMerch ? "Your cart is empty." : "Order not found."}
            </p>
            <Link href={isMerch ? "/explore" : "/"}>
              <Button variant="outline" size="sm">
                {isMerch ? "Browse Events" : "Go Home"}
              </Button>
            </Link>
          </div>
        ) : (
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-6 lg:grid-cols-5">
            {/* Left: Payment method */}
            <div className="lg:col-span-3">
              <h2 className="mb-4 text-base font-semibold text-neutral-900">
                Payment Method
              </h2>
              <PaymentMethodSelector value={method} onChange={setMethod} />

              <div className="mt-6">
                <Button
                  onClick={proceed}
                  className="w-full"
                  size="lg"
                  disabled={processing}
                >
                  {processing ? "Processing…" : "Proceed to Payment"}
                </Button>
              </div>
            </div>

            {/* Right: Order summary */}
            <div className="lg:col-span-2">
              {isMerch ? (
                <MerchSummary items={cartItems} total={cartTotal} />
              ) : (
                order && <OrderSummary items={order.items} total={order.total} />
              )}
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="container flex items-center justify-center py-24">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-primary-600" />
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
