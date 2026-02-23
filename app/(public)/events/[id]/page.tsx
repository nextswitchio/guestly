import React from "react";
import EventHero from "@/components/events/EventHero";
import { getEventById } from "@/lib/events";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

export default async function EventDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ev = getEventById(id);

  if (!ev) {
    return (
      <div className="container flex flex-col items-center justify-center gap-4 py-24 text-center">
        <div className="text-4xl">😕</div>
        <h1 className="text-lg font-bold text-neutral-900">Event not found</h1>
        <p className="text-sm text-neutral-500">
          The event you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <Button variant="outline" href="/explore">Browse Events</Button>
      </div>
    );
  }

  const formattedDate = new Date(ev.date).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="container py-8">
      {/* Breadcrumb */}
      <nav className="mb-4 flex items-center gap-1.5 text-xs text-neutral-400">
        <Link href="/" className="hover:text-neutral-600">Home</Link>
        <span>/</span>
        <Link href="/explore" className="hover:text-neutral-600">Events</Link>
        <span>/</span>
        <span className="text-neutral-600 truncate max-w-40">{ev.title}</span>
      </nav>

      {/* Hero */}
      <EventHero
        id={ev.id}
        title={ev.title}
        date={ev.date}
        city={ev.city}
        category={ev.category}
        image={ev.image}
        description={ev.description}
      />

      {/* Details Grid */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-neutral-100 bg-white p-6">
            <h2 className="mb-3 text-base font-semibold text-neutral-900">About this event</h2>
            <p className="text-sm leading-relaxed text-neutral-600">
              {ev.description}
            </p>
          </div>
        </div>

        {/* Sidebar info */}
        <div className="flex flex-col gap-4">
          {/* Date & Location card */}
          <div className="rounded-xl border border-neutral-100 bg-white p-5">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Details
            </h3>
            <ul className="flex flex-col gap-3">
              <li className="flex items-start gap-3 text-sm text-neutral-700">
                <svg className="mt-0.5 h-4 w-4 shrink-0 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <path d="M16 2v4M8 2v4M3 10h18" />
                </svg>
                <span>{formattedDate}</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-neutral-700">
                <svg className="mt-0.5 h-4 w-4 shrink-0 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M12 21c-4-4-8-7.5-8-11a8 8 0 1 1 16 0c0 3.5-4 7-8 11z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span>{ev.city}</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-neutral-700">
                <svg className="mt-0.5 h-4 w-4 shrink-0 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M4 7h16M4 12h16M4 17h10" />
                </svg>
                <Badge variant="primary">{ev.category}</Badge>
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2">
            <Link href={`/events/${ev.id}/buy`}>
              <Button className="w-full" size="lg">Buy Tickets</Button>
            </Link>
            <Link href={`/events/${ev.id}/lobby`}>
              <Button variant="outline" className="w-full gap-2" size="lg">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Join Virtual Lobby
              </Button>
            </Link>
            <Link href={`/events/${ev.id}/store`}>
              <Button variant="outline" className="w-full gap-2">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72" />
                </svg>
                Shop Merch
              </Button>
            </Link>
            <form action="/api/events/save" method="POST">
              <input type="hidden" name="eventId" value={ev.id} />
              <Button type="submit" variant="outline" className="w-full">
                Save Event
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
