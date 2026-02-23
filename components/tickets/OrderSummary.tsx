import React from "react";

type Item = { type: "General" | "VIP"; quantity: number; price: number };

export default function OrderSummary({ items, total }: { items: Item[]; total: number }) {
  return (
    <div className="rounded-xl border border-neutral-100 bg-white shadow-sm">
      <div className="border-b border-neutral-100 px-5 py-4">
        <h3 className="text-sm font-semibold text-neutral-900">Order Summary</h3>
      </div>

      <div className="flex flex-col divide-y divide-neutral-50 px-5">
        {items.map((it, i) => (
          <div key={i} className="flex items-center justify-between py-3 text-sm">
            <div className="flex flex-col gap-0.5">
              <span className="font-medium text-neutral-900">{it.type}</span>
              <span className="text-xs text-neutral-400">
                {it.quantity} × ${it.price.toFixed(2)}
              </span>
            </div>
            <span className="font-medium tabular-nums text-neutral-900">
              ${(it.quantity * it.price).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-neutral-100 px-5 py-4">
        <span className="text-sm font-semibold text-neutral-900">Total</span>
        <span className="text-lg font-bold tabular-nums text-neutral-900">
          ${total.toFixed(2)}
        </span>
      </div>
    </div>
  );
}

