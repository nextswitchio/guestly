"use client";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import CryptoPaymentUI from "@/components/wallet/CryptoPaymentUI";

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

  // Card payment fields
  const [cardNumber, setCardNumber] = React.useState("");
  const [cardExpiry, setCardExpiry] = React.useState("");
  const [cardCvv, setCardCvv] = React.useState("");

  // Mobile money fields
  const [mobileProvider, setMobileProvider] = React.useState<MobileMoneyProvider>("mpesa");
  const [phoneNumber, setPhoneNumber] = React.useState("");

  React.useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => setRole(d?.role || null))
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

    // Validate payment method specific fields
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
      const dest = role === "organiser" ? "/dashboard/wallet" : "/wallet";
      router.replace(dest);
    } catch {
      setError("Failed to add funds");
      setLoading(false);
    }
  }

  const backHref = role === "organiser" ? "/dashboard/wallet" : "/wallet";

  return (
    <div className="container mx-auto py-8">
      <div className="mx-auto max-w-md">
        <Card className="p-6">
          <div className="mb-5">
            <h1 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">Add Funds</h1>
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
              Top up your wallet balance
            </p>
          </div>

          <div className="mb-4 rounded-xl border border-neutral-100 bg-neutral-50 px-4 py-3 dark:border-neutral-700 dark:bg-neutral-800">
            <div className="text-xs text-neutral-500 dark:text-neutral-400">Current Balance</div>
            <div className="mt-1 text-2xl font-bold tabular-nums text-neutral-900 dark:text-neutral-100">
              ${balance === null ? "—" : balance.toFixed(2)}
            </div>
          </div>

          <form onSubmit={submit} className="flex flex-col gap-4">
            {paymentMethod !== "crypto" && (
              <>
                <Input
                  label="Amount"
                  type="number"
                  min={1}
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.currentTarget.value)}
                  placeholder="e.g. 50"
                  error={error || undefined}
                />

                <div className="grid grid-cols-4 gap-2">
                  {[10, 25, 50, 100].map((v) => (
                    <button
                      type="button"
                      key={v}
                      onClick={() => setQuick(v)}
                      className="rounded-lg border border-neutral-200 bg-white py-2 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                    >
                      ${v}
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* Payment Method Selection */}
            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Payment Method
              </label>
              <div className="grid grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("card")}
                  className={`flex flex-col items-center gap-1 rounded-lg border p-3 text-xs font-medium transition ${
                    paymentMethod === "card"
                      ? "border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400"
                      : "border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700"
                  }`}
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                  Card
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("bank_transfer")}
                  className={`flex flex-col items-center gap-1 rounded-lg border p-3 text-xs font-medium transition ${
                    paymentMethod === "bank_transfer"
                      ? "border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400"
                      : "border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700"
                  }`}
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
                    />
                  </svg>
                  Bank
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("mobile_money")}
                  className={`flex flex-col items-center gap-1 rounded-lg border p-3 text-xs font-medium transition ${
                    paymentMethod === "mobile_money"
                      ? "border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400"
                      : "border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700"
                  }`}
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                  Mobile
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("crypto")}
                  className={`flex flex-col items-center gap-1 rounded-lg border p-3 text-xs font-medium transition ${
                    paymentMethod === "crypto"
                      ? "border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400"
                      : "border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700"
                  }`}
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Crypto
                </button>
              </div>
            </div>

            {/* Card Payment Fields */}
            {paymentMethod === "card" && (
              <div className="space-y-3 rounded-lg border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-700 dark:bg-neutral-800/50">
                <Input
                  label="Card Number"
                  type="text"
                  value={cardNumber}
                  onChange={(e) => {
                    const value = e.currentTarget.value.replace(/\D/g, "");
                    const formatted = value.match(/.{1,4}/g)?.join(" ") || value;
                    setCardNumber(formatted);
                  }}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                />
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Expiry Date"
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => {
                      const value = e.currentTarget.value.replace(/\D/g, "");
                      const formatted =
                        value.length >= 2 ? `${value.slice(0, 2)}/${value.slice(2, 4)}` : value;
                      setCardExpiry(formatted);
                    }}
                    placeholder="MM/YY"
                    maxLength={5}
                  />
                  <Input
                    label="CVV"
                    type="text"
                    value={cardCvv}
                    onChange={(e) => {
                      const value = e.currentTarget.value.replace(/\D/g, "");
                      setCardCvv(value);
                    }}
                    placeholder="123"
                    maxLength={4}
                  />
                </div>
              </div>
            )}

            {/* Bank Transfer Instructions */}
            {paymentMethod === "bank_transfer" && (
              <div className="space-y-3 rounded-lg border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-700 dark:bg-neutral-800/50">
                <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  Bank Transfer Details
                </div>
                <div className="space-y-2 text-xs text-neutral-600 dark:text-neutral-400">
                  <div className="flex justify-between">
                    <span>Bank Name:</span>
                    <span className="font-medium text-neutral-900 dark:text-neutral-100">
                      Guestly Bank
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Account Name:</span>
                    <span className="font-medium text-neutral-900 dark:text-neutral-100">
                      Guestly Wallet Services
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Account Number:</span>
                    <span className="font-mono font-medium text-neutral-900 dark:text-neutral-100">
                      1234567890
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Reference:</span>
                    <span className="font-mono font-medium text-neutral-900 dark:text-neutral-100">
                      {role?.toUpperCase()}-USER
                    </span>
                  </div>
                </div>
                <div className="mt-3 rounded-md bg-primary-50 p-3 text-xs text-primary-700 dark:bg-primary-900/20 dark:text-primary-400">
                  <strong>Important:</strong> Use the reference code above when making your
                  transfer. Funds will be credited within 24 hours.
                </div>
              </div>
            )}

            {/* Mobile Money Fields */}
            {paymentMethod === "mobile_money" && (
              <div className="space-y-3 rounded-lg border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-700 dark:bg-neutral-800/50">
                <div>
                  <label className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Provider
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setMobileProvider("mpesa")}
                      className={`rounded-lg border p-2 text-xs font-medium transition ${
                        mobileProvider === "mpesa"
                          ? "border-success-500 bg-success-50 text-success-700 dark:bg-success-900/20 dark:text-success-400"
                          : "border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400"
                      }`}
                    >
                      M-Pesa
                    </button>
                    <button
                      type="button"
                      onClick={() => setMobileProvider("mtn")}
                      className={`rounded-lg border p-2 text-xs font-medium transition ${
                        mobileProvider === "mtn"
                          ? "border-warning-500 bg-warning-50 text-warning-700 dark:bg-warning-900/20 dark:text-warning-400"
                          : "border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400"
                      }`}
                    >
                      MTN
                    </button>
                    <button
                      type="button"
                      onClick={() => setMobileProvider("airtel")}
                      className={`rounded-lg border p-2 text-xs font-medium transition ${
                        mobileProvider === "airtel"
                          ? "border-danger-500 bg-danger-50 text-danger-700 dark:bg-danger-900/20 dark:text-danger-400"
                          : "border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400"
                      }`}
                    >
                      Airtel
                    </button>
                  </div>
                </div>
                <Input
                  label="Phone Number"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.currentTarget.value)}
                  placeholder="+254 712 345 678"
                />
                <div className="rounded-md bg-primary-50 p-3 text-xs text-primary-700 dark:bg-primary-900/20 dark:text-primary-400">
                  You will receive a prompt on your phone to complete the payment.
                </div>
              </div>
            )}

            {/* Cryptocurrency Payment */}
            {paymentMethod === "crypto" && (
              <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-700 dark:bg-neutral-800/50">
                <CryptoPaymentUI />
              </div>
            )}

            {paymentMethod !== "crypto" && (
              <Button type="submit" size="lg" disabled={loading}>
                {loading ? "Processing…" : "Add Funds"}
              </Button>
            )}

            <Link
              href={backHref}
              className="text-center text-xs font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
            >
              Back to Wallet
            </Link>
          </form>
        </Card>
      </div>
    </div>
  );
}
