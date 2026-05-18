"use client";
import { Ticket } from 'lucide-react';
import React from "react";
import Link from "next/link";
import { useToast } from "@/components/ui/ToastProvider";

type Order = {
  id: string;
  eventId: string;
  items: Array<{
    type: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: "pending" | "paid" | "refunded";
  createdAt: number;
};

function TicketIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path d="M16.5 6v.75m0 3v.75m0 3v.75m0 3v.75M9.75 3h4.5m-4.5 15h4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

export default function AttendeeOrdersPage() {
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [refunding, setRefunding] = React.useState<string | null>(null);
  const { addToast } = useToast();

  React.useEffect(() => {
    async function loadOrders() {
      try {
        const response = await fetch("/api/orders/user");
        const data = await response.json();

        if (data.success) {
          setOrders(data.orders || []);
        }
      } catch (error) {
        console.error("Failed to load orders:", error);
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, []);

  const handleRefund = async (orderId: string) => {
    setRefunding(orderId);

    try {
      const response = await fetch(`/api/orders/${orderId}/refund`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: "Customer requested refund" })
      });

      const data = await response.json();

      if (data.success) {
        setOrders(prev =>
          prev.map(order =>
            order.id === orderId
              ? { ...order, status: "refunded" as const }
              : order
          )
        );

        addToast(
          `Refund processed! $${data.data.refundAmount.toFixed(2)} has been added to your wallet.`,
          {
            type: "success",
            duration: 5000,
            action: {
              label: "View Wallet",
              onClick: () => window.location.href = "/wallet"
            }
          }
        );
      } else {
        addToast(data.error || "Failed to process refund", { type: "error" });
      }
    } catch (error) {
      addToast("An error occurred while processing the refund", { type: "error" });
    } finally {
      setRefunding(null);
    }
  };

  const getStatusBadge = (status: Order["status"]) => {
    const styles = {
      pending: "bg-amber-50 text-amber-700 border-amber-200",
      paid: "bg-emerald-50 text-emerald-700 border-emerald-200",
      refunded: "bg-neutral-100 text-neutral-600 border-neutral-200"
    };

    const labels = {
      pending: "Pending",
      paid: "Paid",
      refunded: "Refunded"
    };

    return (
      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  return (
    <>
      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/attendee"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-600 transition hover:bg-neutral-50"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">My Orders</h1>
          <p className="mt-0.5 text-sm text-neutral-500">
            View and manage your ticket orders
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm">
              <div className="animate-pulse space-y-3">
                <div className="h-4 w-1/3 rounded bg-neutral-100" />
                <div className="h-3 w-1/2 rounded bg-neutral-100" />
                <div className="h-3 w-1/4 rounded bg-neutral-100" />
              </div>
            </div>
          ))
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-neutral-100 bg-white px-5 py-12 text-center shadow-sm">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 text-2xl">
              <Ticket className="h-4 w-4 inline-block" />
            </span>
            <div>
              <p className="text-sm font-medium text-neutral-900">No orders yet</p>
              <p className="mt-0.5 text-xs text-neutral-400">
                Start exploring events and book your tickets
              </p>
            </div>
            <Link
              href="/explore"
              className="mt-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-700"
            >
              Explore Events
            </Link>
          </div>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="flex gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-50 text-primary-600">
                    <TicketIcon />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-neutral-900">
                        Order #{order.id.slice(-8)}
                      </h3>
                      {getStatusBadge(order.status)}
                    </div>
                    <p className="mt-1 text-sm text-neutral-500">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                      })}
                    </p>
                    <div className="mt-3 space-y-1">
                      {order.items.map((item, idx) => (
                        <p key={idx} className="text-sm text-neutral-600">
                          {item.quantity}x {item.type} Ticket @ ${item.price.toFixed(2)}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-neutral-500">Total</p>
                  <p className="text-2xl font-bold text-neutral-900">
                    ${order.total.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 border-t border-neutral-100 pt-4">
                {order.status === "paid" && (
                  <>
                    <button
                      onClick={() => handleRefund(order.id)}
                      disabled={refunding === order.id}
                      className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {refunding === order.id ? "Processing..." : "Request Refund"}
                    </button>
                    <Link
                      href={`/confirmation?orderId=${order.id}`}
                      className="rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
                    >
                      View Tickets
                    </Link>
                  </>
                )}
                {order.status === "refunded" && (
                  <p className="text-sm text-neutral-500">
                    Refund processed. Funds have been returned to your wallet.
                  </p>
                )}
                {order.status === "pending" && (
                  <Link
                    href={`/payment?orderId=${order.id}`}
                    className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-700"
                  >
                    Complete Payment
                  </Link>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-6 rounded-2xl border border-primary-100 bg-primary-50 p-5">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-primary-900">Refund Policy</h4>
            <p className="mt-1 text-sm text-primary-700">
              Refunds are processed instantly to your GUESTLY Wallet. You can request a refund up to 24 hours before the event starts. The refunded amount will be available immediately for future purchases.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
