"use client";
import React from "react";
import Link from "next/link";
import TicketSelector from "@/components/tickets/TicketSelector";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useRouter } from "next/navigation";

export default function BuyTickets({ params }: { params: { id: string } }) {
  const router = useRouter();
  function onContinue(orderId: string) {
    router.replace(`/checkout?orderId=${orderId}`);
  }
  return (
    <ProtectedRoute allowRoles={["attendee"]}>
      <>
        {/* Breadcrumb */}
        <nav className="mb-4 flex items-center gap-1.5 text-xs text-neutral-400">
          <Link href="/" className="hover:text-neutral-600">Home</Link>
          <span>/</span>
          <Link href={`/events/${params.id}`} className="hover:text-neutral-600">Event</Link>
          <span>/</span>
          <span className="text-neutral-600">Buy Tickets</span>
        </nav>

        <div className="mx-auto max-w-lg">
          <h1 className="mb-1 text-xl font-bold tracking-tight text-neutral-900">
            Select Tickets
          </h1>
          <p className="mb-6 text-sm text-neutral-500">
            Choose your ticket type and quantity
          </p>

          <TicketSelector eventId={params.id} onContinue={onContinue} />
        </div>
      </>
    </ProtectedRoute>
  );
}

