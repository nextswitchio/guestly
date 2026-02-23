"use client";
import React from "react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

type Availability = {
  eventId: string;
  tickets: Array<{ type: "General" | "VIP"; price: number; available: number }>;
};

export default function TicketSelector({
  eventId,
  onContinue,
}: {
  eventId: string;
  onContinue: (orderId: string) => void;
}) {
  const [avail, setAvail] = React.useState<Availability | null>(null);
  const [quantities, setQuantities] = React.useState<Record<string, number>>({});
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    async function load() {
      const res = await fetch(`/api/tickets?eventId=${eventId}`);
      const data = await res.json();
      if (res.ok) setAvail(data.availability as Availability);
    }
    load();
  }, [eventId]);

  function setQty(type: string, qty: number) {
    setQuantities((q) => ({ ...q, [type]: Math.max(0, qty) }));
  }

  const total =
    avail?.tickets.reduce(
      (sum, t) => sum + (quantities[t.type] || 0) * t.price,
      0
    ) ?? 0;

  const hasItems = Object.values(quantities).some((q) => q > 0);

  async function continueFlow() {
    if (!avail) return;
    const items = avail.tickets
      .map((t) => ({ type: t.type, quantity: quantities[t.type] || 0 }))
      .filter((i) => i.quantity > 0);
    if (items.length === 0) return;
    setLoading(true);
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventId: avail.eventId, items }),
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) onContinue(data.order.id as string);
  }

  if (!avail) {
    return (
      <div className="flex flex-col gap-3">
        {[1, 2].map((i) => (
          <div key={i} className="h-20 animate-pulse rounded-xl bg-neutral-200" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {avail.tickets.map((t) => {
        const qty = quantities[t.type] || 0;
        return (
          <div
            key={t.type}
            className="flex items-center justify-between rounded-xl border border-neutral-100 bg-white p-5 shadow-sm"
          >
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-neutral-900">
                  {t.type}
                </span>
                {t.type === "VIP" && <Badge variant="warning">Premium</Badge>}
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-base font-bold text-neutral-900">
                  ${t.price.toFixed(2)}
                </span>
                <span className="text-xs text-neutral-400">
                  {t.available} left
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100 disabled:opacity-40"
                onClick={() => setQty(t.type, qty - 1)}
                disabled={qty === 0}
              >
                −
              </button>
              <span className="w-9 text-center text-sm font-semibold tabular-nums">
                {qty}
              </span>
              <button
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100 disabled:opacity-40"
                onClick={() => setQty(t.type, qty + 1)}
                disabled={qty >= t.available}
              >
                +
              </button>
            </div>
          </div>
        );
      })}

      {/* Total + CTA */}
      <div className="flex items-center justify-between rounded-xl bg-neutral-50 px-5 py-4">
        <div>
          <div className="text-xs text-neutral-500">Total</div>
          <div className="text-lg font-bold text-neutral-900">
            ${total.toFixed(2)}
          </div>
        </div>
        <Button onClick={continueFlow} disabled={loading || !hasItems} size="lg">
          {loading ? "Processing\u2026" : "Continue"}
        </Button>
      </div>
    </div>
  );
}

