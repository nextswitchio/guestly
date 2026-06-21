"use client";
import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle, Clock, User, Wallet, Tag, Calendar, Banknote } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/utils";
import type { TransactionReceipt } from "@/types/wallet";

export default function ReceiptDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [receipt, setReceipt] = React.useState<TransactionReceipt | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    fetchReceipt();
  }, [id]);

  const fetchReceipt = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/wallet/receipts/${id}`);
      const data = await res.json();
      if (data.success) {
        setReceipt(data.data);
      } else {
        setError(data.error || "Failed to load receipt");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <ArrowLeft className="h-5 w-5 text-gray-400" />
            <h1 className="text-2xl font-bold text-dark">Receipt</h1>
          </div>
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-100 rounded w-48" />
            <div className="h-96 bg-gray-50 rounded-2xl" />
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <ArrowLeft className="h-5 w-5 text-gray-400" />
            <h1 className="text-2xl font-bold text-dark">Receipt</h1>
          </div>
          <Card className="p-8 text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={fetchReceipt}>Retry</Button>
          </Card>
        </div>
      </ProtectedRoute>
    );
  }

  if (!receipt) {
    return (
      <ProtectedRoute>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <ArrowLeft className="h-5 w-5 text-gray-400" />
            <h1 className="text-2xl font-bold text-dark">Receipt</h1>
          </div>
          <Card className="p-8 text-center">
            <p className="text-gray-500">Receipt not found</p>
            <Link href="/organizer/dashboard/wallet/receipts">
              <Button variant="outline" className="mt-4">
                View All Receipts
              </Button>
            </Link>
          </Card>
        </div>
      </ProtectedRoute>
    );
  }

  const isCredit = receipt.transactionType === "credit";
  const isReceiver = receipt.party === "receiver";
  const displayAmount = Math.abs(receipt.amount);
  const isViewed = receipt.status === "viewed" || receipt.viewedAt;

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <ArrowLeft className="h-5 w-5 text-gray-400" />
          <h1 className="text-2xl font-bold text-dark">Receipt Details</h1>
        </div>

        <div id="receipt" className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
          {/* Header */}
          <div
            className={`px-8 py-6 border-b ${
              isCredit ? "bg-green-50 border-green-100" : "bg-red-50 border-red-100"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-neutral-900">
                  {isCredit ? "Payment Received" : "Payment Sent"}
                </h1>
                <p className="text-sm text-neutral-500 mt-1">
                  Wallet Transaction Receipt
                </p>
              </div>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                  isViewed
                    ? "bg-green-100 text-green-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    isViewed ? "bg-green-500" : "bg-blue-500"
                  }`}
                />
                {isViewed ? "Viewed" : "New"}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="px-8 py-6 space-y-6">
            <div className="border-t border-neutral-100" />

            {/* Transaction Info */}
            <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
              <div>
                <span className="text-neutral-500">Reference</span>
                <p className="font-mono font-semibold text-neutral-900 mt-0.5 break-all">
                  {receipt.reference || "—"}
                </p>
              </div>
              <div>
                <span className="text-neutral-500">Date</span>
                <p className="font-semibold text-neutral-900 mt-0.5">
                  {formatDateTime(receipt.createdAt)}
                </p>
              </div>
              <div>
                <span className="text-neutral-500">Type</span>
                <p className="font-semibold text-neutral-900 mt-0.5 capitalize">
                  {receipt.transactionType}
                </p>
              </div>
              <div>
                <span className="text-neutral-500">Party</span>
                <p className="font-semibold text-neutral-900 mt-0.5 capitalize">
                  {receipt.party}
                </p>
              </div>
              <div className="col-span-2">
                <span className="text-neutral-500">Description</span>
                <p className="font-semibold text-neutral-900 mt-0.5">
                  {receipt.description}
                </p>
              </div>
            </div>

            <div className="border-t border-neutral-100" />

            {/* Amount Summary */}
            <div className="space-y-4">
              {receipt.fee > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-500">Amount Before Fee</span>
                  <span className="font-semibold text-neutral-900">
                    {formatCurrency(Math.abs(receipt.netAmount))}
                  </span>
                </div>
              )}
              {receipt.fee > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-500">Platform Fee</span>
                  <span className="font-semibold text-yellow-600">
                    -{formatCurrency(receipt.fee)}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between pt-2">
                <span className="text-base font-semibold text-neutral-900">
                  Total Amount
                </span>
                <span
                  className={`text-2xl font-bold ${
                    isReceiver ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {isReceiver ? "+" : "-"}
                  {formatCurrency(displayAmount)}
                </span>
              </div>
            </div>

            <div className="border-t border-neutral-100" />

            {/* Metadata */}
            {receipt.metaData && Object.keys(receipt.metaData).length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-neutral-700">
                  Additional Details
                </h3>
                <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
                  {receipt.metaData.payment_id && (
                    <div>
                      <span className="text-neutral-500">Payment ID</span>
                      <p className="font-mono text-xs text-neutral-900 mt-0.5 break-all">
                        {receipt.metaData.payment_id}
                      </p>
                    </div>
                  )}
                  {receipt.metaData.event_id && (
                    <div>
                      <span className="text-neutral-500">Event ID</span>
                      <p className="font-mono text-xs text-neutral-900 mt-0.5 break-all">
                        {receipt.metaData.event_id}
                      </p>
                    </div>
                  )}
                  {receipt.metaData.collaboration_id && (
                    <div>
                      <span className="text-neutral-500">Collaboration ID</span>
                      <p className="font-mono text-xs text-neutral-900 mt-0.5 break-all">
                        {receipt.metaData.collaboration_id}
                      </p>
                    </div>
                  )}
                  {receipt.metaData.influencer_name && (
                    <div>
                      <span className="text-neutral-500">Influencer</span>
                      <p className="font-semibold text-neutral-900 mt-0.5">
                        {receipt.metaData.influencer_name}
                      </p>
                    </div>
                  )}
                  {receipt.metaData.type && (
                    <div>
                      <span className="text-neutral-500">Type</span>
                      <p className="font-semibold text-neutral-900 mt-0.5">
                        {receipt.metaData.type.replace("_", " ")}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-neutral-200 px-8 py-4 bg-neutral-50 flex items-center justify-between">
            <Link
              href="/organizer/dashboard/wallet/receipts"
              className="text-sm font-semibold text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              &larr; Back to Receipts
            </Link>
            <Button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print / Download
            </Button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
