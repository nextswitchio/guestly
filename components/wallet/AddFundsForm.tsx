"use client";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CryptoPaymentUI from "@/components/wallet/CryptoPaymentUI";
import { formatCurrency } from "@/lib/utils";

type PaymentMethod = "card" | "bank_transfer" | "mobile_money" | "crypto";
type MobileMoneyProvider = "mpesa" | "mtn" | "airtel";

export default function AddFundsForm() {
  const router = useRouter();
  const [role, setRole] = React.useState<"attendee" | "organiser" | "vendor" | null>(null);
  const [balance, setBalance] = React.useState<number | null>(null);
  const [amount, setAmount] = React.useState<string>("");
  const [paymentMethod, setPaymentMethod] = React.useState<PaymentMethod>("card");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const [cardNumber, setCardNumber] = React.useState("");
  const [cardExpiry, setCardExpiry] = React.useState("");
  const [cardCvv, setCardCvv] = React.useState("");

  const [mobileProvider, setMobileProvider] = React.useState<MobileMoneyProvider>("mpesa");
  const [phoneNumber, setPhoneNumber] = React.useState("");

  React.useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => setRole(d?.user?.role || d?.role || null))
      .catch(() => setRole(null));
    fetch("/api/wallet/balance")
      .then((r) => r.json())
      .then((d) => setBalance(typeof d.balance === "number" ? d.balance : 0))
      .catch(() => setBalance(0));
  }, []);

  function setQuick(v: number) {
    setAmount(String(v));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const value = Number(amount);
    if (!Number.isFinite(value) || value <= 0) {
      setError("Enter a valid amount");
      return;
    }

    if (paymentMethod === "card") {
      if (!cardNumber || !cardExpiry || !cardCvv) {
        setError("Please fill in all card details");
        return;
      }
      if (cardNumber.replace(/\s/g, "").length < 13) {
        setError("Invalid card number");
        return;
      }
    } else if (paymentMethod === "mobile_money") {
      if (!phoneNumber) {
        setError("Please enter your phone number");
        return;
      }
      if (phoneNumber.length < 10) {
        setError("Invalid phone number");
        return;
      }
    }

    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/wallet/add-funds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: value,
          paymentMethod,
          cardNumber: paymentMethod === "card" ? cardNumber : undefined,
          cardExpiry: paymentMethod === "card" ? cardExpiry : undefined,
          cardCvv: paymentMethod === "card" ? cardCvv : undefined,
          mobileProvider: paymentMethod === "mobile_money" ? mobileProvider : undefined,
          phoneNumber: paymentMethod === "mobile_money" ? phoneNumber : undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.success) {
        setError(data?.error || "Failed to add funds");
        setLoading(false);
        return;
      }
      const txnId = data.transaction?.id;
      router.replace(txnId ? `${backHref}/success?txn=${txnId}` : backHref);
    } catch {
      setError("Failed to add funds");
      setLoading(false);
    }
  }

  const backHref = role === "organiser" ? "/dashboard/wallet" : "/wallet";

  const methods: { value: PaymentMethod; label: string; icon: React.ReactNode }[] = [
    {
      value: "card",
      label: "Card",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
    },
    {
      value: "bank_transfer",
      label: "Bank",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
        </svg>
      ),
    },
    {
      value: "mobile_money",
      label: "Mobile",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      value: "crypto",
      label: "Crypto",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">Add Funds</h1>
          <p className="mt-2 text-neutral-500">Top up your wallet balance securely</p>
        </div>
        <Link
          href={backHref}
          className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path d="M15 19l-7-7 7-7" />
          </svg>
          Back to Wallet
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Payment Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Balance Card */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6">
            <p className="text-sm text-neutral-500">Current Balance</p>
            <p className="mt-1 text-3xl font-bold tabular-nums text-neutral-900">
              {balance === null ? "—" : formatCurrency(balance)}
            </p>
          </div>

          {/* Payment Method Selection */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Payment Method</h3>
            <div className="grid grid-cols-4 gap-3">
              {methods.map((m) => (
                <button
                  key={m.value}
                  type="button"
                  onClick={() => setPaymentMethod(m.value)}
                  className={`flex flex-col items-center gap-2 rounded-xl border p-4 text-sm font-medium transition-all ${
                    paymentMethod === m.value
                      ? "border-lime bg-lime/10 text-dark"
                      : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50"
                  }`}
                >
                  <span className={paymentMethod === m.value ? "text-dark" : "text-neutral-500"}>
                    {m.icon}
                  </span>
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Amount Selection (non-crypto) */}
          {paymentMethod !== "crypto" && (
            <div className="rounded-2xl border border-neutral-200 bg-white p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Amount</h3>
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-semibold text-neutral-600">$</span>
                  <input
                    type="number"
                    min={1}
                    step="0.01"
                    value={amount}
                    onChange={(e) => { setAmount(e.currentTarget.value); setError(""); }}
                    placeholder="0.00"
                    className="w-full h-14 rounded-xl border border-neutral-200 bg-neutral-50 pl-10 pr-4 text-2xl font-bold tabular-nums text-neutral-900 placeholder:text-neutral-500 focus:border-lime focus:bg-white focus:outline-none focus:ring-2 focus:ring-lime/20 transition-all"
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2 mt-4">
                {[10, 25, 50, 100].map((v) => (
                  <button
                    type="button"
                    key={v}
                    onClick={() => setQuick(v)}
                    className={`rounded-xl py-3 text-sm font-semibold transition-all ${
                      amount === String(v)
                        ? "bg-lime text-dark"
                        : "border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50"
                    }`}
                  >
                    {formatCurrency(v)}
                  </button>
                ))}
              </div>
              {error && (
                <p className="mt-3 text-sm text-red-500">{error}</p>
              )}
            </div>
          )}

          {/* Card Payment Fields */}
          {paymentMethod === "card" && (
            <div className="rounded-2xl border border-neutral-200 bg-white p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Card Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => {
                      const value = e.currentTarget.value.replace(/\D/g, "");
                      setCardNumber(value.match(/.{1,4}/g)?.join(" ") || value);
                    }}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    className="w-full h-12 rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus:border-lime focus:bg-white focus:outline-none focus:ring-2 focus:ring-lime/20 transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">Expiry Date</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => {
                        const value = e.currentTarget.value.replace(/\D/g, "");
                        setCardExpiry(value.length >= 2 ? `${value.slice(0, 2)}/${value.slice(2, 4)}` : value);
                      }}
                      placeholder="MM/YY"
                      maxLength={5}
                      className="w-full h-12 rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus:border-lime focus:bg-white focus:outline-none focus:ring-2 focus:ring-lime/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">CVV</label>
                    <input
                      type="text"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.currentTarget.value.replace(/\D/g, ""))}
                      placeholder="123"
                      maxLength={4}
                      className="w-full h-12 rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus:border-lime focus:bg-white focus:outline-none focus:ring-2 focus:ring-lime/20 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bank Transfer */}
          {paymentMethod === "bank_transfer" && (
            <div className="rounded-2xl border border-neutral-200 bg-white p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Bank Transfer Details</h3>
              <div className="space-y-3">
                {[
                  { label: "Bank Name", value: "Guestly Bank" },
                  { label: "Account Name", value: "Guestly Wallet Services" },
                  { label: "Account Number", value: "1234567890" },
                  { label: "Reference", value: `${role?.toUpperCase()}-USER` },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between rounded-xl bg-neutral-50 px-4 py-3">
                    <span className="text-sm text-neutral-500">{item.label}</span>
                    <span className="text-sm font-semibold text-neutral-900 font-mono">{item.value}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-xl bg-lime/10 border border-lime/20 p-4 text-sm text-dark">
                <strong>Important:</strong> Use the reference code above when making your transfer. Funds will be credited within 24 hours.
              </div>
            </div>
          )}

          {/* Mobile Money */}
          {paymentMethod === "mobile_money" && (
            <div className="rounded-2xl border border-neutral-200 bg-white p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Mobile Money</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-neutral-700 mb-2">Provider</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: "mpesa" as const, label: "M-Pesa" },
                    { value: "mtn" as const, label: "MTN" },
                    { value: "airtel" as const, label: "Airtel" },
                  ].map((p) => (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => setMobileProvider(p.value)}
                      className={`rounded-xl border py-3 text-sm font-semibold transition-all ${
                        mobileProvider === p.value
                          ? "border-lime bg-lime/10 text-dark"
                          : "border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Phone Number</label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.currentTarget.value)}
                  placeholder="+254 712 345 678"
                  className="w-full h-12 rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus:border-lime focus:bg-white focus:outline-none focus:ring-2 focus:ring-lime/20 transition-all"
                />
              </div>
              <div className="mt-4 rounded-xl bg-lime/10 border border-lime/20 p-4 text-sm text-dark">
                You will receive a prompt on your phone to complete the payment.
              </div>
            </div>
          )}

          {/* Crypto */}
          {paymentMethod === "crypto" && (
            <div className="rounded-2xl border border-neutral-200 bg-white p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Cryptocurrency Deposit</h3>
              <CryptoPaymentUI />
            </div>
          )}

          {/* Submit */}
          {paymentMethod !== "crypto" && (
            <button
              type="button"
              onClick={submit}
              disabled={loading || (!amount && paymentMethod !== "bank_transfer")}
              className="w-full h-14 rounded-xl bg-lime text-dark text-lg font-bold hover:bg-lime-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Processing…" : paymentMethod === "bank_transfer" ? "I've Sent the Funds" : `Add ${formatCurrency(Number(amount) || 0)} to Wallet`}
            </button>
          )}
        </div>

        {/* Right: Info Panel */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-lime/30 bg-lime/5 p-6">
            <h3 className="text-sm font-semibold text-dark mb-2">Secure Payments</h3>
            <p className="text-sm text-neutral-600 leading-relaxed">
              All transactions are encrypted and secured. Your payment information is never stored on our servers.
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-6">
            <h3 className="text-sm font-semibold text-neutral-900 mb-3">Supported Methods</h3>
            <ul className="space-y-2 text-sm text-neutral-600">
              <li className="flex items-center gap-2">
                <svg className="h-4 w-4 text-lime" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M5 13l4 4L19 7" />
                </svg>
                Visa & Mastercard
              </li>
              <li className="flex items-center gap-2">
                <svg className="h-4 w-4 text-lime" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M5 13l4 4L19 7" />
                </svg>
                Bank transfers
              </li>
              <li className="flex items-center gap-2">
                <svg className="h-4 w-4 text-lime" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M5 13l4 4L19 7" />
                </svg>
                M-Pesa, MTN, Airtel
              </li>
              <li className="flex items-center gap-2">
                <svg className="h-4 w-4 text-lime" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M5 13l4 4L19 7" />
                </svg>
                Bitcoin, Ethereum, USDT
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-6">
            <h3 className="text-sm font-semibold text-neutral-900 mb-3">Need Help?</h3>
            <p className="text-sm text-neutral-600 leading-relaxed">
              If your payment doesn't go through, contact our support team for assistance.
            </p>
            <Link
              href="/support"
              className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-lime hover:text-lime-hover transition-colors"
            >
              Contact Support
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
