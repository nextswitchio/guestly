"use client";
import React from "react";
import Link from "next/link";
import { Receipt, Banknote, ArrowLeft, Eye, Clock, CheckCircle } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { TransactionReceipt } from "@/types/wallet";

export default function ReceiptsPage() {
  const [receipts, setReceipts] = React.useState<TransactionReceipt[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);

  React.useEffect(() => {
    fetchReceipts();
  }, [page]);

  const fetchReceipts = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/wallet/receipts?page=${page}&page_size=20`);
      const data = await res.json();
      if (data.success) {
        setReceipts(data.data.receipts || []);
        setTotalPages(data.data.pageCount || 1);
      } else {
        setError(data.error || "Failed to load receipts");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string, viewedAt: number | null) => {
    const isViewed = status === "viewed" || viewedAt;
    if (isViewed) {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold bg-green-100 text-green-700">
          <CheckCircle className="h-3 w-3" />
          Viewed
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold bg-blue-100 text-blue-700">
        <Clock className="h-3 w-3" />
        New
      </span>
    );
  };

  const getPartyLabel = (party: string) => {
    return party === "receiver" ? "Received" : "Sent";
  };

  const getAmountColor = (party: string, amount: number) => {
    if (party === "receiver") return "text-green-600";
    if (amount < 0) return "text-red-600";
    return "text-dark";
  };

  if (loading && receipts.length === 0) {
    return (
      <ProtectedRoute>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <ArrowLeft className="h-5 w-5 text-gray-400" />
            <h1 className="text-2xl font-bold text-dark">Receipts</h1>
          </div>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-50 rounded-xl" />
            ))}
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <ArrowLeft className="h-5 w-5 text-gray-400" />
          <h1 className="text-2xl font-bold text-dark">My Receipts</h1>
        </div>

        {error && (
          <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 flex items-center justify-between">
            <span>{error}</span>
            <Button size="sm" variant="ghost" onClick={fetchReceipts}>
              Retry
            </Button>
          </div>
        )}

        {receipts.length === 0 ? (
          <Card className="p-8 text-center">
            <Receipt className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-gray-600 mb-2">
              No receipts yet
            </h2>
            <p className="text-gray-500 mb-4">
              Your transaction receipts will appear here
            </p>
            <Link href="/dashboard/wallet">
              <Button>View Wallet</Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {receipts.map((receipt) => {
              const isCredit = receipt.transactionType === "credit";
              const isPositive = receipt.amount > 0;
              const displayAmount = Math.abs(receipt.amount);

              return (
                <Link
                  key={receipt.id}
                  href={`/wallet/receipts/${receipt.id}`}
                  className="block rounded-xl border border-gray-100 p-5 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2.5 rounded-xl ${
                          isCredit ? "bg-green-100" : "bg-red-100"
                        }`}
                      >
                        {isCredit ? (
                          <Receipt className="w-5 h-5 text-green-600" />
                        ) : (
                          <Banknote className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-dark">
                          {receipt.description}
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {receipt.reference || "No reference"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-bold text-lg ${
                          isPositive ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {isPositive ? "+" : "-"}
                        {formatCurrency(displayAmount)}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {formatDate(receipt.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getStatusBadge(receipt.status, receipt.viewedAt)}
                      <span className="text-xs bg-gray-100 px-2.5 py-0.5 rounded-full text-gray-600">
                        {getPartyLabel(receipt.party)}
                      </span>
                      {receipt.fee > 0 && (
                        <span className="text-xs bg-yellow-100 px-2.5 py-0.5 rounded-full text-yellow-700">
                          Fee: {formatCurrency(receipt.fee)}
                        </span>
                      )}
                    </div>
                    <Eye className="w-4 h-4 text-gray-400" />
                  </div>
                </Link>
              );
            })}

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-4">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-500">
                  Page {page} of {totalPages}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
