import React from "react";
import Card from "@/components/ui/Card";
import { getEventById } from "@/lib/events";

const tickets = [
  { type: "General", price: 50, sold: 165, total: 200, color: "bg-primary-50 text-primary-700 border-primary-200" },
  { type: "VIP", price: 120, sold: 38, total: 50, color: "bg-warning-50 text-warning-700 border-warning-200" },
];

export default function TicketsTab({ eventId }: { eventId: string }) {
  getEventById(eventId); // ensure event exists

  return (
    <div className="flex flex-col gap-4">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total Sold", value: "203", icon: "🎟️" },
          { label: "Revenue", value: "$12,810", icon: "💰" },
          { label: "Remaining", value: "47", icon: "📦" },
        ].map((s) => (
          <Card key={s.label} className="flex items-center gap-2 p-3">
            <span className="text-lg">{s.icon}</span>
            <div>
              <p className="text-sm font-bold text-neutral-900 tabular-nums">{s.value}</p>
              <p className="text-xs text-neutral-500">{s.label}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Ticket Types */}
      {tickets.map((t) => {
        const pct = Math.round((t.sold / t.total) * 100);
        return (
          <Card key={t.type}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${t.color}`}>
                  {t.type}
                </span>
                <span className="text-sm font-bold text-neutral-900 tabular-nums">${t.price}</span>
              </div>
              <span className="text-xs text-neutral-500">{t.sold} / {t.total} sold</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-100">
              <div
                className="h-full rounded-full bg-primary-500 transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="mt-1 text-right text-xs text-neutral-500">{pct}% sold</p>
          </Card>
        );
      })}
    </div>
  );
}

