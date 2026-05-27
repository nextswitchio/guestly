"use client";
import React from "react";
import Button from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils";

type TicketItem = {
  id?: string;
  type?: string;
  name?: string;
  price: number;
  available: number;
  attendanceType?: "physical" | "virtual";
};

type Availability = {
  eventId: string;
  tickets?: Array<TicketItem>;
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

  // Create unique key for each ticket (type/name + attendanceType)
  function getTicketKey(ticket: TicketItem): string {
    const label = ticket.type ?? ticket.name ?? "ticket";
    return ticket.attendanceType ? `${label}-${ticket.attendanceType}` : label;
  }

  function setQty(ticketKey: string, qty: number) {
    setQuantities((q) => ({ ...q, [ticketKey]: Math.max(0, qty) }));
  }

  const ticketItems = avail?.tickets ?? [];
  const total =
    ticketItems.reduce(
      (sum, t) => sum + (quantities[getTicketKey(t)] || 0) * t.price,
      0
    ) ?? 0;

  const hasItems = Object.values(quantities).some((q) => q > 0);

  async function continueFlow() {
    if (!avail || !ticketItems.length) return;
    const items = ticketItems
      .map((t) => ({
        ticketId: t.id,
        type: t.type ?? t.name ?? "Ticket",
        quantity: quantities[getTicketKey(t)] || 0,
        attendanceType: t.attendanceType,
      }))
      .filter((i) => i.quantity > 0 && !!i.ticketId);
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

  if (!ticketItems.length) {
    return (
      <div className="rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-card)] p-5">
        <p className="text-sm text-neutral-500">No tickets are available for this event.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {ticketItems.map((t) => {
        const ticketKey = getTicketKey(t);
        const qty = quantities[ticketKey] || 0;
        const ticketLabel = t.type ?? t.name ?? "Ticket";
        const isVIP = t.type === "VIP" || t.name?.toLowerCase().includes("vip");
        return (
          <div
            key={ticketKey}
            className={`group flex flex-col gap-4 rounded-[1.75rem] border border-slate-200/80 bg-slate-50 p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg ${t.available === 0 ? "opacity-80" : ""}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${isVIP ? "bg-warning-100 text-warning-700" : "bg-primary-100 text-primary-700"}`}>
                    <span className="text-sm font-semibold uppercase tracking-[0.18em]">
                      {isVIP ? "VIP" : "TKT"}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-base font-semibold text-slate-900 truncate">{ticketLabel}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                      {t.attendanceType && (
                        <span className="rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-slate-700">
                          {t.attendanceType === "physical" ? "In-Person" : "Virtual"}
                        </span>
                      )}
                      <span className="rounded-full bg-lime/10 px-2.5 py-1 text-lime-800">
                        {t.available} available
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-end justify-between gap-6">
                  <div>
                    <div className="text-sm uppercase tracking-[0.2em] text-slate-500">Price</div>
                    <p className="mt-1 text-3xl font-bold text-slate-900">{formatCurrency(t.price)}</p>
                  </div>
                  <div className="rounded-3xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-900">
                    {qty} selected
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-stretch gap-2">
                <button
                  className="flex h-12 items-center justify-center rounded-2xl border border-slate-200 bg-white text-lg font-semibold text-slate-900 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={() => setQty(ticketKey, qty - 1)}
                  disabled={qty === 0}
                >
                  −
                </button>
                <button
                  className="flex h-12 items-center justify-center rounded-2xl border border-slate-200 bg-white text-lg font-semibold text-slate-900 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={() => setQty(ticketKey, qty + 1)}
                  disabled={qty >= t.available}
                >
                  +
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 rounded-3xl bg-slate-100 p-4 text-sm text-slate-700">
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Remaining</p>
                <p className="font-semibold text-slate-900">{t.available}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Max per order</p>
                <p className="font-semibold text-slate-900">{t.available > 0 ? Math.min(10, t.available) : 0}</p>
              </div>
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

