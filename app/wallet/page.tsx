"use client";
import React from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import WalletCard from "@/components/wallet/WalletCard";
import SavingsProgressBar from "@/components/wallet/SavingsProgressBar";
import TransactionItem from "@/components/wallet/TransactionItem";

type Txn = {
  id: string;
  amount: number;
  type: "credit" | "debit";
  description: string;
  createdAt: number;
};

function ArrowRightIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path d="M9 5l7 7-7 7" />
    </svg>
  );
}

const quickActions = [
  {
    label: "Add Money",
    href: "/wallet/add",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path d="M12 5v14M5 12h14" />
      </svg>
    ),
    color: "bg-primary-50 text-primary-600",
  },
  {
    label: "Event Savings",
    href: "/wallet/savings",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
      </svg>
    ),
    color: "bg-success-50 text-success-600",
  },
  {
    label: "History",
    href: "/wallet/transactions",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: "bg-neutral-100 text-neutral-600",
  },
  {
    label: "Explore Events",
    href: "/explore",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
    color: "bg-warning-50 text-warning-600",
  },
];

export default function WalletOverview() {
  const [balance, setBalance] = React.useState(0);
  const [goal, setGoal] = React.useState(0);
  const [progress, setProgress] = React.useState(0);
  const [txns, setTxns] = React.useState<Txn[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function load() {
      try {
        const [balRes, savRes, txnRes] = await Promise.all([
          fetch("/api/wallet/balance").then((r) => r.json()),
          fetch("/api/savings").then((r) => r.json()),
          fetch("/api/wallet/transactions").then((r) => r.json()),
        ]);
        setBalance(balRes.balance || 0);
        setGoal(savRes.goal || 0);
        setProgress(savRes.progress || 0);
        setTxns((txnRes.transactions as Txn[]) || []);
      } catch {
        /* ignore */
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <ProtectedRoute allowRoles={["attendee"]}>
      <div className="container py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-neutral-900">My Wallet</h1>
          <p className="mt-1 text-sm text-neutral-500">Manage your balance, savings, and transactions</p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left column: Balance + Quick actions */}
          <div className="flex flex-col gap-6 lg:col-span-2">
            <WalletCard balance={balance} loading={loading} />

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {quickActions.map((qa) => (
                <Link
                  key={qa.label}
                  href={qa.href}
                  className="flex flex-col items-center gap-2.5 rounded-2xl border border-neutral-100 bg-white p-4 shadow-sm transition hover:border-neutral-200 hover:shadow-md"
                >
                  <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${qa.color}`}>
                    {qa.icon}
                  </span>
                  <span className="text-xs font-semibold text-neutral-700">{qa.label}</span>
                </Link>
              ))}
            </div>

            {/* Recent Transactions */}
            <div className="rounded-2xl border border-neutral-100 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
                <h2 className="text-sm font-semibold text-neutral-900">Recent Transactions</h2>
                <Link href="/wallet/transactions" className="flex items-center gap-1 text-xs font-medium text-primary-600 hover:underline">
                  View all <ArrowRightIcon />
                </Link>
              </div>
              <div className="divide-y divide-neutral-50">
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3 px-5 py-4">
                      <div className="h-9 w-9 animate-pulse rounded-full bg-neutral-100" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 w-3/4 animate-pulse rounded bg-neutral-100" />
                        <div className="h-2.5 w-1/3 animate-pulse rounded bg-neutral-100" />
                      </div>
                    </div>
                  ))
                ) : txns.length === 0 ? (
                  <div className="flex flex-col items-center gap-3 px-5 py-12 text-center">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 text-2xl">💳</span>
                    <div>
                      <p className="text-sm font-medium text-neutral-900">No transactions yet</p>
                      <p className="mt-0.5 text-xs text-neutral-400">Add money to your wallet to get started</p>
                    </div>
                  </div>
                ) : (
                  txns.slice(0, 5).map((t) => (
                    <TransactionItem key={t.id} txn={t} />
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right column: Savings */}
          <div className="flex flex-col gap-6">
            <SavingsProgressBar goal={goal || 200} progress={progress} />

            {/* Tips card */}
            <div className="rounded-2xl border border-primary-100 bg-primary-50/50 p-5">
              <h3 className="text-sm font-semibold text-primary-900">Save for Events</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-primary-700">
                Set a savings goal and add money regularly. When your favourite event drops, you&apos;ll be ready to grab tickets instantly!
              </p>
              <Link
                href="/wallet/savings"
                className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary-600 hover:underline"
              >
                Set up savings <ArrowRightIcon />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
