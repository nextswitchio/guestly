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

  return (
    <ProtectedRoute>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Dashboard</h1>
          <p className="mt-1 text-sm text-neutral-500">Welcome back! Here&apos;s what&apos;s happening with your events.</p>
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

        <Card>
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
      </div>
    </ProtectedRoute>
  );
}
