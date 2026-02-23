"use client";
import React from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

const presets = [10, 20, 50, 100, 200, 500];

export default function WalletAddMoney() {
  const [amount, setAmount] = React.useState(20);
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<{ ok: boolean; message: string } | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (amount <= 0 || loading) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/wallet/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      const data = await res.json();
      if (res.ok) {
        setResult({ ok: true, message: `$${amount.toFixed(2)} added! New balance: $${(data.balance || 0).toFixed(2)}` });
      } else {
        setResult({ ok: false, message: data.error || "Something went wrong." });
      }
    } catch {
      setResult({ ok: false, message: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <ProtectedRoute allowRoles={["attendee"]}>
      <div className="container py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-1.5 text-xs text-neutral-400">
          <Link href="/wallet" className="hover:text-neutral-600">Wallet</Link>
          <span>/</span>
          <span className="text-neutral-600">Add Money</span>
        </nav>

        <div className="mx-auto max-w-md">
          {/* Card */}
          <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm sm:p-8">
            {/* Icon */}
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-primary-50">
              <svg className="h-7 w-7 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <rect x="2" y="4" width="20" height="16" rx="2" /><path d="M2 10h20" />
              </svg>
            </div>

            <h1 className="mb-1 text-center text-lg font-bold text-neutral-900">Add Money</h1>
            <p className="mb-6 text-center text-xs text-neutral-500">
              Top up your Guestly Wallet instantly
            </p>

            {/* Preset amounts */}
            <div className="mb-5 grid grid-cols-3 gap-2">
              {presets.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setAmount(p)}
                  className={`rounded-xl border-2 px-3 py-2.5 text-sm font-semibold tabular-nums transition ${amount === p
                      ? "border-primary-600 bg-primary-50 text-primary-700"
                      : "border-neutral-100 bg-white text-neutral-700 hover:border-neutral-200"
                    }`}
                >
                  ${p}
                </button>
              ))}
            </div>

            <form onSubmit={submit} className="flex flex-col gap-4">
              <Input
                label="Custom Amount ($)"
                type="number"
                min={1}
                value={amount}
                onChange={(e) => setAmount(Number(e.currentTarget.value))}
              />

              {result && (
                <div
                  className={`rounded-xl px-4 py-3 text-xs font-medium ${result.ok
                      ? "bg-success-50 text-success-700"
                      : "bg-red-50 text-red-600"
                    }`}
                >
                  {result.message}
                </div>
              )}

              <Button type="submit" disabled={loading || amount <= 0} className="w-full" size="lg">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Adding…
                  </span>
                ) : (
                  `Add $${amount > 0 ? amount.toFixed(2) : "0.00"}`
                )}
              </Button>
            </form>

            {/* Security badge */}
            <div className="mt-5 flex items-center justify-center gap-1.5 text-xs text-neutral-400">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              Secure &amp; encrypted
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

