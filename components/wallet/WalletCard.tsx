import React from "react";
import Link from "next/link";

function WalletIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
      <rect x="2" y="4" width="20" height="16" rx="2" /><path d="M2 10h20" /><circle cx="17" cy="14.5" r="1" />
    </svg>
  );
}

export default function WalletCard({ balance, loading }: { balance: number; loading?: boolean }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-primary-600 via-primary-700 to-primary-800 p-6 text-white shadow-lg">
      {/* Decorative circles */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/5" />
      <div className="pointer-events-none absolute -bottom-12 -left-8 h-36 w-36 rounded-full bg-white/5" />

      <div className="relative z-10">
        <div className="flex items-center gap-2 text-primary-100">
          <WalletIcon />
          <span className="text-sm font-medium">Guestly Wallet</span>
        </div>

        <p className="mt-4 text-sm font-medium text-primary-200">Available Balance</p>
        <p className="mt-1 text-3xl font-bold tabular-nums tracking-tight sm:text-4xl">
          {loading ? (
            <span className="inline-block h-10 w-32 animate-pulse rounded-lg bg-white/20" />
          ) : (
            `$${balance.toFixed(2)}`
          )}
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/wallet/add"
            className="inline-flex items-center gap-1.5 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-primary-700 shadow-sm transition hover:bg-primary-50"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M12 5v14M5 12h14" /></svg>
            Add Money
          </Link>
          <Link
            href="/wallet/transactions"
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/30 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            History
          </Link>
        </div>
      </div>
    </div>
  );
}

