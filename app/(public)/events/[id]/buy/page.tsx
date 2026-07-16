"use client";
import React from "react";
import Link from "next/link";
import TicketSelector from "@/components/tickets/TicketSelector";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useRouter } from "next/navigation";

export default function BuyTickets({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const router = useRouter();
  const [isPast, setIsPast] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch(`/api/events/${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        const ev = d?.event ?? d?.data ?? d;
        if (ev?.date && new Date(ev.date) < new Date()) {
          setIsPast(true);
          router.replace(`/events/${id}`);
        }
      })
      .catch((err) => console.error("Failed to fetch event details:", err))
      .finally(() => setLoading(false));
  }, [id, router]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-lime border-t-transparent" />
      </div>
    );
  }

  if (isPast) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-slate-500">This event has ended. Redirecting...</p>
      </div>
    );
  }

  return (
    <ProtectedRoute allowRoles={["attendee", "organiser", "organizer"]}>
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-12">
        <nav className="mb-6 flex items-center gap-2 text-xs text-neutral-400">
          <Link href="/" className="hover:text-dark transition-colors">Home</Link>
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M9 18l6-6-6-6" /></svg>
          <Link href={`/events/${id}`} className="hover:text-dark transition-colors">Event</Link>
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M9 18l6-6-6-6" /></svg>
          <span className="text-neutral-600 font-medium">Buy Tickets</span>
        </nav>
        <div className="mx-auto max-w-xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime/10">
              <svg className="w-5 h-5 text-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-dark">Select Tickets</h1>
              <p className="text-sm text-neutral-500">Choose your ticket type and quantity</p>
            </div>
          </div>
          <div className="mt-6">
            <TicketSelector eventId={id} onContinue={(orderId) => router.replace(`/checkout?orderId=${orderId}`)} />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
