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
          <div key={i} className="rounded-2xl border border-neutral-200 bg-white p-5 shimmer">
            <div className="flex items-center justify-between">
              <div className="space-y-2 flex-1">
                <div className="h-5 w-24 bg-neutral-200 rounded" />
                <div className="h-6 w-32 bg-neutral-200 rounded" />
              </div>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 bg-neutral-200 rounded-lg" />
                <div className="h-5 w-8 bg-neutral-200 rounded" />
                <div className="h-8 w-8 bg-neutral-200 rounded-lg" />
              </div>
            </div>
          </div>
        ))}
        <div className="h-20 rounded-2xl bg-neutral-100 shimmer" />
      </div>
    );
  }

  if (!ticketItems.length) {
    return (
      <div className="rounded-2xl border border-neutral-200 bg-white p-5">
        <p className="text-sm text-neutral-500">No tickets are available for this event.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {ticketItems.map((t) => {
        const ticketKey = getTicketKey(t);
        const qty = quantities[ticketKey] || 0;
        const ticketLabel = t.type ?? t.name ?? "Ticket";
        const isVIP = t.type === "VIP" || t.name?.toLowerCase().includes("vip");
        const soldOut = t.available === 0;
        return (
          <div
            key={ticketKey}
            className={`group relative overflow-hidden rounded-2xl bg-white shadow-sm border border-neutral-200 transition-all duration-300 hover:shadow-lg hover:border-lime/30 ${soldOut ? "opacity-80" : ""}`}
          >
            {/* Lime accent bar on top */}
            <div className={`h-1.5 w-full ${isVIP ? "bg-warning-400" : "bg-lime"}`} />

            <div className="p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {/* Ticket type header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                      isVIP
                        ? "bg-warning-100 text-warning-700"
                        : "bg-lime/10 text-dark"
                    }`}>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-base font-bold text-neutral-900 truncate">{ticketLabel}</p>
                        {isVIP && (
                          <span className="shrink-0 rounded-full bg-warning-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-warning-700">
                            Premium
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-2 mt-1.5">
                        {t.attendanceType && (
                          <span className="inline-flex items-center gap-1 rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-0.5 text-[11px] font-medium text-neutral-600">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              {t.attendanceType === "virtual" ? (
                                <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              ) : (
                                <><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></>
                              )}
                            </svg>
                            {t.attendanceType === "physical" ? "In-Person" : "Virtual"}
                          </span>
                        )}
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                          soldOut
                            ? "bg-danger-50 text-danger-600"
                            : "bg-lime/10 text-dark"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${soldOut ? "bg-danger-500" : "bg-lime"}`} />
                          {soldOut ? "Sold out" : `${t.available} available`}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm uppercase tracking-[0.2em] text-neutral-400 font-medium">Price</span>
                    <p className="text-3xl sm:text-4xl font-bold text-dark">{formatCurrency(t.price)}</p>
                  </div>
                </div>

                {/* Quantity controls */}
                <div className="flex flex-col items-center gap-2 shrink-0">
                  <button
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime/10 text-dark font-bold text-lg transition-all hover:bg-lime hover:text-dark hover:shadow-md active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-lime/10 disabled:hover:shadow-none"
                    onClick={() => setQty(ticketKey, qty + 1)}
                    disabled={qty >= t.available || soldOut}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path d="M12 4v16M4 12h16" />
                    </svg>
                  </button>
                  <span className="text-sm font-bold text-neutral-900 tabular-nums min-w-[1.5rem] text-center">{qty}</span>
                  <button
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600 font-bold text-lg transition-all hover:bg-neutral-200 hover:text-neutral-800 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
                    onClick={() => setQty(ticketKey, qty - 1)}
                    disabled={qty === 0}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path d="M4 12h16" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Stats footer */}
              <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-neutral-50 p-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-sm">
                    <svg className="w-4 h-4 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-neutral-400 font-medium">Remaining</p>
                    <p className="text-sm font-bold text-neutral-900">{t.available}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-sm">
                    <svg className="w-4 h-4 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-neutral-400 font-medium">Max per order</p>
                    <p className="text-sm font-bold text-neutral-900">{t.available > 0 ? Math.min(10, t.available) : 0}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Total + CTA */}
      <div className="rounded-2xl bg-dark p-5 shadow-lg">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-white/50 font-medium">Total</p>
            <p className="text-2xl font-bold text-white">{formatCurrency(total)}</p>
          </div>
          <Button
            onClick={continueFlow}
            disabled={loading || !hasItems}
            size="lg"
            className="bg-lime hover:bg-lime-hover text-dark font-bold rounded-xl shadow-lg hover:shadow-xl transition-all min-w-[140px]"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing…
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Continue
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

