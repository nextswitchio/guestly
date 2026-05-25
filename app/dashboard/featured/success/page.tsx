"use client";

import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";

type ReceiptData = {
  id: string;
  event_title: string;
  total_fee: number;
  currency: string;
  payment_method: string | null;
  payment_reference: string | null;
  paid_at: string | null;
  status: string;
  payment_status: string;
  crypto_addresses: Record<string, string> | null;
};

const cryptoLabels: Record<string, string> = {
  usdt_trc20: "USDT (TRC20)",
  usdt_erc20: "USDT (ERC20)",
  bitcoin: "Bitcoin",
};

export default function FeaturedPaymentSuccessPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [data, setData] = React.useState<ReceiptData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [copiedIdx, setCopiedIdx] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!id) { setLoading(false); return; }
    fetch(`/api/featured/receipt/${id}`)
      .then(r => r.json())
      .then(res => { if (res.success) setData(res.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  async function copyAddress(address: string, key: string) {
    try {
      await navigator.clipboard.writeText(address);
      setCopiedIdx(key);
      setTimeout(() => setCopiedIdx(null), 2000);
    } catch {}
  }

  const isCrypto = data?.payment_method === "crypto";
  const isPaid = data?.payment_status === "paid";

  return (
    <ProtectedRoute allowRoles={["organiser"]}>
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="max-w-md w-full text-center space-y-6">
          <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${isCrypto ? "bg-amber-100" : "bg-green-100"}`}>
            {isCrypto ? (
              <svg className="h-8 w-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>

          {!id || loading || !data ? (
            <>
              <h1 className="text-2xl font-bold text-neutral-900">
                {loading ? "Loading..." : !id ? "Request Submitted!" : "Payment Successful!"}
              </h1>
              <p className="text-neutral-600">
                {loading
                  ? "Please wait while we load your details..."
                  : "Your featured placement request has been received."}
              </p>
            </>
          ) : isCrypto ? (
            <>
              <h1 className="text-2xl font-bold text-neutral-900">Awaiting Crypto Payment</h1>
              <p className="text-neutral-600">
                Your request for <strong>{data.event_title}</strong> has been submitted.
                Send the exact amount to one of the addresses below to complete payment.
              </p>

              {data.crypto_addresses && Object.keys(data.crypto_addresses).length > 0 && (
                <div className="space-y-3 text-left">
                  {Object.entries(data.crypto_addresses).map(([key, address]) => (
                    <div key={key} className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                      <p className="text-xs font-medium text-neutral-500 mb-1">{cryptoLabels[key] || key}</p>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 overflow-x-auto text-xs font-mono text-neutral-900 bg-white rounded-lg border border-neutral-200 px-3 py-2">
                          {address}
                        </code>
                        <button
                          onClick={() => copyAddress(address, key)}
                          className="shrink-0 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
                        >
                          {copiedIdx === key ? "Copied!" : "Copy"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-left">
                <p className="text-xs text-amber-800">
                  <strong>Note:</strong> Your request will be processed once the crypto payment is confirmed.
                  This may take a few minutes depending on network congestion.
                </p>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-neutral-900">
                {isPaid ? "Payment Successful!" : "Request Submitted!"}
              </h1>
              <p className="text-neutral-600">
                {isPaid
                  ? `Your payment for ${data.event_title} has been received. An admin will review your request shortly.`
                  : `Your request for ${data.event_title} has been submitted. You'll be notified once it's reviewed.`}
              </p>
            </>
          )}

          <div className="flex flex-col gap-3 pt-4">
            {id && (
              <Link
                href={`/dashboard/featured/receipt/${id}`}
                className="inline-flex items-center justify-center rounded-xl border border-lime bg-lime/10 px-6 py-3 text-sm font-bold text-lime hover:bg-lime/20 transition-colors"
              >
                View Receipt
              </Link>
            )}
            <Link
              href="/dashboard/featured"
              className="inline-flex items-center justify-center rounded-xl bg-lime px-6 py-3 text-sm font-bold text-dark hover:bg-lime-hover transition-colors"
            >
              Back to Featured Placements
            </Link>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
