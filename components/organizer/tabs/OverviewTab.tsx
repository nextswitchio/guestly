"use client";
import React from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import Accordion from "@/components/ui/Accordion";
import Image from "next/image";
import AIInsightsPanel from "@/components/organizer/AIInsightsPanel";
import Link from "next/link";

export default function OverviewTab({ eventId }: { eventId: string }) {
  const [stats, setStats] = React.useState({ ticketsSold: 0, revenue: 0, checkIns: 0, savedBy: 0 });
  const [event, setEvent] = React.useState<{ title: string; description: string; date: string; city: string; category: string; image: string | null; eventType?: string } | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  React.useEffect(() => {
    // Fetch event details
    fetch(`/api/events/${eventId}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        const ev = d?.event ?? d?.data ?? d;
        if (ev) setEvent({
          title: ev.title,
          description: ev.description ?? "",
          date: ev.date ?? ev.start_date,
          city: ev.city ?? "",
          category: ev.category ?? "",
          image: ev.image ?? null,
          eventType: ev.event_type ?? ev.eventType ?? "Physical",
        });
      })
      .catch(() => {});

    // Fetch metrics
    fetch(`/api/events/${eventId}/metrics`)
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (d?.data) setStats({
          ticketsSold: d.data.ticketsSold || 0,
          revenue: d.data.revenue || 0,
          checkIns: d.data.checkIns || 0,
          savedBy: d.data.saves || 0,
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [eventId]);

  if (!event) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-neutral-200 py-16">
        <Icon name="calendar" size={32} className="text-neutral-400" />
        <p className="mt-3 text-sm font-medium text-neutral-600">Event not found</p>
      </div>
    );
  }

  const eventDate = new Date(event.date);
  const now = new Date();
  const isUpcoming = eventDate > now;
  const isPast = eventDate < now;
  const daysUntil = Math.ceil((eventDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="flex flex-col gap-6">
      {/* Event Hero Card */}
      <Card className="overflow-hidden p-0">
        <div className="relative h-48 w-full bg-gradient-to-br from-primary-500 to-primary-700">
          {event.image && (
            <Image 
              src={event.image} 
              alt={event.title} 
              fill 
              className="object-cover opacity-40" 
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="flex items-end justify-between">
              <div className="flex-1">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                    Physical
                  </span>
                  <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                      {event.category}
                  </span>
                </div>
                  <h2 className="text-2xl font-bold text-white">{event.title}</h2>
                <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-white/90">
                  <span className="flex items-center gap-1.5">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {event.date}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {event.city}
                  </span>
                </div>
              </div>
              <Link href={`/events/${eventId}`} target="_blank">
                <Button variant="secondary" size="sm" className="bg-white/20 backdrop-blur-sm hover:bg-white/30">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  View Public Page
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {event.description && (
          <div className="p-6">
            <p className="text-sm leading-relaxed text-neutral-600">{event.description}</p>
          </div>
        )}
      </Card>

      {/* Status Banner */}
      <Card className="border-l-4 border-l-success-500 bg-gradient-to-r from-success-50/50 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-success-100">
              <Icon name={isUpcoming ? "clock" : isPast ? "check" : "party"} size={20} className="text-success-700" />
            </span>
            <div>
              <p className="text-sm font-semibold text-neutral-900">
                {isUpcoming ? `${daysUntil} days until event` : isPast ? "Event completed" : "Event is live"}
              </p>
              <p className="text-xs text-neutral-500">
                {isUpcoming ? "Published and accepting ticket sales" : isPast ? "View post-event analytics" : "Currently in progress"}
              </p>
            </div>
          </div>
          <span className="rounded-full bg-success-500 px-4 py-1.5 text-xs font-semibold text-white shadow-sm">
            {isUpcoming ? "Active" : isPast ? "Completed" : "Live"}
          </span>
        </div>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { 
            label: "Tickets Sold", 
            value: loading ? "..." : stats.ticketsSold.toString(), 
            icon: "ticket" as const,
            color: "primary",
            trend: "+12%"
          },
          { 
            label: "Revenue", 
            value: loading ? "..." : `$${stats.revenue.toLocaleString()}`, 
            icon: "money" as const,
            color: "success",
            trend: "+8%"
          },
          { 
            label: "Check-ins", 
            value: stats.checkIns.toString(), 
            icon: "check" as const,
            color: "warning",
            trend: "—"
          },
          { 
            label: "Saved By", 
            value: loading ? "..." : stats.savedBy.toString(), 
            icon: "heart" as const,
            color: "danger",
            trend: "+5"
          },
        ].map((s) => (
          <Card key={s.label} className="group relative overflow-hidden transition-all hover:shadow-md">
            <div className="absolute right-0 top-0 h-full w-1 bg-gradient-to-b from-primary-500 to-primary-600 opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs font-medium text-neutral-500">{s.label}</p>
                <p className="mt-1 text-2xl font-bold text-neutral-900 tabular-nums">{s.value}</p>
                {s.trend !== "—" && (
                  <p className="mt-1 text-xs font-medium text-success-600">{s.trend}</p>
                )}
              </div>
              <Icon name={s.icon} size={24} className="text-neutral-400" />
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <h3 className="mb-4 text-sm font-semibold text-neutral-900">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Button variant="secondary" size="sm" fullWidth>
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            Edit Event
          </Button>
          <Button variant="secondary" size="sm" fullWidth>
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Share
          </Button>
          <Button variant="secondary" size="sm" fullWidth>
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Analytics
          </Button>
          <Button variant="secondary" size="sm" fullWidth>
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export
          </Button>
        </div>
      </Card>

      {/* AI Insights Panel */}
      <AIInsightsPanel eventId={eventId} maxInsights={3} />
    </div>
  );
}
