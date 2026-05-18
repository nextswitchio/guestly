import React from "react";

type Item = { type: "General" | "VIP"; quantity: number; price: number; attendanceType?: "physical" | "virtual" };

interface OrderSummaryProps {
  items: Item[];
  total: number;
  showBreakdown?: boolean;
  savingsApplied?: number;
  remainingSavings?: number;
}

export default function OrderSummary({ items, total, showBreakdown = true, savingsApplied = 0, remainingSavings = 0 }: OrderSummaryProps) {
  // Calculate subtotal, fees, and taxes
  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  const serviceFee = subtotal * 0.05; // 5% service fee
  const processingFee = 2.50; // Flat processing fee
  const tax = subtotal * 0.075; // 7.5% tax
  const calculatedTotal = subtotal + serviceFee + processingFee + tax;

  return (
    <div className="rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-card)] shadow-sm overflow-hidden">
      <div className="border-b border-[var(--surface-border)] px-6 py-4 bg-[var(--surface-bg)]">
        <h3 className="text-sm font-semibold text-[var(--foreground)]">Order Summary</h3>
        <p className="text-xs text-[var(--foreground-subtle)] mt-0.5">Review your purchase details</p>
      </div>

      <div className="px-6 py-4 space-y-3">
        {/* Ticket Items */}
        {items.map((it, i) => (
          <div key={i} className="flex items-start justify-between py-2 group">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-[var(--foreground)] text-sm">{it.type} Ticket</span>
                {it.attendanceType === "physical" && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-primary-100 text-primary-700 font-medium">
                    In-Person
                  </span>
                )}
                {it.attendanceType === "virtual" && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-success-100 text-success-700 font-medium">
                    Virtual
                  </span>
                )}
              </div>
              <span className="text-xs text-[var(--foreground-subtle)]">
                {it.quantity} {it.quantity === 1 ? 'ticket' : 'tickets'} × ${it.price.toFixed(2)}
              </span>
            </div>
            <span className="font-semibold tabular-nums text-[var(--foreground)] text-sm">
              ${(it.quantity * it.price).toFixed(2)}
            </span>
          </div>
        ))}

        {showBreakdown && (
          <>
            {/* Subtotal */}
            <div className="flex items-center justify-between py-2 border-t border-[var(--surface-border)] pt-3">
              <span className="text-sm text-[var(--foreground-muted)]">Subtotal</span>
              <span className="text-sm font-medium tabular-nums text-[var(--foreground)]">
                ${subtotal.toFixed(2)}
              </span>
            </div>

            {/* Service Fee */}
            <div className="flex items-center justify-between py-1">
              <div className="flex items-center gap-1.5">
                <span className="text-sm text-[var(--foreground-muted)]">Service Fee</span>
                <div className="group/tooltip relative">
                  <svg className="h-3.5 w-3.5 text-[var(--foreground-subtle)] cursor-help" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <circle cx="12" cy="12" r="10" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16v-4m0-4h.01" />
                  </svg>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/tooltip:block w-48 p-2 bg-[var(--surface-elevated)] border border-[var(--surface-border)] rounded-lg shadow-lg text-xs text-[var(--foreground-muted)] z-10">
                    Platform service fee (5% of subtotal)
                  </div>
                </div>
              </div>
              <span className="text-sm font-medium tabular-nums text-[var(--foreground)]">
                ${serviceFee.toFixed(2)}
              </span>
            </div>

            {/* Processing Fee */}
            <div className="flex items-center justify-between py-1">
              <div className="flex items-center gap-1.5">
                <span className="text-sm text-[var(--foreground-muted)]">Processing Fee</span>
                <div className="group/tooltip relative">
                  <svg className="h-3.5 w-3.5 text-[var(--foreground-subtle)] cursor-help" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <circle cx="12" cy="12" r="10" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16v-4m0-4h.01" />
                  </svg>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/tooltip:block w-48 p-2 bg-[var(--surface-elevated)] border border-[var(--surface-border)] rounded-lg shadow-lg text-xs text-[var(--foreground-muted)] z-10">
                    Payment processing fee
                  </div>
                </div>
              </div>
              <span className="text-sm font-medium tabular-nums text-[var(--foreground)]">
                ${processingFee.toFixed(2)}
              </span>
            </div>

            {/* Tax */}
            <div className="flex items-center justify-between py-1">
              <span className="text-sm text-[var(--foreground-muted)]">Tax (7.5%)</span>
              <span className="text-sm font-medium tabular-nums text-[var(--foreground)]">
                ${tax.toFixed(2)}
              </span>
            </div>
            
            {/* Savings Applied */}
            {savingsApplied > 0 && (
              <div className="flex items-center justify-between py-2 border-t border-success-200 bg-success-50 -mx-6 px-6 mt-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-success-500 text-white">
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-success-900">Savings Applied</span>
                    {remainingSavings > 0 && (
                      <span className="text-xs text-success-700">
                        ${remainingSavings.toFixed(2)} remaining after purchase
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-sm font-bold tabular-nums text-success-700">
                  -${savingsApplied.toFixed(2)}
                </span>
              </div>
            )}
          </>
        )}
      </div>

      {/* Total */}
      <div className="flex items-center justify-between border-t-2 border-[var(--surface-border)] px-6 py-4 bg-[var(--surface-bg)]">
        <div className="flex flex-col gap-0.5">
          <span className="text-base font-bold text-[var(--foreground)]">Total</span>
          {savingsApplied > 0 && (
            <span className="text-xs text-[var(--foreground-subtle)]">
              After savings discount
            </span>
          )}
        </div>
        <span className="text-xl font-extrabold tabular-nums text-primary-600">
          ${(showBreakdown ? Math.max(0, calculatedTotal - savingsApplied) : total).toFixed(2)}
        </span>
      </div>

      {/* Real-time update indicator */}
      {showBreakdown && (
        <div className="px-6 py-3 bg-primary-50 border-t border-primary-100">
          <div className="flex items-center gap-2 text-xs text-primary-700">
            <svg className="h-3.5 w-3.5 animate-pulse-dot" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" />
            </svg>
            <span>Price updates in real-time</span>
          </div>
        </div>
      )}
    </div>
  );
}

