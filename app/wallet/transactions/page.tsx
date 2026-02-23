"use client";
import React from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import TransactionItem from "@/components/wallet/TransactionItem";

type Txn = {
  id: string;
  amount: number;
  type: "credit" | "debit";
  description: string;
  createdAt: number;
};

type Filter = "all" | "credit" | "debit";

export default function WalletTransactions() {
  const [txns, setTxns] = React.useState<Txn[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [filter, setFilter] = React.useState<Filter>("all");

  React.useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/wallet/transactions");
        const data = await res.json();
        if (res.ok) setTxns(data.transactions as Txn[]);
      } catch {
        /* ignore */
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = filter === "all" ? txns : txns.filter((t) => t.type === filter);
  const totalIn = txns.filter((t) => t.type === "credit").reduce((s, t) => s + t.amount, 0);
  const totalOut = txns.filter((t) => t.type === "debit").reduce((s, t) => s + t.amount, 0);

  const filters: { value: Filter; label: string }[] = [
    { value: "all", label: "All" },
    { value: "credit", label: "Money In" },
    { value: "debit", label: "Money Out" },
  ];

  return (
    <ProtectedRoute allowRoles={["attendee"]}>
      <div className="container py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-1.5 text-xs text-neutral-400">
          <Link href="/wallet" className="hover:text-neutral-600">Wallet</Link>
          <span>/</span>
          <span className="text-neutral-600">Transactions</span>
        </nav>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-neutral-900">Transaction History</h1>
          <p className="mt-1 text-sm text-neutral-500">View all your wallet activity</p>
        </div>

        {/* Summary cards */}
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-neutral-100 bg-white p-4 shadow-sm">
            <p className="text-xs text-neutral-400">Total Transactions</p>
            <p className="mt-1 text-xl font-bold tabular-nums text-neutral-900">{txns.length}</p>
          </div>
          <div className="rounded-2xl border border-neutral-100 bg-white p-4 shadow-sm">
            <p className="text-xs text-neutral-400">Money In</p>
            <p className="mt-1 text-xl font-bold tabular-nums text-success-600">+${totalIn.toFixed(2)}</p>
          </div>
          <div className="col-span-2 rounded-2xl border border-neutral-100 bg-white p-4 shadow-sm sm:col-span-1">
            <p className="text-xs text-neutral-400">Money Out</p>
            <p className="mt-1 text-xl font-bold tabular-nums text-neutral-900">-${totalOut.toFixed(2)}</p>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="mb-4 flex gap-1 rounded-xl bg-neutral-100 p-1">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`flex-1 rounded-lg px-3 py-2 text-xs font-semibold transition ${filter === f.value
                  ? "bg-white text-neutral-900 shadow-sm"
                  : "text-neutral-500 hover:text-neutral-700"
                }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Transaction list */}
        <div className="rounded-2xl border border-neutral-100 bg-white shadow-sm">
          {loading ? (
            <div className="divide-y divide-neutral-50">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 px-5 py-4">
                  <div className="h-9 w-9 animate-pulse rounded-full bg-neutral-100" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-2/3 animate-pulse rounded bg-neutral-100" />
                    <div className="h-2.5 w-1/4 animate-pulse rounded bg-neutral-100" />
                  </div>
                  <div className="h-3.5 w-16 animate-pulse rounded bg-neutral-100" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-3 px-5 py-16 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100 text-2xl">
                {filter === "all" ? "📭" : filter === "credit" ? "📥" : "📤"}
              </span>
              <div>
                <p className="text-sm font-medium text-neutral-900">
                  {filter === "all" ? "No transactions yet" : `No ${filter === "credit" ? "incoming" : "outgoing"} transactions`}
                </p>
                <p className="mt-0.5 text-xs text-neutral-400">
                  {filter === "all"
                    ? "Add money to your wallet to get started"
                    : "Try changing the filter to see other transactions"}
                </p>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-neutral-50">
              {filtered.map((t) => (
                <TransactionItem key={t.id} txn={t} />
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}

