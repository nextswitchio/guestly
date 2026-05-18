"use client";
import { Banknote, Timer, Upload } from 'lucide-react';
import { useState, useEffect, useCallback } from "react";
import React from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import WithdrawalModal from "@/components/wallet/WithdrawalModal";
import WithdrawalRequestsList from "@/components/wallet/WithdrawalRequestsList";
import type { OrganizerWallet, WithdrawalRequest } from "@/lib/store";

export default function OrganiserWalletPage() {
  const [wallet, setWallet] = React.useState<OrganizerWallet | null>(null);
  const [withdrawalRequests, setWithdrawalRequests] = React.useState<WithdrawalRequest[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [showWithdrawModal, setShowWithdrawModal] = React.useState(false);

  const loadWalletData = React.useCallback(async () => {
    setLoading(true);
    try {
      // Load wallet balance
      const balanceRes = await fetch("/api/organizer/wallet/balance");
      const balanceData = await balanceRes.json();
      if (balanceRes.ok && balanceData.success) {
        setWallet(balanceData.data);
      }

      // Load withdrawal requests
      const withdrawalsRes = await fetch("/api/organizer/wallet/withdraw");
      const withdrawalsData = await withdrawalsRes.json();
      if (withdrawalsRes.ok && withdrawalsData.success) {
        setWithdrawalRequests(withdrawalsData.data);
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
      alert(error.message || "Failed to cancel withdrawal");
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
        <div className="rounded-2xl bg-gradient-to-r from-primary-600 to-primary-800 p-6 text-white shadow-lg">
          <p className="text-sm font-medium text-primary-100">Available Balance</p>
          <p className="mt-2 text-4xl font-bold tabular-nums">
            {loading ? (
              <span className="inline-block h-10 w-32 animate-pulse rounded-lg bg-white/20" />
            ) : (
              `${(wallet?.balance || 0).toFixed(2)}`
            )}
          </p>
          
          {wallet && wallet.pendingBalance > 0 && (
            <p className="mt-2 text-sm text-primary-100">
              + ${wallet.pendingBalance.toFixed(2)} pending settlement
            </p>
          )}

          <div className="mt-6 flex gap-3">
            <Button
              variant="secondary"
              onClick={() => setShowWithdrawModal(true)}
              disabled={loading || !wallet || wallet.balance < 10}
            >
              Withdraw Funds
            </Button>
          </div>

          {wallet && wallet.balance < 10 && wallet.balance > 0 && (
            <p className="mt-3 text-xs text-primary-200">
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
                ${loading ? "..." : (wallet?.totalEarnings || 0).toFixed(2)}
              </p>
              <p className="text-xs text-neutral-500">Total Earned</p>
            </div>
          </Card>

          <Card className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning-50 text-lg"><Timer className="h-4 w-4 inline-block" /></span>
            <div>
              <p className="text-lg font-bold text-neutral-900 tabular-nums">
                ${loading ? "..." : (wallet?.pendingBalance || 0).toFixed(2)}
              </p>
              <p className="text-xs text-neutral-500">Pending</p>
            </div>
          </Card>

          <Card className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-lg"><Upload className="h-4 w-4 inline-block" /></span>
            <div>
              <p className="text-lg font-bold text-neutral-900 tabular-nums">
                ${loading ? "..." : (wallet?.totalWithdrawn || 0).toFixed(2)}
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
