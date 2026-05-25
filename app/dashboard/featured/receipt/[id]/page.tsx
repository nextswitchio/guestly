"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import { formatCurrency } from "@/lib/utils";

type ReceiptData = {
  id: string;
  event_title: string;
  organizer_name: string | null;
  organizer_email: string | null;
  total_fee: number;
  currency: string;
  payment_method: string | null;
  payment_reference: string | null;
  paid_at: string | null;
  duration_hours: number;
  fee_per_hour: number;
  status: string;
  payment_status: string;
};

export default function FeaturedReceiptPage() {
  const params = useParams();
  const id = params.id as string;
  const [data, setData] = React.useState<ReceiptData | null>(null);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    fetch(`/api/featured/receipt/${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (!d.success) throw new Error(d.error || "Failed to load receipt");
        setData(d.data);
      })
      .catch((e) => setError(e.message));
  }, [id]);

  if (error) {
    return (
      <ProtectedRoute allowRoles={["organiser"]}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-red-500">{error}</p>
        </div>
      </ProtectedRoute>
    );
  }

  if (!data) {
    return (
      <ProtectedRoute allowRoles={["organiser"]}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-neutral-500">Loading receipt...</p>
        </div>
      </ProtectedRoute>
    );
  }

  const paid = data.payment_status === "paid" || data.payment_status === "charged";
  const date = data.paid_at ? new Date(data.paid_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "—";

  return (
    <ProtectedRoute allowRoles={["organiser"]}>
      <div className="max-w-2xl mx-auto py-8 px-4">
        <div id="receipt" className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="bg-lime/10 px-8 py-6 border-b border-lime/20">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-neutral-900">Payment Receipt</h1>
                <p className="text-sm text-neutral-500 mt-1">Featured Placement</p>
              </div>
              {paid && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  Paid
                </span>
              )}
            </div>
          </div>

          {/* Body */}
          <div className="px-8 py-6 space-y-6">
            {/* Event Info */}
            <div>
              <h2 className="text-lg font-semibold text-neutral-900">{data.event_title}</h2>
              {data.organizer_name && <p className="text-sm text-neutral-500">{data.organizer_name}</p>}
              {data.organizer_email && <p className="text-sm text-neutral-400">{data.organizer_email}</p>}
            </div>

            <div className="border-t border-neutral-100" />

            {/* Details */}
            <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
              <div>
                <span className="text-neutral-500">Reference</span>
                <p className="font-mono font-semibold text-neutral-900 mt-0.5 break-all">{data.payment_reference || "—"}</p>
              </div>
              <div>
                <span className="text-neutral-500">Date</span>
                <p className="font-semibold text-neutral-900 mt-0.5">{date}</p>
              </div>
              <div>
                <span className="text-neutral-500">Payment Method</span>
                <p className="font-semibold text-neutral-900 mt-0.5 capitalize">{data.payment_method || "—"}</p>
              </div>
              <div>
                <span className="text-neutral-500">Status</span>
                <p className="font-semibold text-neutral-900 mt-0.5 capitalize">{data.status}</p>
              </div>
              <div>
                <span className="text-neutral-500">Rate</span>
                <p className="font-semibold text-neutral-900 mt-0.5">{formatCurrency(data.fee_per_hour, data.currency)} / hour</p>
              </div>
              <div>
                <span className="text-neutral-500">Duration</span>
                <p className="font-semibold text-neutral-900 mt-0.5">{data.duration_hours} hours</p>
              </div>
            </div>

            <div className="border-t border-neutral-100" />

            {/* Total */}
            <div className="flex items-center justify-between">
              <span className="text-base font-semibold text-neutral-900">Total Paid</span>
              <span className="text-2xl font-bold text-neutral-900">{formatCurrency(data.total_fee, data.currency)}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-neutral-200 px-8 py-4 bg-neutral-50 flex items-center justify-between">
            <Link
              href="/dashboard/featured"
              className="text-sm font-semibold text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              &larr; Back
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
