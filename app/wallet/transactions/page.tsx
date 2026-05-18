"use client";
import { CreditCard } from 'lucide-react';
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

type FilterType = "all" | "credit" | "debit";
type DateRange = "all" | "today" | "week" | "month" | "year";

function BackIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path d="M15 19l-7-7 7-7" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
  );
}

export default function TransactionsPage() {
  const [txns, setTxns] = React.useState<Txn[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [filterType, setFilterType] = React.useState<FilterType>("all");
  const [dateRange, setDateRange] = React.useState<DateRange>("all");
  const [showFilters, setShowFilters] = React.useState(false);

  React.useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/wallet/transactions");
        const data = await res.json();
        setTxns((data.transactions as Txn[]) || []);
      } catch {
        /* ignore */
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Filter transactions
  const filteredTxns = React.useMemo(() => {
    let filtered = txns;

    // Filter by type
    if (filterType !== "all") {
      filtered = filtered.filter((t) => t.type === filterType);
    }

    // Filter by date range
    if (dateRange !== "all") {
      const now = Date.now();
      const ranges: Record<DateRange, number> = {
        all: 0,
        today: 24 * 60 * 60 * 1000,
        week: 7 * 24 * 60 * 60 * 1000,
        month: 30 * 24 * 60 * 60 * 1000,
        year: 365 * 24 * 60 * 60 * 1000,
      };
      const cutoff = now - ranges[dateRange];
      filtered = filtered.filter((t) => t.createdAt >= cutoff);
    }

    return filtered;
  }, [txns, filterType, dateRange]);

  // Calculate summary stats
  const stats = React.useMemo(() => {
    const totalCredit = filteredTxns
      .filter((t) => t.type === "credit")
      .reduce((sum, t) => sum + t.amount, 0);
    const totalDebit = filteredTxns
      .filter((t) => t.type === "debit")
      .reduce((sum, t) => sum + t.amount, 0);
    return { totalCredit, totalDebit, count: filteredTxns.length };
  }, [filteredTxns]);

  // Export to CSV
  const handleExport = () => {
    if (filteredTxns.length === 0) return;

    const headers = ["Date", "Description", "Type", "Amount"];
    const rows = filteredTxns.map((t) => [
      new Date(t.createdAt).toLocaleString(),
      t.description,
      t.type === "credit" ? "Deposit" : "Withdrawal",
      `$${t.amount.toFixed(2)}`,
    ]);

    const csv = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transactions-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <ProtectedRoute allowRoles={["attendee"]}>
      <div>
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/wallet"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-600 transition hover:bg-neutral-50"
            >
              <BackIcon />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-neutral-900">Transaction History</h1>
              <p className="mt-0.5 text-sm text-neutral-500">
                {stats.count} transaction{stats.count !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
            >
              <FilterIcon />
              Filters
            </button>
            <button
              onClick={handleExport}
              disabled={filteredTxns.length === 0}
              className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <DownloadIcon />
              Export CSV
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mb-6 rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Type Filter */}
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  Transaction Type
                </label>
                <div className="flex gap-2">
                  {(["all", "credit", "debit"] as FilterType[]).map((type) => (
                    <button
                      key={type}
                      onClick={() => setFilterType(type)}
                      className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition ${
                        filterType === type
                          ? "border-primary-600 bg-primary-50 text-primary-700"
                          : "border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50"
                      }`}
                    >
                      {type === "all" ? "All" : type === "credit" ? "Deposits" : "Withdrawals"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date Range Filter */}
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  Date Range
                </label>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value as DateRange)}
                  className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-700 transition focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">Last 7 Days</option>
                  <option value="month">Last 30 Days</option>
                  <option value="year">Last Year</option>
                </select>
              </div>
            </div>

            {/* Clear Filters */}
            {(filterType !== "all" || dateRange !== "all") && (
              <button
                onClick={() => {
                  setFilterType("all");
                  setDateRange("all");
                }}
                className="mt-3 text-sm font-medium text-primary-600 hover:underline"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}

        {/* Summary Stats */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-neutral-500">Total Deposits</p>
            <p className="mt-1 text-2xl font-bold text-success-600">
              ${stats.totalCredit.toFixed(2)}
            </p>
          </div>
          <div className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-neutral-500">Total Withdrawals</p>
            <p className="mt-1 text-2xl font-bold text-neutral-900">
              ${stats.totalDebit.toFixed(2)}
            </p>
          </div>
          <div className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-neutral-500">Net Change</p>
            <p
              className={`mt-1 text-2xl font-bold ${
                stats.totalCredit - stats.totalDebit >= 0
                  ? "text-success-600"
                  : "text-danger-600"
              }`}
            >
              {stats.totalCredit - stats.totalDebit >= 0 ? "+" : ""}$
              {(stats.totalCredit - stats.totalDebit).toFixed(2)}
            </p>
          </div>
        </div>

        {/* Transactions List */}
        <div className="rounded-2xl border border-neutral-100 bg-white shadow-sm">
          <div className="border-b border-neutral-100 px-5 py-4">
            <h2 className="text-sm font-semibold text-neutral-900">All Transactions</h2>
          </div>
          <div className="divide-y divide-neutral-50">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 px-5 py-4">
                  <div className="h-9 w-9 animate-pulse rounded-full bg-neutral-100" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-3/4 animate-pulse rounded bg-neutral-100" />
                    <div className="h-2.5 w-1/3 animate-pulse rounded bg-neutral-100" />
                  </div>
                  <div className="h-4 w-16 animate-pulse rounded bg-neutral-100" />
                </div>
              ))
            ) : filteredTxns.length === 0 ? (
              <div className="flex flex-col items-center gap-3 px-5 py-12 text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 text-2xl">
                  <CreditCard className="h-4 w-4 inline-block" />
                </span>
                <div>
                  <p className="text-sm font-medium text-neutral-900">No transactions found</p>
                  <p className="mt-0.5 text-xs text-neutral-400">
                    {filterType !== "all" || dateRange !== "all"
                      ? "Try adjusting your filters"
                      : "Add money to your wallet to get started"}
                  </p>
                </div>
              </div>
            ) : (
              filteredTxns.map((t) => <TransactionItem key={t.id} txn={t} />)
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
