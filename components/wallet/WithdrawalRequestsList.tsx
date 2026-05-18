"use client";
import { Check, Timer, X } from 'lucide-react';
import React from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import type { WithdrawalRequest } from "@/lib/store";

interface WithdrawalRequestsListProps {
  requests: WithdrawalRequest[];
  onCancel: (requestId: string) => void;
  onRefresh: () => void;
}

const statusColors = {
  pending: "bg-amber-100 text-amber-700",
  processing: "bg-lime/10 text-lime",
  completed: "bg-green-100 text-green-700",
  failed: "bg-red-100 text-red-700",
  cancelled: "bg-neutral-100 text-neutral-700",
};

const statusLabels = {
  pending: "Pending",
  processing: "Processing",
  completed: "Completed",
  failed: "Failed",
  cancelled: "Cancelled",
};

export default function WithdrawalRequestsList({
  requests,
  onCancel,
  onRefresh,
}: WithdrawalRequestsListProps) {
  const [cancelling, setCancelling] = React.useState<string | null>(null);

  const handleCancel = async (requestId: string) => {
    if (!confirm("Are you sure you want to cancel this withdrawal request?")) {
      return;
    }

    setCancelling(requestId);
    try {
      await onCancel(requestId);
      onRefresh();
    } finally {
      setCancelling(null);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (requests.length === 0) {
    return (
      <Card>
        <div className="py-8 text-center">
          <p className="text-sm text-neutral-500">No withdrawal requests yet</p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-neutral-900">
          Withdrawal Requests
        </h2>
        <button
          onClick={onRefresh}
          className="text-xs font-medium text-lime hover:underline"
        >
          Refresh
        </button>
      </div>

      <div className="space-y-3">
        {requests.map((request) => (
          <div
            key={request.id}
            className="rounded-xl border border-neutral-200 p-4 space-y-3"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-neutral-900 tabular-nums">
                    ${request.amount.toFixed(2)}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      statusColors[request.status]
                    }`}
                  >
                    {statusLabels[request.status]}
                  </span>
                </div>

                <p className="mt-1 text-sm text-neutral-600">
                  {request.method === "bank" ? "Bank Transfer" : "Crypto"}
                  {" · "}
                  {formatDate(request.createdAt)}
                </p>

                {request.method === "bank" && request.bankDetails && (
                  <div className="mt-2 text-xs text-neutral-500">
                    {request.bankDetails.bankName} •{" "}
                    {request.bankDetails.accountNumber}
                  </div>
                )}

                {request.method === "crypto" && request.cryptoDetails && (
                  <div className="mt-2 text-xs text-neutral-500">
                    {request.cryptoDetails.cryptoType.toUpperCase()} •{" "}
                    {request.cryptoDetails.address.slice(0, 10)}...
                    {request.cryptoDetails.address.slice(-8)}
                  </div>
                )}

                {request.notes && (
                  <div className="mt-2 rounded-lg bg-neutral-50 p-2 text-xs text-neutral-600">
                    <span className="font-medium">Note:</span> {request.notes}
                  </div>
                )}

                {request.adminNotes && (
                  <div className="mt-2 rounded-lg bg-lime/10 p-2 text-xs text-lime">
                    <span className="font-medium">Admin:</span>{" "}
                    {request.adminNotes}
                  </div>
                )}

                {request.txHash && (
                  <div className="mt-2 text-xs text-neutral-500">
                    <span className="font-medium">TX Hash:</span>{" "}
                    <span className="font-mono">{request.txHash}</span>
                  </div>
                )}
              </div>

              {request.status === "pending" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCancel(request.id)}
                  loading={cancelling === request.id}
                >
                  Cancel
                </Button>
              )}
            </div>

            {request.status === "processing" && (
              <div className="rounded-lg bg-lime/10 p-2 text-xs text-lime">
               <Timer className="h-4 w-4 inline" /> Your withdrawal is being processed. This typically takes 1-3
                business days.
              </div>
            )}

            {request.status === "completed" && request.completedAt && (
              <div className="rounded-lg bg-green-50 p-2 text-xs text-green-700">
               <Check className="h-4 w-4 inline" /> Completed on {formatDate(request.completedAt)}
              </div>
            )}

            {request.status === "failed" && (
              <div className="rounded-lg bg-red-50 p-2 text-xs text-red-700">
               <X className="h-4 w-4 inline" /> Withdrawal failed. Funds have been returned to your balance.
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
