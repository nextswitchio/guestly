"use client";
import React, { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import Button from "@/components/ui/Button";

function PaymentContent() {
  const params = useSearchParams();
  const router = useRouter();
  const orderId = params.get("orderId") || "";
  const method = params.get("method") === "wallet" ? "wallet" : "card";
  const savingsApplied = parseFloat(params.get("savingsApplied") || "0");
  const savingsTargetId = params.get("savingsTargetId") || undefined;
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [retryCount, setRetryCount] = React.useState(0);

  async function pay() {
    if (loading) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/orders/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          orderId, 
          method,
          savingsApplied,
          savingsTargetId,
        }),
      });
      
      const data = await res.json().catch(() => ({}));
      
      if (!res.ok) {
        // Specific error handling
        if (res.status === 402) {
          setError("Insufficient funds in your wallet. Please add funds or use a different payment method.");
        } else if (res.status === 404) {
          setError("Order not found. Please return to checkout and try again.");
        } else if (res.status === 409) {
          setError("This order has already been paid.");
          setTimeout(() => router.replace(`/confirmation/${orderId}`), 2000);
          return;
        } else {
          setError(data.error || "Payment failed. Please try again.");
        }
        setRetryCount(prev => prev + 1);
        return;
      }
      
      // Success
      router.replace(`/confirmation/${orderId}`);
    } catch (err) {
      console.error("Payment error:", err);
      setError("Network error. Please check your connection and try again.");
      setRetryCount(prev => prev + 1);
    } finally {
      setLoading(false);
    }
  }

  function goBack() {
    router.back();
  }

  function contactSupport() {
    // Open support modal or redirect
    window.location.href = "mailto:support@guestly.com?subject=Payment Issue&body=Order ID: " + orderId;
  }

  return (
    <ProtectedRoute allowRoles={["attendee", "organiser", "organizer"]}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center py-16">
        <div className="w-full max-w-sm">
          {/* Card */}
          <div className="rounded-2xl border border-neutral-100 bg-white p-8 shadow-sm">
            {/* Icon */}
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-primary-50">
              {method === "wallet" ? (
                <svg className="h-7 w-7 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1 0-6h.75A2.25 2.25 0 0 1 18 6v0a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 6v0a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 6v12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18V6" />
                </svg>
              ) : (
                <svg className="h-7 w-7 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <rect x="2" y="5" width="20" height="14" rx="2" />
                  <path d="M2 10h20" />
                </svg>
              )}
            </div>

            <h1 className="mb-1 text-center text-lg font-bold text-neutral-900">
              Confirm Payment
            </h1>
            <p className="mb-6 text-center text-xs text-neutral-500">
              Paying with {method === "wallet" ? "Guestly Wallet" : "Debit / Credit Card"}
            </p>

            {/* Security badge */}
            <div className="mb-6 flex items-center justify-center gap-1.5 rounded-lg bg-neutral-50 py-2 text-xs text-neutral-500">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              Secure &amp; encrypted
            </div>

            {error && (
              <div className="mb-4 rounded-xl bg-danger-50 border border-danger-200 px-4 py-4 animate-shake">
                <div className="flex items-start gap-3">
                  <svg className="h-5 w-5 text-danger-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-danger-700 mb-1">Payment Failed</p>
                    <p className="text-xs text-danger-600 leading-relaxed">{error}</p>
                    
                    {/* Recovery options */}
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        onClick={pay}
                        disabled={loading}
                        className="text-xs font-medium text-danger-700 hover:text-danger-800 underline"
                      >
                        Try Again
                      </button>
                      <button
                        onClick={goBack}
                        className="text-xs font-medium text-danger-700 hover:text-danger-800 underline"
                      >
                        Change Payment Method
                      </button>
                      {retryCount >= 2 && (
                        <button
                          onClick={contactSupport}
                          className="text-xs font-medium text-danger-700 hover:text-danger-800 underline"
                        >
                          Contact Support
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <Button onClick={pay} disabled={loading} className="w-full" size="lg">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Processing\u2026
                </span>
              ) : (
                "Pay Now"
              )}
            </Button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default function PaymentPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto flex items-center justify-center py-24">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-primary-600" />
        </div>
      }
    >
      <PaymentContent />
    </Suspense>
  );
}
