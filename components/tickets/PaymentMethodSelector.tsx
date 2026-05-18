"use client";
import React from "react";

type Method = "wallet" | "card";

export default function PaymentMethodSelector({
  value,
  onChange,
  orderTotal,
  savingsApplied = 0,
}: {
  value: Method;
  onChange: (m: Method) => void;
  orderTotal?: number;
  savingsApplied?: number;
}) {
  const [walletBalance, setWalletBalance] = React.useState<number | null>(null);
  const [promoBalance, setPromoBalance] = React.useState<number>(0);
  const [loadingBalance, setLoadingBalance] = React.useState(true);

  React.useEffect(() => {
    async function fetchBalance() {
      try {
        const res = await fetch("/api/wallet/balance");
        const data = await res.json();
        if (data.ok) {
          setWalletBalance(data.balance);
          setPromoBalance(data.promoBalance || 0);
        }
      } catch (error) {
        console.error("Failed to fetch wallet balance:", error);
      } finally {
        setLoadingBalance(false);
      }
    }
    fetchBalance();
  }, []);

  const totalAvailable = (walletBalance || 0) + promoBalance;
  const finalOrderTotal = orderTotal !== undefined ? Math.max(0, orderTotal - savingsApplied) : undefined;
  const hasSufficientBalance = walletBalance !== null && finalOrderTotal !== undefined && totalAvailable >= finalOrderTotal;
  const balanceShortfall = walletBalance !== null && finalOrderTotal !== undefined && totalAvailable < finalOrderTotal 
    ? finalOrderTotal - totalAvailable 
    : 0;

  const methods: { 
    value: Method; 
    label: string; 
    icon: React.ReactNode; 
    description: string;
    badge?: string;
    recommended?: boolean;
    timeSaved?: string;
  }[] = [
    {
      value: "wallet",
      label: "Guestly Wallet",
      description: loadingBalance 
        ? "Loading balance..." 
        : walletBalance !== null 
          ? `Available: $${walletBalance.toFixed(2)}${promoBalance > 0 ? ` + $${promoBalance.toFixed(2)} promo` : ''}${!hasSufficientBalance && orderTotal ? ` • Need $${balanceShortfall.toFixed(2)} more` : ""}`
          : "Pay from your wallet balance",
      badge: "Fastest",
      recommended: true,
      timeSaved: "~3 sec faster",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1 0-6h.75A2.25 2.25 0 0 1 18 6v0a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 6v0a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 6v12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18V6" />
        </svg>
      ),
    },
    {
      value: "card",
      label: "Debit / Credit Card",
      description: "Visa, Mastercard, Verve",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <path d="M2 10h20" />
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Promo credit info banner */}
      {!loadingBalance && promoBalance > 0 && (
        <div className="rounded-xl bg-success-50 border border-success-200 p-4 flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-success-500 text-white">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-success-900">Promo credits available!</p>
            <p className="text-xs text-success-700 mt-0.5">
              ${promoBalance.toFixed(2)} in promo credits will be automatically applied at checkout
            </p>
          </div>
        </div>
      )}

      {/* Quick action for wallet payment */}
      {!loadingBalance && hasSufficientBalance && value !== "wallet" && (
        <div className="rounded-xl bg-primary-50 border border-primary-200 p-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-500 text-white">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-primary-900">Pay faster with your wallet</p>
              <p className="text-xs text-primary-700">Save ~3 seconds • No card details needed</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onChange("wallet")}
            className="shrink-0 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            Use Wallet
          </button>
        </div>
      )}

      {/* Payment method options */}
      <div className="flex flex-col gap-3">
        {methods.map((m) => {
          const active = value === m.value;
          const isWalletWithInsufficientBalance = m.value === "wallet" && !loadingBalance && !hasSufficientBalance && orderTotal !== undefined;
          
          return (
            <button
              key={m.value}
              type="button"
              onClick={() => onChange(m.value)}
              disabled={isWalletWithInsufficientBalance}
              className={`flex items-center gap-4 rounded-2xl border-2 p-5 text-left transition-all duration-200 min-h-[72px] touch-manipulation relative ${
                isWalletWithInsufficientBalance
                  ? "border-[var(--surface-border)] bg-neutral-50 opacity-60 cursor-not-allowed"
                  : active
                    ? "border-primary-600 bg-primary-50 shadow-sm"
                    : "border-[var(--surface-border)] bg-[var(--surface-card)] hover:border-primary-300 hover:bg-primary-50/30 active:scale-[0.98]"
              }`}
              aria-pressed={active}
              aria-label={`Pay with ${m.label}`}
            >
              {/* Badge */}
              {m.recommended && !isWalletWithInsufficientBalance && (
                <div className="absolute -top-2 left-4 px-2 py-0.5 bg-success-500 text-white text-[10px] font-bold uppercase tracking-wide rounded-full shadow-sm">
                  {m.badge}
                </div>
              )}
              
              {/* Insufficient balance badge */}
              {isWalletWithInsufficientBalance && (
                <div className="absolute -top-2 left-4 px-2 py-0.5 bg-warning-500 text-white text-[10px] font-bold uppercase tracking-wide rounded-full shadow-sm">
                  Insufficient Balance
                </div>
              )}
              
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors ${
                  isWalletWithInsufficientBalance
                    ? "bg-neutral-200 text-neutral-400"
                    : active
                      ? "bg-primary-500 text-white"
                      : "bg-[var(--surface-bg)] text-[var(--foreground-muted)]"
                }`}
              >
                {m.icon}
              </div>
              <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-semibold ${
                    isWalletWithInsufficientBalance 
                      ? 'text-neutral-500' 
                      : active 
                        ? 'text-primary-700' 
                        : 'text-[var(--foreground)]'
                  }`}>
                    {m.label}
                  </span>
                  {/* Time saved indicator */}
                  {m.timeSaved && !isWalletWithInsufficientBalance && (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-success-100 text-success-700 text-[10px] font-semibold rounded">
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {m.timeSaved}
                    </span>
                  )}
                </div>
                <span className={`text-xs ${
                  isWalletWithInsufficientBalance 
                    ? 'text-neutral-400' 
                    : 'text-[var(--foreground-subtle)]'
                }`}>
                  {m.description}
                </span>
              </div>
              {/* Radio indicator with larger touch target */}
              <div className="ml-auto pl-2">
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all ${
                    isWalletWithInsufficientBalance
                      ? "border-neutral-300"
                      : active 
                        ? "border-primary-600 bg-primary-600" 
                        : "border-[var(--surface-border)]"
                  }`}
                >
                  {active && !isWalletWithInsufficientBalance && (
                    <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
