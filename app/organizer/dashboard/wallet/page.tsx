"use client";
import { formatCurrency } from "@/lib/utils";
import { Banknote, Timer, Upload, Plus, ArrowRight } from 'lucide-react';
import { useState, useEffect, useCallback } from "react";
import React from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useToast } from "@/components/ui/ToastProvider";
import WithdrawalModal from "@/components/wallet/WithdrawalModal";
import WithdrawalRequestsList from "@/components/wallet/WithdrawalRequestsList";
import type { OrganizerWallet, WithdrawalRequest } from "@/lib/store";

type TxItem = {
  id: string;
  amount: number;
  transaction_type: string;
  description: string;
  reference: string | null;
  payment_method: string | null;
  created_at: string;
};

export default function OrganiserWalletPage() {
  const { addToast } = useToast();
  const [wallet, setWallet] = React.useState<OrganizerWallet | null>(null);
  const [withdrawalRequests, setWithdrawalRequests] = React.useState<WithdrawalRequest[]>([]);
  const [transactions, setTransactions] = React.useState<TxItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [showWithdrawModal, setShowWithdrawModal] = React.useState(false);

  const loadWalletData = React.useCallback(async () => {
    setLoading(true);
    try {
      const [balanceRes, withdrawalsRes, txRes] = await Promise.all([
        fetch("/api/organizer/wallet/balance"),
        fetch("/api/organizer/wallet/withdraw"),
        fetch("/api/wallet/transactions?pageSize=50"),
      ]);

      const balanceData = await balanceRes.json();
      const withdrawalsData = await withdrawalsRes.json();
      const txData = await txRes.json();

      if (balanceRes.ok && balanceData.success) {
        const d = balanceData.data;
        const txs: TxItem[] = txData.ok ? (txData.transactions || []) : [];
        const earnings = txs.filter(t => t.transaction_type === "credit").reduce((s, t) => s + t.amount, 0);
        const withdrawn = txs.filter(t => t.transaction_type === "debit").reduce((s, t) => s + t.amount, 0);
        setWallet({
          userId: d.user_id,
          balance: d.balance || 0,
          pendingBalance: d.promo_balance || 0,
          totalEarnings: earnings,
          totalWithdrawn: withdrawn,
        });
        setTransactions(txs.slice(0, 5));
      }

      if (withdrawalsRes.ok && withdrawalsData.success) {
        const rawWithdrawals = withdrawalsData.withdrawals || withdrawalsData.data || [];
        setWithdrawalRequests(rawWithdrawals.map((w: any) => ({
          id: w.id,
          userId: w.user_id,
          amount: w.amount,
          method: (w.bank_name === "usdt_trc20" || w.bank_name === "usdt_erc20" || w.bank_name === "bitcoin") ? "crypto" : "bank",
          bankDetails: w.bank_name && w.bank_name !== "usdt_trc20" && w.bank_name !== "usdt_erc20" && w.bank_name !== "bitcoin" ? {
            accountName: w.account_name || "",
            accountNumber: w.account_number || "",
            bankName: w.bank_name || "",
          } : undefined,
          cryptoDetails: (w.bank_name === "usdt_trc20" || w.bank_name === "usdt_erc20" || w.bank_name === "bitcoin") ? {
            cryptoType: w.bank_name as any,
            address: w.account_number || "",
          } : undefined,
          status: w.status,
          notes: "",
          adminNotes: "",
          createdAt: new Date(w.created_at).getTime(),
          updatedAt: new Date(w.created_at).getTime(),
        })));
      }
    } catch (error) {
      console.error("Error loading wallet data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadWalletData();
  }, [loadWalletData]);

  const handleCancelWithdrawal = async (requestId: string) => {
    try {
      const res = await fetch(`/api/organizer/wallet/withdraw/${requestId}/cancel`, {
        method: "POST",
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to cancel withdrawal");
      }
    } catch (error: any) {
      const msg = error.message || "Failed to cancel withdrawal";
      addToast(msg, { type: "error" });
      throw error;
    }
  };

  return (
    <ProtectedRoute allowRoles={["organiser"]}>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Organizer Wallet</h1>
          <p className="mt-1 text-sm text-neutral-500">Manage your earnings and withdrawals</p>
        </div>

        {/* Balance Card */}
        <div className="rounded-2xl bg-gradient-to-r from-neutral-900 to-neutral-700 p-6 text-white shadow-lg">
          <p className="text-sm font-medium text-neutral-300">Available Balance</p>
          <p className="mt-2 text-4xl font-bold tabular-nums">
            {loading ? (
              <span className="inline-block h-10 w-32 animate-pulse rounded-lg bg-white/20" />
            ) : (
              formatCurrency(wallet?.balance || 0)
            )}
          </p>
          
          {wallet && wallet.pendingBalance > 0 && (
            <p className="mt-2 text-sm text-neutral-300">
              + {formatCurrency(wallet.pendingBalance)} pending settlement
            </p>
          )}

          <div className="mt-6 flex gap-3">
            <Button href="/organizer/dashboard/wallet/add" variant="primary" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Top Up
            </Button>
            <Button
              variant="secondary"
              onClick={() => setShowWithdrawModal(true)}
              disabled={loading || !wallet || wallet.balance < 10}
            >
              Withdraw Funds
            </Button>
          </div>

          {wallet && wallet.balance < 10 && wallet.balance > 0 && (
            <p className="mt-3 text-xs text-neutral-400">
              Minimum withdrawal amount is $10
            </p>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-success-50 text-lg"><Banknote className="h-4 w-4 inline-block" /></span>
            <div>
              <p className="text-lg font-bold text-neutral-900 tabular-nums">
                {loading ? "..." : formatCurrency(wallet?.totalEarnings || 0)}
              </p>
              <p className="text-xs text-neutral-500">Total Earned</p>
            </div>
          </Card>

          <Card className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning-50 text-lg"><Timer className="h-4 w-4 inline-block" /></span>
            <div>
              <p className="text-lg font-bold text-neutral-900 tabular-nums">
                {loading ? "..." : formatCurrency(wallet?.pendingBalance || 0)}
              </p>
              <p className="text-xs text-neutral-500">Pending</p>
            </div>
          </Card>

          <Card className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime/10 text-lg"><Upload className="h-4 w-4 inline-block" /></span>
            <div>
              <p className="text-lg font-bold text-neutral-900 tabular-nums">
                {loading ? "..." : formatCurrency(wallet?.totalWithdrawn || 0)}
              </p>
              <p className="text-xs text-neutral-500">Withdrawn</p>
            </div>
          </Card>
        </div>

        {/* Withdrawal Requests */}
        {!loading && (
          <WithdrawalRequestsList
            requests={withdrawalRequests}
            onCancel={handleCancelWithdrawal}
            onRefresh={loadWalletData}
          />
        )}

        {/* Transaction History */}
        {!loading && transactions.length > 0 && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-neutral-900">Recent Transactions</h3>
              <Link href="/organizer/dashboard/wallet/history" className="text-sm font-semibold text-lime hover:text-lime-hover flex items-center gap-1">
                View All <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="space-y-2">
              {transactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between rounded-xl bg-neutral-50 px-4 py-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-900 truncate">{tx.description}</p>
                    <p className="text-xs text-neutral-500">
                      {new Date(tx.created_at).toLocaleDateString()} &middot; {tx.payment_method ? tx.payment_method.replace("_", " ") : "—"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 ml-4">
                    <span className={`text-sm font-bold tabular-nums ${tx.transaction_type === "credit" ? "text-green-600" : tx.transaction_type === "debit" ? "text-red-600" : "text-neutral-500"}`}>
                      {tx.transaction_type === "credit" ? "+" : tx.transaction_type === "debit" ? "-" : ""}{formatCurrency(tx.amount)}
                    </span>
                    <Link href={`/dashboard/wallet/receipt/${tx.id}`} className="text-xs font-medium text-lime hover:text-lime-hover shrink-0">
                      Receipt
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Info Card */}
        <Card>
          <h3 className="mb-3 text-sm font-semibold text-neutral-900">
            About Withdrawals
          </h3>
          <div className="space-y-2 text-sm text-neutral-600">
            <p>
              • Minimum withdrawal amount is $10
            </p>
            <p>
              • Withdrawals are processed within 1-3 business days
            </p>
            <p>
              • You can withdraw to your bank account or crypto wallet
            </p>
            <p>
              • Pending balance becomes available after event settlement
            </p>
          </div>
        </Card>
      </div>

      {/* Withdrawal Modal */}
      {wallet && (
        <WithdrawalModal
          open={showWithdrawModal}
          onClose={() => setShowWithdrawModal(false)}
          availableBalance={wallet.balance}
          onSuccess={loadWalletData}
        />
      )}
    </ProtectedRoute>
  );
}
