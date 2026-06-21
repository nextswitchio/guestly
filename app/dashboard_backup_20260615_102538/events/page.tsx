"use client";
import React, { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Badge from "@/components/ui/Badge";
import Link from "next/link";
import Image from "next/image";
import EmptyState from "@/components/ui/EmptyState";

interface Event {
  id: string;
  title: string;
  date: string | null;
  city: string | null;
  image: string | null;
  status: string;
}

export default function MyEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [creationStatus, setCreationStatus] = useState<{ can_create: boolean; event_count: number; limit: number } | null>(null);

  useEffect(() => {
    fetch("/api/events/my")
      .then((r) => r.json())
      .then((d) => setEvents(Array.isArray(d.events) ? d.events : []))
      .catch(() => setEvents([]));
    fetch("/api/events/creation-status")
      .then((r) => r.json())
      .then((d) => setCreationStatus(d))
      .catch(() => setCreationStatus(null))
      .finally(() => setLoading(false));
  }, []);

  const statusVariant = (status: string): "success" | "warning" | "neutral" => {
    if (status === "published") return "success";
    if (status === "draft") return "warning";
    return "neutral";
  };

  if (loading) {
    return (
      <ProtectedRoute allowRoles={["organiser"]}>
        <div className="space-y-6 animate-pulse">
          <div className="h-8 bg-neutral-100 rounded w-40" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => <div key={i} className="h-64 bg-neutral-100 rounded-2xl" />)}
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowRoles={["organiser"]}>
      <div className="flex flex-col space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">My Events</h1>
            <p className="mt-1 text-sm text-neutral-500">{events.length} event{events.length !== 1 ? "s" : ""} created</p>
          </div>
          {creationStatus?.can_create ? (
            <Link
              href="/organizer/dashboard/events/new"
              className="inline-flex items-center gap-2 rounded-xl bg-lime px-5 py-2.5 text-sm font-semibold text-dark shadow-sm transition hover:bg-lime-hover"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Event
            </Link>
          ) : (
            <Link
              href="/organizer/dashboard/subscription"
              className="inline-flex items-center gap-2 rounded-xl bg-lime px-5 py-2.5 text-sm font-semibold text-dark shadow-sm transition hover:bg-lime-hover"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Subscribe to Create More
            </Link>
          )}
        </div>

        {creationStatus && !creationStatus.can_create && (
          <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-100">
              <svg className="h-5 w-5 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-amber-900">Free plan limit reached</p>
              <p className="text-xs text-amber-700">
                You've used all {creationStatus.limit} free events. Subscribe to any of our affordable plans to continue creating and managing events.
              </p>
            </div>
            <Link href="/organizer/dashboard/subscription" className="shrink-0 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-amber-800 ring-1 ring-amber-200 hover:bg-amber-100">
              View Plans
            </Link>
          </div>
        )}

        {/* Events Grid */}
        {events.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((ev) => (
              <div key={ev.id} className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white p-0 transition hover:shadow-md">
                <div className="relative h-36 w-full bg-neutral-100">
                  {ev.image && (
                    <Image src={ev.image} alt={ev.title} fill sizes="(max-width: 1024px) 100vw, 33vw" className="object-cover" />
                  )}
                  <span className="absolute right-2 top-2">
                    <Badge variant={statusVariant(ev.status)}>{ev.status}</Badge>
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <h3 className="truncate text-sm font-semibold text-neutral-900 group-hover:text-lime-600">{ev.title}</h3>
                  {ev.date && (
                    <div className="mt-1 flex items-center gap-2 text-xs text-neutral-500">
                      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(ev.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </div>
                  )}
                  {ev.city && (
                    <div className="mt-1 flex items-center gap-2 text-xs text-neutral-500">
                      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {ev.city}
                    </div>
                  )}
                  <div className="mt-auto flex items-center gap-2 border-t border-neutral-100 pt-3">
                    <Link href={`/events/${ev.id}`} className="flex-1 rounded-xl border border-neutral-200 bg-white py-1.5 text-center text-xs font-medium text-neutral-700 transition hover:bg-neutral-50">
                      Preview
                    </Link>
                    <Link href={`/dashboard/events/${ev.id}/manage`} className="flex-1 rounded-xl bg-lime py-1.5 text-center text-xs font-semibold text-dark transition hover:bg-lime-hover">
                      Manage
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon="party"
            title="Create your first event"
            description="Start building amazing experiences for your attendees. Set up tickets, manage vendors, track analytics, and more."
            action={{ label: "Create Event", href: "/organizer/dashboard/events/new" }}
            tips={[
              "Choose between Physical, Virtual, or Hybrid event types",
              "Set up multiple ticket tiers with different pricing",
              "Add merchandise to generate additional revenue",
              "Use analytics to optimize your event performance",
            ]}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}
