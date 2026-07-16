"use client";

import React from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils";

type TxItem = {
  id: string;
  amount: number;
  transaction_type: string;
  description: string;
  reference: string | null;
  payment_method: string | null;
  created_at: string;
};

export default function WalletHistoryPage() {
  const [txs, setTxs] = React.useState<TxItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);

  React.useEffect(() => {
    setLoading(true);
    fetch(`/api/wallet/transactions?page=${page}&pageSize=20`)
      .then(r => r.json())
      .then(d => {
        if (d.ok) {
          setTxs(d.transactions || []);
        }
      })
      .catch((err) => console.error("Failed to fetch wallet transactions:", err))
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <ProtectedRoute allowRoles={["organiser"]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Transaction History</h1>
            <p className="mt-1 text-sm text-neutral-500">All wallet transactions</p>
          </div>
          <Link href="/organizer/dashboard/wallet">
            <Button variant="secondary">&larr; Back to Wallet</Button>
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-lime border-t-transparent" />
          </div>
        ) : txs.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-neutral-500">No transactions yet.</p>
            <Link href="/organizer/dashboard/wallet/add" className="mt-3 inline-block"><Button variant="primary">Add Funds</Button></Link>
          </Card>
        ) : (
          <Card className="overflow-hidden">
            <div className="divide-y divide-neutral-100">
              {txs.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between px-6 py-4 hover:bg-neutral-50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-900 truncate">{tx.description}</p>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      {new Date(tx.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                      {tx.payment_method && <> &middot; <span className="capitalize">{tx.payment_method.replace("_", " ")}</span></>}
                      {tx.reference && <> &middot; Ref: {tx.reference.slice(0, 12)}</>}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 ml-4">
                    <span className={`text-sm font-bold tabular-nums ${tx.transaction_type === "credit" ? "text-green-600" : tx.transaction_type === "debit" ? "text-red-600" : "text-amber-600"}`}>
                      {tx.transaction_type === "credit" ? "+" : tx.transaction_type === "debit" ? "-" : ""}{formatCurrency(tx.amount)}
                    </span>
                    <Link href={`/dashboard/wallet/receipt/${tx.id}`} className="text-xs font-semibold text-lime hover:text-lime-hover shrink-0">
                      Receipt
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </ProtectedRoute>
  );
}
