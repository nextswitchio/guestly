import { ArrowRight } from 'lucide-react';
"use client";
import React from "react";
import Card from "@/components/ui/Card";
import StatusIndicator from "@/components/ui/StatusIndicator";
import Link from "next/link";
import Image from "next/image";

interface Event {
  id: string;
  title: string;
  date: string;
  city: string;
  image?: string;
}

interface RecentEventsWidgetProps {
  events: Event[];
  title?: string;
}

export function RecentEventsWidget({ events, title = "Recent Events" }: RecentEventsWidgetProps) {
  return (
    <Card padding="md" className="lg:col-span-2">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-[var(--foreground)]">{title}</h2>
        <Link href="/dashboard/events" className="text-xs font-semibold text-primary-600 hover:text-primary-700 transition-colors">
          View all<ArrowRight className="h-4 w-4 inline" />
        </Link>
      </div>
      <div className="divide-y divide-[var(--surface-border)]">
        {events.map((ev) => (
          <div key={ev.id} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0 transition-all duration-300 hover:bg-[var(--surface-hover)] hover:px-2 rounded-lg">
            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-[var(--surface-bg)] transition-transform duration-300 hover:scale-110">
              {ev.image && (
                <Image src={ev.image} alt="" width={40} height={40} className="h-full w-full object-cover" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-[var(--foreground)]">{ev.title}</p>
              <p className="text-xs text-[var(--foreground-muted)]">{ev.date} · {ev.city}</p>
            </div>
            <StatusIndicator status="active" />
            <Link
              href={`/dashboard/events/${ev.id}/manage`}
              className="shrink-0 rounded-lg border border-[var(--surface-border)] px-2.5 py-1 text-xs font-medium text-[var(--foreground)] hover:bg-[var(--surface-hover)] transition-all duration-200 hover:scale-105"
            >
              Manage
            </Link>
          </div>
        ))}
      </div>
    </Card>
  );
}
