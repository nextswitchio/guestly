"use client";
import React from "react";
import { X, Wallet, CreditCard, Landmark, Smartphone, Bitcoin } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

type PaymentMethod = "wallet" | "card" | "bank" | "mobile_money" | "crypto";

const methods: { value: PaymentMethod; label: string; icon: React.ReactNode; desc: string }[] = [
  { value: "wallet", label: "Guestly Wallet", icon: <Wallet className="h-5 w-5" />, desc: "Instant deduction from wallet balance" },
  { value: "card", label: "Card Payment", icon: <CreditCard className="h-5 w-5" />, desc: "Visa, Mastercard, Verve" },
  { value: "bank", label: "Bank Transfer", icon: <Landmark className="h-5 w-5" />, desc: "Paystack, Stripe, or direct bank" },
  { value: "mobile_money", label: "Mobile Money", icon: <Smartphone className="h-5 w-5" />, desc: "M-Pesa, MTN, Airtel Money" },
  { value: "crypto", label: "Cryptocurrency", icon: <Bitcoin className="h-5 w-5" />, desc: "USDT, BTC, and more" },
];

type MobileMoneyProvider = "mpesa" | "mtn" | "airtel";

export default function CheckoutModal({
  open,
  onClose,
  fee,
  hours,
  currency,
  rate,
  onSubmit,
  submitting,
}: {
  open: boolean;
  onClose: () => void;
  fee: number;
  hours: number;
  currency: string;
  rate: number;
  onSubmit: (method: PaymentMethod, mobileProvider?: MobileMoneyProvider, phoneNumber?: string) => Promise<void>;
  submitting: boolean;
}) {
  const [method, setMethod] = React.useState<PaymentMethod>("wallet");
  const [balance, setBalance] = React.useState<number | null>(null);
  const [loadingBalance, setLoadingBalance] = React.useState(false);
  const [mobileProvider, setMobileProvider] = React.useState<MobileMoneyProvider>("mpesa");
  const [phoneNumber, setPhoneNumber] = React.useState("");

  React.useEffect(() => {
    if (!open) return;
    if (method !== "wallet") return;
    setLoadingBalance(true);
    fetch("/api/wallet/balance")
      .then(r => r.json())
      .then(d => setBalance(d.balance ?? null))
      .catch(() => setBalance(null))
      .finally(() => setLoadingBalance(false));
  }, [open, method]);

  if (!open) return null;

  const sufficient = balance !== null && balance >= fee;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
          <h2 className="text-lg font-bold text-neutral-900">Checkout</h2>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600"><X className="h-5 w-5" /></button>
        </div>

        <div className="space-y-5 px-6 py-5">
          {/* Fee summary */}
          <div className="rounded-xl bg-neutral-50 p-4 text-sm space-y-2">
            <div className="flex justify-between text-neutral-600">
              <span>Rate</span><span className="font-semibold text-neutral-900">{formatCurrency(rate, currency)} / hour</span>
            </div>
            <div className="flex justify-between text-neutral-600">
              <span>Duration</span><span className="font-semibold text-neutral-900">{hours} hour{hours === 1 ? "" : "s"}</span>
            </div>
            <div className="border-t border-neutral-200 pt-2 flex justify-between text-base">
              <span className="font-bold text-neutral-900">Total</span>
              <span className="font-bold text-neutral-900">{formatCurrency(fee, currency)}</span>
            </div>
          </div>

          {/* Wallet balance */}
          {method === "wallet" && (
            <div className={`rounded-xl border p-3 text-sm ${sufficient ? "border-green-200 bg-green-50" : balance !== null ? "border-red-200 bg-red-50" : "border-neutral-200 bg-neutral-50"}`}>
              {loadingBalance ? (
                <span className="text-neutral-500">Checking wallet balance...</span>
              ) : balance !== null ? (
                sufficient
                  ? <span className="text-green-700 font-medium">Wallet balance: {formatCurrency(balance, currency)} — sufficient</span>
                  : <span className="text-red-700 font-medium">Insufficient balance: {formatCurrency(balance, currency)} (need {formatCurrency(fee, currency)})</span>
              ) : (
                <span className="text-neutral-500">Unable to check balance</span>
              )}
            </div>
          )}

          {/* Payment methods */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-neutral-700">Payment method</p>
            {methods.map(m => {
              const active = method === m.value;
              const isWallet = m.value === "wallet";
              const disabled = isWallet && balance !== null && !sufficient;
              return (
                <button key={m.value} type="button" disabled={disabled}
                  onClick={() => setMethod(m.value)}
                  className={`flex w-full items-center gap-3 rounded-xl border-2 p-3 text-left transition-all ${disabled ? "opacity-50 cursor-not-allowed border-neutral-200" : active ? "border-lime bg-lime/5" : "border-neutral-200 hover:border-lime/50"}`}>
                  <span className={`flex h-10 w-10 items-center justify-center rounded-lg ${active ? "bg-lime text-dark" : "bg-neutral-100 text-neutral-500"}`}>{m.icon}</span>
                  <div className="flex-1">
                    <p className={`text-sm font-semibold ${active ? "text-neutral-900" : "text-neutral-700"}`}>{m.label}</p>
                    <p className="text-xs text-neutral-500">{m.desc}</p>
                  </div>
                  {active && <span className="flex h-5 w-5 items-center justify-center rounded-full bg-lime"><span className="h-2 w-2 rounded-full bg-dark" /></span>}
                </button>
              );
            })}
          {/* Mobile Money Fields */}
          {method === "mobile_money" && (
            <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 space-y-3">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Provider</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["mpesa", "mtn", "airtel"] as const).map((p) => (
                    <button key={p} type="button" onClick={() => setMobileProvider(p)}
                      className={`rounded-lg border py-2 text-xs font-semibold transition-all ${
                        mobileProvider === p
                          ? "border-lime bg-lime/10 text-dark"
                          : "border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50"
                      }`}>
                      {p === "mpesa" ? "M-Pesa" : p === "mtn" ? "MTN" : "Airtel"}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Phone Number</label>
                <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.currentTarget.value)}
                  placeholder="+254 712 345 678"
                  className="w-full h-11 rounded-xl border border-neutral-200 bg-white px-3 text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus:border-lime focus:outline-none focus:ring-2 focus:ring-lime/20 transition-all" />
              </div>
              <div className="rounded-lg bg-lime/10 border border-lime/20 p-3 text-xs text-dark">
                You'll receive a prompt on your phone to complete the payment.
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-neutral-200 px-6 py-4 flex gap-3">
          <button onClick={onClose} className="flex-1 rounded-xl border border-neutral-200 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50">
            Cancel
          </button>
          <button onClick={() => {
            if (method === "mobile_money" && (!phoneNumber || phoneNumber.length < 10)) return;
            onSubmit(method, mobileProvider, phoneNumber);
          }} disabled={submitting || (method === "wallet" && balance !== null && !sufficient) || (method === "mobile_money" && (!phoneNumber || phoneNumber.length < 10))}
            className="flex-1 rounded-xl bg-lime py-2.5 text-sm font-bold text-dark hover:bg-lime-hover transition-colors disabled:opacity-50">
            {submitting ? "Processing..." : method === "wallet" ? `Pay ${formatCurrency(fee, currency)}` : "Proceed"}
          </button>
        </div>
      </div>
    </div>
  );
}
