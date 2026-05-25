"use client";
import React from "react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { formatCurrency } from "@/lib/utils";

type Availability = {
  eventId: string;
  tickets: Array<{ 
    type: "General" | "VIP"; 
    price: number; 
    available: number;
    attendanceType?: "physical" | "virtual";
  }>;
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

  // Create unique key for each ticket (type + attendanceType)
  function getTicketKey(ticket: Availability['tickets'][0]): string {
    return ticket.attendanceType ? `${ticket.type}-${ticket.attendanceType}` : ticket.type;
  }

  function setQty(ticketKey: string, qty: number) {
    setQuantities((q) => ({ ...q, [ticketKey]: Math.max(0, qty) }));
  }

  const total =
    avail?.tickets?.reduce(
      (sum, t) => sum + (quantities[getTicketKey(t)] || 0) * t.price,
      0
    ) ?? 0;

  const hasItems = Object.values(quantities).some((q) => q > 0);

  async function continueFlow() {
    if (!avail?.tickets?.length) return;
    const items = (avail.tickets || [])
      .map((t) => ({ 
        type: t.type, 
        quantity: quantities[getTicketKey(t)] || 0,
        attendanceType: t.attendanceType
      }))
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
      <div className="flex flex-col gap-4 animate-fade-in">
        {[1, 2].map((i) => (
          <div key={i} className="rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-card)] p-5 shimmer">
            <div className="flex items-center justify-between">
              <div className="space-y-2 flex-1">
                <div className="h-5 w-24 bg-[var(--surface-border)] rounded" />
                <div className="h-6 w-32 bg-[var(--surface-border)] rounded" />
              </div>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 bg-[var(--surface-border)] rounded-lg" />
                <div className="h-5 w-8 bg-[var(--surface-border)] rounded" />
                <div className="h-8 w-8 bg-[var(--surface-border)] rounded-lg" />
              </div>
            </div>
          </div>
        ))}
        <div className="h-20 rounded-2xl bg-[var(--surface-bg)] shimmer" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {avail.tickets.map((t) => {
        const ticketKey = getTicketKey(t);
        const qty = quantities[ticketKey] || 0;
        return (
          <div
            key={ticketKey}
            className="flex items-center justify-between rounded-xl border border-neutral-100 bg-white p-5 shadow-sm"
          >
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-neutral-900">
                  {t.type}
                </span>
                {t.type === "VIP" && <Badge variant="warning">Premium</Badge>}
                {t.attendanceType === "physical" && (
                  <Badge variant="primary">In-Person</Badge>
                )}
                {t.attendanceType === "virtual" && (
                  <Badge variant="success">Virtual</Badge>
                )}
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-base font-bold text-neutral-900">
                  {formatCurrency(t.price)}
                </span>
                <span className="text-xs text-neutral-400">
                  {t.available} left
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                className="flex h-11 w-11 items-center justify-center rounded-lg border border-neutral-200 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100 disabled:opacity-40"
                onClick={() => setQty(ticketKey, qty - 1)}
                disabled={qty === 0}
              >
                −
              </button>
              <span className="w-12 text-center text-sm font-semibold tabular-nums">
                {qty}
              </span>
              <button
                className="flex h-11 w-11 items-center justify-center rounded-lg border border-neutral-200 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100 disabled:opacity-40"
                onClick={() => setQty(ticketKey, qty + 1)}
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
            {formatCurrency(total)}
          </div>
        </div>
        <Button onClick={continueFlow} disabled={loading || !hasItems} size="lg">
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Processing…
            </span>
          ) : (
            "Continue"
          )}
        </Button>
      </div>
    </div>
  );
}

