"use client";
import React from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Card from "@/components/ui/Card";
import Link from "next/link";

export default function OrganiserWalletPage() {
  const [balance, setBalance] = React.useState(0);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function load() {
      const res = await fetch("/api/wallet/balance");
      const data = await res.json();
      if (res.ok) setBalance(data.balance || 0);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <ProtectedRoute allowRoles={["organiser"]}>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Wallet</h1>
          <p className="mt-1 text-sm text-neutral-500">Manage your earnings and payouts</p>
        </div>

        {/* Balance Card */}
        <div className="rounded-2xl bg-linear-to-r from-primary-600 to-primary-800 p-6 text-white shadow-lg">
          <p className="text-sm font-medium text-primary-100">Available Balance</p>
          <p className="mt-2 text-4xl font-bold tabular-nums">
            {loading ? (
              <span className="inline-block h-10 w-32 animate-pulse rounded-lg bg-white/20" />
            ) : (
              `$${balance.toFixed(2)}`
            )}
          </p>
          <div className="mt-6 flex gap-3">
            <Link
              href="/wallet/add"
              className="rounded-xl bg-white px-5 py-2 text-sm font-semibold text-primary-700 transition hover:bg-primary-50"
            >
              Add Funds
            </Link>
            <button className="rounded-xl border border-white/30 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white/10">
              Withdraw
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "This Month", value: "$4,200", icon: "📅" },
            { label: "Pending", value: "$850", icon: "⏳" },
            { label: "Total Earned", value: "$18,600", icon: "🏆" },
          ].map((s) => (
            <Card key={s.label} className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-lg">{s.icon}</span>
              <div>
                <p className="text-lg font-bold text-neutral-900 tabular-nums">{s.value}</p>
                <p className="text-xs text-neutral-500">{s.label}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Recent Transactions */}
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-neutral-900">Recent Transactions</h2>
            <Link href="/wallet/transactions" className="text-xs font-medium text-primary-600 hover:underline">
              View all
            </Link>
          </div>
          <div className="divide-y divide-neutral-100">
            {[
              { desc: "Ticket sale — Afrobeats Night", amount: "+$120.00", time: "2h ago", positive: true },
              { desc: "Payout to bank", amount: "-$500.00", time: "1d ago", positive: false },
              { desc: "Ticket sale — Tech Summit", amount: "+$85.00", time: "2d ago", positive: true },
              { desc: "Ticket sale — Art & Wine", amount: "+$45.00", time: "3d ago", positive: true },
            ].map((tx, i) => (
              <div key={i} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <span className={`flex h-8 w-8 items-center justify-center rounded-full text-sm ${tx.positive ? "bg-success-50 text-success-600" : "bg-neutral-100 text-neutral-500"
                    }`}>
                    {tx.positive ? "↑" : "↓"}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-neutral-900">{tx.desc}</p>
                    <p className="text-xs text-neutral-500">{tx.time}</p>
                  </div>
                </div>
                <span className={`text-sm font-semibold tabular-nums ${tx.positive ? "text-success-600" : "text-neutral-900"
                  }`}>
                  {tx.amount}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </ProtectedRoute>
  );
}

