"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils";
import { Banknote, Clock, ArrowUpRight, ArrowDownRight, Receipt, RefreshCw } from "lucide-react";

type Transaction = {
  id: string;
  amount: number;
  type: "credit" | "debit";
  description: string;
  reference: string;
  method: string;
  status: string;
  createdAt: string;
};

type VendorWallet = {
  balance: number;
  pendingBalance: number;
  totalEarnings: number;
  totalWithdrawn: number;
};

export default function VendorWalletPage() {
  const [wallet, setWallet] = useState<VendorWallet | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadWalletData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [balanceRes, txRes] = await Promise.all([
        fetch("/api/vendor/wallet/balance"),
        fetch("/api/vendor/wallet/transactions?pageSize=50"),
      ]);

      const balanceData = await balanceRes.json();
      const txData = await txRes.json();

      if (balanceRes.ok && balanceData.success) {
        const data = balanceData.data;
        setWallet({
          balance: data.balance || 0,
          pendingBalance: data.pending_balance || 0,
          totalEarnings: data.total_earnings || 0,
          totalWithdrawn: data.total_withdrawn || 0,
        });
      }

      if (txRes.ok && txData.success) {
        const txs = txData.transactions || [];
        setTransactions(txs.slice(0, 20));
      }
    } catch (err) {
      console.error("Error loading wallet data:", err);
      setError("Failed to load wallet data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWalletData();
  }, [loadWalletData]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getTransactionIcon = (type: "credit" | "debit") => {
    return type === "credit" ? (
      <ArrowUpRight className="w-4 h-4 text-green-600" />
    ) : (
      <ArrowDownRight className="w-4 h-4 text-red-600" />
    );
  };

  const getTransactionColor = (type: "credit" | "debit") => {
    return type === "credit" ? "text-green-600" : "text-red-600";
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-neutral-200 dark:bg-neutral-800 rounded-xl" />
          ))}
        </div>
        <div className="h-96 bg-neutral-200 dark:bg-neutral-800 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-dark">Wallet</h1>
          <p className="text-gray-500 mt-1">Manage your earnings and transactions</p>
        </div>
        <Button variant="outline" onClick={loadWalletData}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Wallet Summary Cards */}
      {wallet && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 rounded-xl bg-lime/10">
                <Banknote className="w-5 h-5 text-dark" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Available Balance</div>
                <div className="text-2xl font-bold text-dark">
                  {formatCurrency(wallet.balance)}
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 rounded-xl bg-blue-50">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Pending Balance</div>
                <div className="text-2xl font-bold text-blue-600">
                  {formatCurrency(wallet.pendingBalance)}
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 rounded-xl bg-green-50">
                <ArrowUpRight className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Total Earnings</div>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(wallet.totalEarnings)}
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-5 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-dark">View Receipts</h3>
            <p className="text-sm text-gray-500">See all payment receipts</p>
          </div>
          <Button asChild>
            <Link href="/vendor/wallet/receipts">
              <Receipt className="w-4 h-4 mr-2" />
              Go to Receipts
            </Link>
          </Button>
        </Card>

        <Card className="p-5 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-dark">Withdraw Funds</h3>
            <p className="text-sm text-gray-500">Transfer to your bank account</p>
          </div>
          <Button disabled={!wallet || wallet.balance <= 0}>
            <ArrowUpRight className="w-4 h-4 mr-2" />
            Withdraw
          </Button>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-dark">Recent Transactions</h2>
          <Button variant="outline" asChild>
            <Link href="/vendor/payments">View All</Link>
          </Button>
        </div>

        {transactions.length === 0 ? (
          <div className="text-center py-12">
            <Banknote className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No transactions yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-full bg-neutral-200 dark:bg-neutral-700">
                    {getTransactionIcon(tx.type)}
                  </div>
                  <div>
                    <div className="font-medium text-dark">{tx.description}</div>
                    <div className="text-sm text-gray-500">{tx.reference}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-semibold ${getTransactionColor(tx.type)}`}>
                    {tx.type === "credit" ? "+" : "-"}
                    {formatCurrency(tx.amount)}
                  </div>
                  <div className="text-sm text-gray-500">{formatDate(tx.createdAt)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
