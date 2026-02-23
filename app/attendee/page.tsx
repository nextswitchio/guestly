"use client";
import React from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import EventCard from "@/components/events/EventCard";
import EmptyState from "@/components/ui/EmptyState";
import { filterEvents } from "@/lib/events";

const tabs = [
  { key: "upcoming", label: "Upcoming" },
  { key: "saved", label: "Saved" },
  { key: "recommended", label: "For You" },
  { key: "past", label: "Past" },
] as const;

type TabKey = (typeof tabs)[number]["key"];

import { useRouter } from "next/navigation";

export default function AttendeePage() {
  const router = useRouter();
  const [tab, setTab] = React.useState<TabKey>("upcoming");

  const allEvents = filterEvents({}).data;
  const upcoming = allEvents.filter((e) => new Date(e.date) > new Date());
  const past = allEvents.filter((e) => new Date(e.date) <= new Date());
  const recommended = filterEvents({ category: "Tech" }).data;
  const saved = filterEvents({ city: "Lagos" }).data.slice(0, 2);

  const sectionMap: Record<TabKey, typeof allEvents> = {
    upcoming,
    saved,
    recommended,
    past,
  };

  const events = sectionMap[tab];

  return (
    <ProtectedRoute allowRoles={["attendee"]}>
      <div className="flex flex-col gap-6">
        {/* Greeting */}
        <div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 sm:text-2xl">
            Welcome back 👋
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Here&apos;s what&apos;s happening with your events
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Upcoming", value: upcoming.length, color: "bg-primary-50 text-primary-700" },
            { label: "Saved", value: saved.length, color: "bg-warning-50 text-warning-700" },
            { label: "Recommended", value: recommended.length, color: "bg-success-50 text-success-700" },
            { label: "Past", value: past.length, color: "bg-neutral-100 text-neutral-700" },
          ].map((s) => (
            <div
              key={s.label}
              className="flex flex-col items-center gap-1 rounded-xl border border-neutral-100 bg-white p-4 shadow-sm"
            >
              <span className={`rounded-full px-2.5 py-0.5 text-lg font-bold ${s.color}`}>
                {s.value}
              </span>
              <span className="text-xs text-neutral-500">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 overflow-x-auto rounded-lg bg-neutral-100 p-1">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex-shrink-0 rounded-md px-4 py-2 text-xs font-medium transition-colors ${tab === t.key
                ? "bg-white text-neutral-900 shadow-sm"
                : "text-neutral-500 hover:text-neutral-700"
                }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {events.length === 0 ? (
          <div className="flex justify-center py-8">
            <EmptyState
              title={`No ${tab} events`}
              description="Check back later or explore new events."
              actionLabel="Explore Events"
              onAction={() => router.push("/explore")}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((e) => (
              <EventCard
                key={e.id}
                id={e.id}
                title={e.title}
                description={e.description}
                date={e.date}
                city={e.city}
                category={e.category}
                image={e.image}
              />
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
