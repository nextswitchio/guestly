"use client";
import { CreditCard } from 'lucide-react';
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
    bg: "bg-lime/10", text: "text-lime",
  },
  {
    label: "Crypto Deposit",
    href: "/wallet/crypto",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    bg: "bg-amber-100", text: "text-amber-600",
  },
  {
    label: "Event Savings",
    href: "/wallet/savings",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
      </svg>
    ),
    bg: "bg-emerald-100", text: "text-emerald-600",
  },
  {
    label: "History",
    href: "/wallet/transactions",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    bg: "bg-neutral-100", text: "text-neutral-600",
  },
];

export default function WalletOverview() {
  const [balance, setBalance] = React.useState(0);
  const [promoBalance, setPromoBalance] = React.useState(0);
  const [goal, setGoal] = React.useState(0);
  const [progress, setProgress] = React.useState(0);
  const [txns, setTxns] = React.useState<Txn[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [cryptoBalances, setCryptoBalances] = React.useState<any[]>([]);
  const [totalPortfolioValue, setTotalPortfolioValue] = React.useState<number>();

  React.useEffect(() => {
    async function load() {
      try {
        const [portfolioRes, savRes, balRes, txnRes] = await Promise.all([
          fetch("/api/wallet/portfolio").then((r) => r.json()),
          fetch("/api/savings").then((r) => r.json()),
          fetch("/api/wallet/balance").then((r) => r.json()).catch(() => ({})),
          fetch("/api/wallet/transactions").then((r) => r.json()),
        ]);

        if (portfolioRes.success) {
          setBalance(portfolioRes.data.fiatBalance || 0);
          setPromoBalance(portfolioRes.data.promoBalance || 0);
          setCryptoBalances(portfolioRes.data.cryptoBalances || []);
          setTotalPortfolioValue(portfolioRes.data.totalPortfolioValue);
        } else if (balRes.ok) {
          setBalance(balRes.balance || 0);
          setPromoBalance(balRes.promoBalance || 0);
        }

        if (savRes.success && Array.isArray(savRes.targets)) {
          const totalGoal = savRes.targets.reduce((s: number, t: any) => s + (t.goal_amount || 0), 0);
          const totalProgress = savRes.targets.reduce((s: number, t: any) => s + (t.current_amount || 0), 0);
          setGoal(totalGoal);
          setProgress(totalProgress);
        }

        if (txnRes.ok && Array.isArray(txnRes.transactions)) {
          setTxns(txnRes.transactions.map((tx: any) => ({
            id: tx.id,
            amount: tx.amount,
            type: tx.transaction_type === "credit" ? "credit" : "debit",
            description: tx.description,
            createdAt: tx.created_at ? new Date(tx.created_at).getTime() : Date.now(),
          })));
        }
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 md:text-4xl">My Wallet</h1>
        <p className="mt-2 text-neutral-500">Manage your balance, savings, and transactions</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <WalletCard
            balance={balance}
            promoBalance={promoBalance}
            loading={loading}
            cryptoBalances={cryptoBalances}
            totalPortfolioValue={totalPortfolioValue}
          />

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {quickActions.map((qa) => (
              <Link
                key={qa.label}
                href={qa.href}
                className="flex flex-col items-center gap-2.5 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm transition hover:border-neutral-300 hover:shadow-md"
              >
                <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${qa.bg} ${qa.text}`}>
                  {qa.icon}
                </span>
                <span className="text-xs font-semibold text-neutral-900">{qa.label}</span>
              </Link>
            ))}
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
              <h2 className="text-lg font-semibold text-neutral-900">Recent Transactions</h2>
              <Link href="/wallet/transactions" className="flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors">
                View all <ArrowRightIcon />
              </Link>
            </div>
            <div className="divide-y divide-neutral-100">
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
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 text-2xl"><CreditCard className="h-4 w-4 inline-block" /></span>
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

        <div className="flex flex-col gap-6">
          <SavingsProgressBar goal={goal || 200} progress={progress} />

          <div className="rounded-2xl border border-lime/30 bg-lime/5 p-5">
            <h3 className="text-sm font-semibold text-dark">Save for Events</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-neutral-600">
              Set a savings goal and add money regularly. When your favourite event drops, you&apos;ll be ready to grab tickets instantly!
            </p>
            <Link
              href="/wallet/savings"
              className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-lime hover:text-lime-hover transition-colors"
            >
              Set up savings <ArrowRightIcon />
            </Link>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
