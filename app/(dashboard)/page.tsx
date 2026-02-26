"use client";
import React from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Card from "@/components/ui/Card";
import Link from "next/link";
import { events } from "@/lib/events";

const stats = [
  { label: "Total Events", value: "6", icon: "📅", color: "bg-primary-50 text-primary-700" },
  { label: "Tickets Sold", value: "1,240", icon: "🎟️", color: "bg-success-50 text-success-700" },
  { label: "Revenue", value: "$18,600", icon: "💰", color: "bg-warning-50 text-warning-700" },
  { label: "Upcoming", value: "3", icon: "🚀", color: "bg-blue-50 text-blue-700" },
];

export default function DashboardPage() {
  const recent = events.slice(0, 4);
  const activities = [
    { id: "a1", title: "New ticket sale", meta: "less than a minute ago", tag: "sales" },
    { id: "a2", title: "Attendee joined lobby", meta: "2 minutes ago", tag: "engagement" },
    { id: "a3", title: "Vendor accepted invite", meta: "1 hour ago", tag: "vendors" },
    { id: "a4", title: "Merch order paid", meta: "3 hours ago", tag: "merch" },
  ];

  return (
    <ProtectedRoute>
      <div className="flex flex-col gap-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 sm:text-3xl">Dashboard</h1>
            <p className="mt-1 text-sm text-neutral-500">Overview of your event performance and key metrics.</p>
          </div>
          <div className="hidden items-center gap-2 sm:flex">
            <button className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-50">Last 7 days</button>
            <button className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-50">Export</button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((s) => (
            <Card key={s.label} className="flex items-start gap-3">
              <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg ${s.color}`}>
                {s.icon}
              </span>
              <div>
                <p className="text-xs font-medium text-neutral-500">{s.label}</p>
                <p className="text-xl font-bold text-neutral-900 tabular-nums">{s.value}</p>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <div className="mb-3">
              <h2 className="text-sm font-semibold text-neutral-900">Activity Overview</h2>
              <p className="text-xs text-neutral-500">Track sales, check-ins, and engagement over time</p>
            </div>
            <div className="h-64 rounded-xl border border-neutral-100 bg-neutral-50" />
          </Card>
          <Card>
            <div className="mb-3">
              <h2 className="text-sm font-semibold text-neutral-900">Recent Activity</h2>
              <p className="text-xs text-neutral-500">Latest updates across your workspace</p>
            </div>
            <div className="flex flex-col gap-3">
              {activities.map((a) => (
                <div key={a.id} className="flex items-start justify-between rounded-lg border border-neutral-100 bg-white p-3">
                  <div>
                    <div className="text-sm font-medium text-neutral-900">{a.title}</div>
                    <div className="text-xs text-neutral-500">{a.meta}</div>
                  </div>
                  <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] font-semibold text-neutral-700">{a.tag}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-neutral-900">Recent Events</h2>
              <Link href="/dashboard/events" className="text-xs font-medium text-primary-600 hover:underline">
                View all
              </Link>
            </div>
            <div className="divide-y divide-neutral-100">
              {recent.map((ev) => (
                <div key={ev.id} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                  <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                    {ev.image && (
                      <img src={ev.image} alt="" className="h-full w-full object-cover" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-neutral-900">{ev.title}</p>
                    <p className="text-xs text-neutral-500">{ev.date} · {ev.city}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-success-50 px-2.5 py-0.5 text-xs font-medium text-success-700">
                    Active
                  </span>
                </div>
              ))}
            </div>
          </Card>
          <div className="hidden lg:block" />
        </div>
      </div>
    </ProtectedRoute>
  );
}
