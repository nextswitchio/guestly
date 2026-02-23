"use client";
import React from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Link from "next/link";
import { events } from "@/lib/events";

export default function MyEventsPage() {
  return (
    <ProtectedRoute allowRoles={["organiser"]}>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">My Events</h1>
            <p className="mt-1 text-sm text-neutral-500">{events.length} events created</p>
          </div>
          <Link
            href="/dashboard/events/new"
            className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Event
          </Link>
        </div>

        {/* Events Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((ev) => (
            <Card key={ev.id} className="group flex flex-col overflow-hidden p-0 transition hover:shadow-md">
              {/* Image */}
              <div className="relative h-36 w-full bg-neutral-100">
                {ev.image && (
                  <img src={ev.image} alt={ev.title} className="h-full w-full object-cover" />
                )}
                <span className="absolute right-2 top-2">
                  <Badge variant="success">Active</Badge>
                </span>
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col p-4">
                <h3 className="truncate text-sm font-semibold text-neutral-900 group-hover:text-primary-700">
                  {ev.title}
                </h3>
                <div className="mt-1 flex items-center gap-2 text-xs text-neutral-500">
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {ev.date}
                </div>
                <div className="mt-1 flex items-center gap-2 text-xs text-neutral-500">
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {ev.city}
                </div>

                {/* Actions */}
                <div className="mt-auto flex items-center gap-2 border-t border-neutral-100 pt-3">
                  <Link
                    href={`/events/${ev.id}`}
                    className="flex-1 rounded-lg border border-neutral-200 py-1.5 text-center text-xs font-medium text-neutral-700 transition hover:bg-neutral-50"
                  >
                    Preview
                  </Link>
                  <Link
                    href={`/dashboard/events/${ev.id}/manage`}
                    className="flex-1 rounded-lg bg-primary-600 py-1.5 text-center text-xs font-medium text-white transition hover:bg-primary-700"
                  >
                    Manage
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {events.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-neutral-200 py-16">
            <span className="text-4xl">📅</span>
            <p className="mt-3 text-sm font-medium text-neutral-600">No events yet</p>
            <p className="mt-1 text-xs text-neutral-400">Create your first event to get started</p>
            <Link
              href="/dashboard/events/new"
              className="mt-4 rounded-xl bg-primary-600 px-5 py-2 text-sm font-semibold text-white hover:bg-primary-700"
            >
              Create Event
            </Link>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
