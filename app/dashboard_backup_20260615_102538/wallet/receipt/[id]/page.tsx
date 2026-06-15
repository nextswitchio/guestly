"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
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

export default function WalletReceiptPage() {
  const params = useParams();
  const id = params.id as string;
  const [tx, setTx] = React.useState<TxData | null>(null);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    fetch(`/api/wallet/transactions/${id}`)
      .then(r => r.json())
      .then(d => {
        if (!d.success) throw new Error(d.error || "Failed to load transaction");
        setTx(d.data);
      })
      .catch(e => setError(e.message));
  }, [id]);

  if (error) return (
    <ProtectedRoute allowRoles={["organiser"]}>
      <div className="flex items-center justify-center min-h-[60vh]"><p className="text-red-500">{error}</p></div>
    </ProtectedRoute>
  );

  if (!tx) return (
    <ProtectedRoute allowRoles={["organiser"]}>
      <div className="flex items-center justify-center min-h-[60vh]"><p className="text-neutral-500">Loading receipt...</p></div>
    </ProtectedRoute>
  );

  const date = new Date(tx.created_at).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit",
  });

  const isPending = tx.transaction_type === "pending";

  return (
    <ProtectedRoute allowRoles={["organiser"]}>
      <div className="max-w-2xl mx-auto py-8 px-4">
        <div id="receipt" className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
          <div className="bg-lime/10 px-8 py-6 border-b border-lime/20">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-neutral-900">Payment Receipt</h1>
                <p className="text-sm text-neutral-500 mt-1">Wallet Deposit</p>
              </div>
              <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${isPending ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${isPending ? "bg-amber-500" : "bg-green-500"}`} />
                {isPending ? "Pending" : "Completed"}
              </span>
            </div>
          </div>

          <div className="px-8 py-6 space-y-6">
            <div className="border-t border-neutral-100" />

            <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
              <div>
                <span className="text-neutral-500">Reference</span>
                <p className="font-mono font-semibold text-neutral-900 mt-0.5 break-all">{tx.reference || "—"}</p>
              </div>
              <div>
                <span className="text-neutral-500">Date</span>
                <p className="font-semibold text-neutral-900 mt-0.5">{date}</p>
              </div>
              <div>
                <span className="text-neutral-500">Payment Method</span>
                <p className="font-semibold text-neutral-900 mt-0.5 capitalize">{tx.payment_method || "—"}</p>
              </div>
              <div>
                <span className="text-neutral-500">Type</span>
                <p className="font-semibold text-neutral-900 mt-0.5 capitalize">{tx.transaction_type}</p>
              </div>
              <div className="col-span-2">
                <span className="text-neutral-500">Description</span>
                <p className="font-semibold text-neutral-900 mt-0.5">{tx.description}</p>
              </div>
            </div>

            <div className="border-t border-neutral-100" />

            <div className="flex items-center justify-between">
              <span className="text-base font-semibold text-neutral-900">Total</span>
              <span className="text-2xl font-bold text-neutral-900">{formatCurrency(tx.amount)}</span>
            </div>
          </div>

          <div className="border-t border-neutral-200 px-8 py-4 bg-neutral-50 flex items-center justify-between">
            <Link href="/organizer/dashboard/wallet" className="text-sm font-semibold text-neutral-600 hover:text-neutral-900 transition-colors">
              &larr; Back to Wallet
            </Link>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 rounded-xl bg-lime px-5 py-2.5 text-sm font-bold text-dark hover:bg-lime-hover transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print / Download PDF
            </button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
