"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils";

type TxData = {
  id: string;
  amount: number;
  transaction_type: string;
  description: string;
  reference: string | null;
  payment_method: string | null;
  created_at: string;
};

function WalletSuccessInner() {
  const searchParams = useSearchParams();
  const txnId = searchParams.get("txn");
  const [tx, setTx] = React.useState<TxData | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!txnId) { setLoading(false); return; }
    fetch(`/api/wallet/transactions/${txnId}`)
      .then(r => r.json())
      .then(d => { if (d.success) setTx(d.data); })
      .catch((err) => console.error("Failed to fetch wallet transaction:", err))
      .finally(() => setLoading(false));
  }, [txnId]);

  return (
    <ProtectedRoute allowRoles={["organiser"]}>
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-neutral-900">Funds Added Successfully!</h1>

          {loading ? (
            <p className="text-neutral-500">Loading transaction details...</p>
          ) : !txnId || !tx ? (
            <p className="text-neutral-600">Your funds have been added to your wallet.</p>
          ) : (
            <Card className="p-4 text-left space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-neutral-500">Amount</span><span className="font-semibold text-neutral-900">{formatCurrency(tx.amount)}</span></div>
              <div className="flex justify-between"><span className="text-neutral-500">Method</span><span className="font-semibold text-neutral-900 capitalize">{tx.payment_method || "—"}</span></div>
              <div className="flex justify-between"><span className="text-neutral-500">Reference</span><span className="font-mono text-xs text-neutral-900">{tx.reference || "—"}</span></div>
              <div className="flex justify-between"><span className="text-neutral-500">Status</span><span className="font-semibold text-neutral-900 capitalize">{tx.transaction_type === "pending" ? "Pending" : "Completed"}</span></div>
            </Card>
          )}

          <div className="flex flex-col gap-3 pt-2">
            {txnId && (
              <Link href={`/dashboard/wallet/receipt/${txnId}`}>
                <Button variant="secondary" fullWidth>View Receipt</Button>
              </Link>
            )}
            <Link href="/organizer/dashboard/wallet">
              <Button variant="primary" fullWidth>Back to Wallet</Button>
            </Link>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default function WalletSuccessPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[60vh]"><p className="text-neutral-500">Loading...</p></div>}>
      <WalletSuccessInner />
    </Suspense>
  );
}
