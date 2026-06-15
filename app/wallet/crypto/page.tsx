"use client";
import React from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import Card from "@/components/ui/Card";
import CryptoPaymentUI from "@/components/wallet/CryptoPaymentUI";

export default function CryptoDepositPage() {
  const [role, setRole] = React.useState<"attendee" | "organiser" | "vendor" | null>(null);

  React.useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => setRole(d?.role || null))
      .catch(() => setRole(null));
  }, []);

  const backHref = role === "organiser" ? "/organizer/dashboard/wallet" : "/wallet";

  return (
    <ProtectedRoute allowRoles={["attendee", "organiser"]}>
      <div>
        {/* Header */}
        <div className="mb-6">
          <Link
            href={backHref}
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-neutral-900"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Wallet
          </Link>
          <h1 className="text-2xl font-bold text-neutral-900">
            Cryptocurrency Deposit
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Deposit USDT or Bitcoin to your Guestly wallet
          </p>
        </div>

        {/* Info Banner */}
        <div className="mb-6 rounded-xl border border-primary-200 bg-primary-50 p-4">
          <div className="flex gap-3">
            <svg
              className="h-5 w-5 shrink-0 text-primary-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <div className="flex-1">
              <div className="text-sm font-semibold text-primary-900">
                How Crypto Deposits Work
              </div>
              <div className="mt-1 text-xs leading-relaxed text-primary-800">
                Send cryptocurrency to the address below. Your wallet balance will be updated
                automatically once the transaction is confirmed on the blockchain (typically 1-10
                minutes). The USD equivalent will be calculated at the time of confirmation.
              </div>
            </div>
          </div>
        </div>

        {/* Crypto Payment UI */}
        <CryptoPaymentUI />
      </div>
    </ProtectedRoute>
  );
}
