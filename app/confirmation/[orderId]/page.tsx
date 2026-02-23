import React from "react";
import Link from "next/link";
import QRDisplay from "@/components/tickets/QRDisplay";
import Button from "@/components/ui/Button";
import { getOrder } from "@/lib/store";

export default async function ConfirmationPage({ params }: { params: { orderId: string } }) {
  const order = getOrder(params.orderId);

  if (!order || order.status !== "paid") {
    return (
      <div className="container flex flex-col items-center justify-center gap-4 py-24 text-center">
        <div className="text-4xl">😕</div>
        <h1 className="text-lg font-bold text-neutral-900">Order not found</h1>
        <p className="text-sm text-neutral-500">
          This order doesn&apos;t exist or hasn&apos;t been paid yet.
        </p>
        <Link href="/explore">
          <Button variant="outline">Browse Events</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container flex items-center justify-center py-12">
      <div className="w-full max-w-md">
        {/* Success card */}
        <div className="flex flex-col items-center gap-6 rounded-2xl border border-neutral-100 bg-white p-8 shadow-sm text-center">
          {/* Checkmark */}
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success-100">
            <svg className="h-8 w-8 text-success-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
            </svg>
          </div>

          <div>
            <h1 className="text-xl font-bold text-neutral-900">You&apos;re all set!</h1>
            <p className="mt-1 text-sm text-neutral-500">
              Your tickets have been confirmed. Show the QR code below at the event entrance.
            </p>
          </div>

          {/* QR */}
          <QRDisplay value={order.id} />

          {/* Actions */}
          <div className="flex w-full flex-col gap-2 pt-2">
            <Link href="/attendee">
              <Button className="w-full">Go to My Events</Button>
            </Link>
            <Link href="/explore">
              <Button variant="outline" className="w-full">Explore More Events</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

