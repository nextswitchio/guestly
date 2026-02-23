"use client";
import React from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Card from "@/components/ui/Card";

const announcements = [
  { id: 1, title: "Early bird tickets ending soon!", date: "Feb 14, 2026", views: 342 },
  { id: 2, title: "New headliner announced", date: "Feb 12, 2026", views: 589 },
  { id: 3, title: "Venue parking update", date: "Feb 10, 2026", views: 128 },
];

const discussions = [
  { id: 1, user: "Ada O.", message: "Can I bring my kids to the event?", replies: 3, time: "2h ago" },
  { id: 2, user: "Kwame A.", message: "Will there be food vendors?", replies: 5, time: "4h ago" },
  { id: 3, user: "Fatima B.", message: "Is there wheelchair access?", replies: 2, time: "1d ago" },
];

export default function CommunityPage() {
  return (
    <ProtectedRoute allowRoles={["organiser"]}>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Community</h1>
            <p className="mt-1 text-sm text-neutral-500">Engage with your audience and share updates</p>
          </div>
          <button className="rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700">
            New Announcement
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Followers", value: "2,180", icon: "👥" },
            { label: "Engagement", value: "68%", icon: "💬" },
            { label: "Posts", value: "24", icon: "📝" },
          ].map((s) => (
            <Card key={s.label} className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-lg">{s.icon}</span>
              <div>
                <p className="text-lg font-bold text-neutral-900 tabular-nums">{s.value}</p>
                <p className="text-xs text-neutral-500">{s.label}</p>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Announcements */}
          <Card>
            <h2 className="mb-4 text-sm font-semibold text-neutral-900">📢 Announcements</h2>
            <div className="space-y-3">
              {announcements.map((a) => (
                <div key={a.id} className="flex items-start gap-3 rounded-xl border border-neutral-100 p-3 transition hover:bg-neutral-50">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-warning-50 text-sm">
                    📌
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-neutral-900">{a.title}</p>
                    <div className="mt-1 flex items-center gap-3 text-xs text-neutral-500">
                      <span>{a.date}</span>
                      <span>👁️ {a.views}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Discussions */}
          <Card>
            <h2 className="mb-4 text-sm font-semibold text-neutral-900">💬 Recent Discussions</h2>
            <div className="space-y-3">
              {discussions.map((d) => (
                <div key={d.id} className="flex items-start gap-3 rounded-xl border border-neutral-100 p-3 transition hover:bg-neutral-50">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700">
                    {d.user.charAt(0)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-neutral-900">{d.user}</p>
                    <p className="mt-0.5 truncate text-sm text-neutral-600">{d.message}</p>
                    <div className="mt-1 flex items-center gap-3 text-xs text-neutral-500">
                      <span>{d.replies} replies</span>
                      <span>{d.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}

