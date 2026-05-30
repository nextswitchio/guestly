"use client";
import React from "react";
import Link from "next/link";
import { useToast } from "@/components/ui/ToastProvider";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import EmptyState from "@/components/ui/EmptyState";
import { useCurrency } from "@/lib/currency";

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

function statusVariant(status: Order["status"]) {
  const map = { pending: "warning" as const, paid: "success" as const, refunded: "neutral" as const };
  return map[status];
}

const statusLabel = { pending: "Pending", paid: "Completed", refunded: "Refunded" };

export default function AttendeeOrdersPage() {
  const { formatAmount } = useCurrency();
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
        body: JSON.stringify({ reason: "Customer requested refund" }),
      });
      const data = await response.json();
      if (data.success) {
        setOrders(prev =>
          prev.map(order =>
            order.id === orderId ? { ...order, status: "refunded" as const } : order
          )
        );
        addToast(
          `Refund processed! ${formatAmount(data.data.refundAmount)} has been added to your wallet.`,
          {
            type: "success",
            duration: 5000,
            action: {
              label: "View Wallet",
              onClick: () => window.location.href = "/wallet",
            },
          }
        );
      } else {
        addToast(data.error || "Failed to process refund", { type: "error" });
      }
    } catch {
      addToast("An error occurred while processing the refund", { type: "error" });
    } finally {
      setRefunding(null);
    }
  };

  return (
    <div className="flex flex-col gap-6 sm:gap-8">
      <div className="flex items-center gap-3">
        <Link
          href="/attendee"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-600 transition hover:bg-neutral-50"
        >
          <Icon name="chevron-left" size={16} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">My Orders</h1>
          <p className="mt-0.5 text-sm text-neutral-500">
            View and manage your ticket orders
          </p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} padding="lg" className="animate-pulse">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 shrink-0 rounded-xl bg-neutral-100" />
                <div className="flex-1 space-y-3">
                  <div className="h-4 w-1/3 rounded bg-neutral-100" />
                  <div className="h-3 w-1/2 rounded bg-neutral-100" />
                  <div className="h-3 w-1/4 rounded bg-neutral-100" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <EmptyState
          icon="ticket"
          title="No orders yet"
          description="Start exploring events and book your tickets"
          action={{ label: "Explore Events", href: "/explore" }}
          tips={[
            "Search events by category, location, or date",
            "Save events to your wishlist for later",
            "Enable notifications for early-bird discounts",
          ]}
        />
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} padding="lg" hoverable>
              <div className="flex flex-col gap-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 min-w-0">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-lime/10 text-lime">
                      <Icon name="ticket" size={22} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-neutral-900 truncate">
                          Order #{order.id.slice(-8)}
                        </h3>
                        <Badge variant={statusVariant(order.status)} dot>
                          {statusLabel[order.status]}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-neutral-500">
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                      <div className="mt-3 space-y-1">
                        {order.items.map((item, idx) => (
                          <p key={idx} className="text-sm text-neutral-600">
                            {item.quantity}x {item.type} Ticket &middot; {formatAmount(item.price)}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-medium text-neutral-500">Total</p>
                    <p className="text-2xl font-bold text-neutral-900">
                      {formatAmount(order.total)}
                    </p>
                  </div>
                </div>

                {order.status === "paid" && (
                  <div className="flex items-center gap-3 flex-wrap border-t border-neutral-100 pt-4">
                    <Button
                      variant="danger"
                      size="sm"
                      loading={refunding === order.id}
                      disabled={refunding === order.id}
                      onClick={() => handleRefund(order.id)}
                    >
                      <Icon name="refresh-cw" size={14} />
                      {refunding === order.id ? "Processing..." : "Request Refund"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      href={`/confirmation/${order.id}`}
                    >
                      <Icon name="eye" size={14} />
                      View Tickets
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      href={`/receipt/${order.id}`}
                    >
                      <Icon name="download" size={14} />
                      Receipt
                    </Button>
                  </div>
                )}

                {order.status === "refunded" && (
                  <div className="border-t border-neutral-100 pt-4">
                    <p className="text-sm text-neutral-500 flex items-center gap-2">
                      <Icon name="refresh-cw" size={14} className="text-neutral-400" />
                      Refund processed. Funds have been returned to your wallet.
                    </p>
                  </div>
                )}

                {order.status === "pending" && (
                  <div className="border-t border-neutral-100 pt-4">
                    <Button
                      variant="primary"
                      size="sm"
                      href={`/checkout?orderId=${order.id}`}
                    >
                      Complete Payment
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      <Card variant="bordered" padding="md" className="border-primary-100 bg-primary-50">
        <div className="flex gap-3">
          <div className="flex-shrink-0 mt-0.5">
            <Icon name="information-circle" size={20} className="text-primary-600" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-primary-900">Refund Policy</h4>
            <p className="mt-1 text-sm text-primary-700 leading-relaxed">
              Refunds are processed instantly to your GUESTLY Wallet. You can request a refund
              up to 24 hours before the event starts. The refunded amount will be available
              immediately for future purchases.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
