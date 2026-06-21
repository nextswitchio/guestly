"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { ProtectedRoute } from "@/components/ProtectedRoute";

type Order = {
  id: string;
  eventId: string;
  eventTitle?: string;
  items: Array<{
    type: string;
    quantity: number;
    price: number;
    attendanceType?: string;
  }>;
  total: number;
  status: "pending" | "paid" | "refunded";
  createdAt: number;
  paymentMethod?: string;
  reference?: string;
};

export default function OrderReceiptPage() {
  const params = useParams();
  const orderId = params.orderId as string;
  const [order, setOrder] = React.useState<Order | null>(null);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    if (!orderId) return;
    fetch(`/api/orders?id=${orderId}`)
      .then(r => r.json())
      .then(d => {
        if (!d.success && !d.order) throw new Error(d.error || "Order not found");
        setOrder(d.order || d.data);
      })
      .catch(e => setError(e.message));
  }, [orderId]);

  if (error) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-navy-950 flex items-center justify-center">
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20 mb-4">
              <svg className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-white mb-1">Receipt not found</h2>
            <p className="text-sm text-navy-400">{error}</p>
            <Link href="/attendee/orders" className="mt-6 inline-block text-sm font-semibold text-lime hover:text-lime-hover transition-colors">
              &larr; Back to Orders
            </Link>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!order) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-navy-950 flex items-center justify-center">
          <div className="flex gap-1">
            <span className="h-3 w-3 rounded-full bg-lime animate-bounce" />
            <span className="h-3 w-3 rounded-full bg-lime animate-bounce [animation-delay:0.15s]" />
            <span className="h-3 w-3 rounded-full bg-lime animate-bounce [animation-delay:0.3s]" />
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const date = new Date(order.createdAt).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit",
  });

  const statusColor = {
    paid: "bg-green-100 text-green-700",
    pending: "bg-amber-100 text-amber-700",
    refunded: "bg-neutral-100 text-neutral-600",
  }[order.status];

  const statusLabel = { paid: "Completed", pending: "Pending", refunded: "Refunded" }[order.status];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-navy-950 flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          <div id="receipt" className="bg-white rounded-[2rem] border border-white/10 shadow-2xl overflow-hidden">

            {/* Header */}
            <div className="bg-lime/10 px-8 py-6 border-b border-lime/20">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-neutral-900">Order Receipt</h1>
                <p className="text-sm text-neutral-500 mt-1">{order.eventTitle || "Event Tickets"}</p>
              </div>
              <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${statusColor}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${order.status === "paid" ? "bg-green-500" : order.status === "pending" ? "bg-amber-500" : "bg-neutral-500"}`} />
                {statusLabel}
              </span>
            </div>
          </div>

          {/* Body */}
          <div className="px-8 py-6 space-y-6">
            <div className="border-t border-neutral-100" />

            <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
              <div>
                <span className="text-neutral-500">Order Reference</span>
                <p className="font-mono font-semibold text-neutral-900 mt-0.5 break-all">
                  {order.id.split('_')[1]?.toUpperCase() || order.id.slice(0, 8).toUpperCase()}
                </p>
              </div>
              <div>
                <span className="text-neutral-500">Date</span>
                <p className="font-semibold text-neutral-900 mt-0.5">{date}</p>
              </div>
              <div>
                <span className="text-neutral-500">Payment Method</span>
                <p className="font-semibold text-neutral-900 mt-0.5 capitalize">{order.paymentMethod || "Card"}</p>
              </div>
              <div>
                <span className="text-neutral-500">Status</span>
                <p className="font-semibold text-neutral-900 mt-0.5">{statusLabel}</p>
              </div>
              {order.reference && (
                <div className="col-span-2">
                  <span className="text-neutral-500">Transaction Reference</span>
                  <p className="font-mono font-semibold text-neutral-900 mt-0.5 break-all">{order.reference}</p>
                </div>
              )}
            </div>

            <div className="border-t border-neutral-100" />

            {/* Items */}
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-neutral-400 mb-3">Items</h3>
              <div className="space-y-2">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center py-2 border-b border-neutral-50 last:border-0">
                    <div>
                      <p className="text-sm font-semibold text-neutral-900">{item.type} Ticket</p>
                      <p className="text-xs text-neutral-400">
                        {item.attendanceType || "Physical"} &middot; {item.quantity} unit{item.quantity > 1 ? "s" : ""}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-neutral-900">{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-neutral-100" />

            {/* Total */}
            <div className="flex items-center justify-between">
              <span className="text-base font-semibold text-neutral-900">Total</span>
              <span className="text-2xl font-bold text-neutral-900">{formatCurrency(order.total)}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-neutral-200 px-8 py-4 bg-neutral-50 flex items-center justify-between">
            <Link href="/attendee/orders" className="text-sm font-semibold text-neutral-600 hover:text-neutral-900 transition-colors">
              &larr; Back to Orders
            </Link>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 rounded-xl bg-lime px-5 py-2.5 text-sm font-bold text-dark hover:bg-lime-hover transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print / Download PDF
            </button>
          </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
