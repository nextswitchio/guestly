import React from "react";
import Card from "@/components/ui/Card";
import { getEventById } from "@/lib/events";

export default function OverviewTab({ eventId }: { eventId: string }) {
  const e = getEventById(eventId);

  if (!e) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-neutral-200 py-16">
        <span className="text-3xl">📅</span>
        <p className="mt-3 text-sm font-medium text-neutral-600">Event not found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Event Header */}
      <div className="flex items-start gap-4">
        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-neutral-100">
          {e.image && (
            <img src={e.image} alt={e.title} className="h-full w-full object-cover" />
          )}
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-bold text-neutral-900">{e.title}</h2>
          <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-neutral-500">
            <span className="flex items-center gap-1">
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {e.date}
            </span>
            <span className="flex items-center gap-1">
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {e.city}
            </span>
            <span className="rounded-full bg-primary-50 px-2 py-0.5 font-medium text-primary-700">{e.category}</span>
          </div>
          {e.description && (
            <p className="mt-2 text-sm text-neutral-600">{e.description}</p>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Tickets Sold", value: "248", icon: "🎟️" },
          { label: "Revenue", value: "$3,720", icon: "💰" },
          { label: "Check-ins", value: "0", icon: "✅" },
          { label: "Saved By", value: "52", icon: "❤️" },
        ].map((s) => (
          <Card key={s.label} className="flex items-center gap-2 p-3">
            <span className="text-lg">{s.icon}</span>
            <div>
              <p className="text-sm font-bold text-neutral-900 tabular-nums">{s.value}</p>
              <p className="text-xs text-neutral-500">{s.label}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Status Card */}
      <Card className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-success-50">
            <span className="h-2.5 w-2.5 rounded-full bg-success-500" />
          </span>
          <div>
            <p className="text-sm font-medium text-neutral-900">Event is Live</p>
            <p className="text-xs text-neutral-500">Published and accepting ticket sales</p>
          </div>
        </div>
        <span className="rounded-full bg-success-50 px-3 py-1 text-xs font-semibold text-success-700">Active</span>
      </Card>
    </div>
  );
}

