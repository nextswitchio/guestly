"use client";
import React from "react";
import Link from "next/link";
import TicketSelector from "@/components/tickets/TicketSelector";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useRouter } from "next/navigation";

export default function BuyTickets({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const router = useRouter();
  function onContinue(orderId: string) {
    router.replace(`/checkout?orderId=${orderId}`);
  }
  return (
    <ProtectedRoute allowRoles={["attendee"]}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        {/* Breadcrumb */}
        <nav className="mb-4 flex items-center gap-1.5 text-xs text-slate-400">
          <Link href="/" className="hover:text-slate-600">Home</Link>
          <span>/</span>
          <Link href={`/events/${id}`} className="hover:text-slate-600">Event</Link>
          <span>/</span>
          <span className="text-slate-600">Buy Tickets</span>
        </nav>

        <div className="mx-auto max-w-lg">
          <h1 className="mb-2 text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Select Tickets
          </h1>
          <p className="mb-6 text-sm text-slate-500">
            Choose your ticket type and quantity
          </p>

          <TicketSelector eventId={id} onContinue={onContinue} />
        </div>
      </div>
    </ProtectedRoute>
  );
}

