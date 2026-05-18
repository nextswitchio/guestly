"use client";
import React, { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";

function ConfettiIcon() {
  return (
    <svg className="h-16 w-16 text-success-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function CombinedConfirmationContent() {
  const params = useSearchParams();
  const router = useRouter();
  const orderIds = params.get("orderIds")?.split(",") || [];

  if (orderIds.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <p className="text-sm text-neutral-500">No orders found.</p>
        <Link href="/explore">
          <Button variant="outline">Explore Events</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mx-auto max-w-2xl text-center">
        {/* Success Icon */}
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-success-50 p-4">
            <ConfettiIcon />
          </div>
        </div>

        {/* Success Message */}
        <h1 className="text-3xl font-bold text-neutral-900">Order Confirmed!</h1>
        <p className="mt-3 text-neutral-600">
          Your tickets and merchandise orders have been successfully placed.
        </p>

        {/* Order Details */}
        <div className="mt-8 rounded-2xl border border-neutral-100 bg-white p-6 text-left shadow-sm">
          <h2 className="text-sm font-semibold text-neutral-900">Order Details</h2>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-neutral-600">Total Orders</span>
              <span className="font-semibold text-neutral-900">{orderIds.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-600">Order IDs</span>
              <div className="flex flex-col items-end gap-1">
                {orderIds.map((id) => (
                  <span key={id} className="font-mono text-xs text-neutral-900">{id}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="mt-8 rounded-2xl border border-primary-100 bg-primary-50 p-6 text-left">
          <h3 className="text-sm font-semibold text-primary-900">What's Next?</h3>
          <ul className="mt-3 space-y-2 text-sm text-primary-800">
            <li className="flex items-start gap-2">
              <Icon name="mail" className="w-5 h-5 text-primary-800 mt-0.5" />
              <span>Check your email for order confirmation and tickets</span>
            </li>
            <li className="flex items-start gap-2">
              <Icon name="ticket" className="w-5 h-5 text-primary-800 mt-0.5" />
              <span>Your tickets are available in your attendee dashboard</span>
            </li>
            <li className="flex items-start gap-2">
              <Icon name="package" className="w-5 h-5 text-primary-800 mt-0.5" />
              <span>Merchandise orders will be processed according to fulfillment type</span>
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/attendee/dashboard">
            <Button size="lg" className="w-full sm:w-auto">
              View My Tickets
            </Button>
          </Link>
          <Link href="/explore">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Explore More Events
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CombinedConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto flex items-center justify-center py-24">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-primary-600" />
        </div>
      }
    >
      <CombinedConfirmationContent />
    </Suspense>
  );
}
