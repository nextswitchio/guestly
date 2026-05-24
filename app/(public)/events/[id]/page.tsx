import React from "react";
import type { Metadata } from "next";
import type { Event } from "@/lib/events";
import { BACKEND_URL } from "@/lib/api/client";
import { slugify } from "@/lib/utils";
import Button from "@/components/ui/Button";
import EventDetailClient from "./EventDetailClient";
import Icon from '@/components/ui/Icon';

export const dynamic = 'force-dynamic';

function isUUID(s: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);
}

function mapApiEvent(raw: any): Event | null {
  if (!raw) return null;
  return {
    id: raw.id,
    title: raw.title,
    description: raw.description ?? "",
    date: raw.date ?? raw.start_date ?? raw.startDate,
    category: raw.category ?? raw.category_name ?? "",
    country: raw.country ?? "",
    state: raw.state,
    city: raw.city ?? "",
    image: raw.image ?? raw.images?.[0] ?? "/globe.svg",
    eventType: raw.eventType ?? raw.event_type ?? "Physical",
    venue: raw.venue,
    latitude: raw.latitude,
    longitude: raw.longitude,
    community: raw.community,
    communityType: raw.communityType ?? raw.community_type,
    tickets: raw.tickets,
    streamingConfig: raw.streamingConfig ?? raw.streaming_config,
    postEventMerchSales: raw.postEventMerchSales ?? raw.post_event_merch_sales,
    postEventCommunityAccess: raw.postEventCommunityAccess ?? raw.post_event_community_access,
  };
}

async function fetchEventById(id: string): Promise<Event | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/events/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json();
    return mapApiEvent(data.data ?? data);
  } catch {
    return null;
  }
}

async function fetchEventBySlug(slug: string): Promise<Event | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/events?page_size=100`, { cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json();
    const items: any[] = data.events ?? data.data ?? [];
    const found = items.find((e: any) => slugify(e.title ?? "") === slug);
    return found ? mapApiEvent(found) : null;
  } catch {
    return null;
  }
}

async function resolveEvent(id: string): Promise<Event | null> {
  if (isUUID(id)) return fetchEventById(id);
  return fetchEventBySlug(id);
}

export default async function EventDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ev = await resolveEvent(id);

  if (!ev) {
    return (
      <div className="container mx-auto flex flex-col items-center justify-center gap-4 py-24 text-center">
        <div className="mb-4">
          <Icon name="x-circle" className="w-12 h-12 text-slate-400 mx-auto" />
        </div>
        <div>
          <div className="bg-red-50 text-red-600 px-4 py-2 rounded-full text-sm font-medium inline-block mb-2">Error</div>
          <h1 className="text-lg font-bold text-slate-900">Event not found</h1>
          <p className="text-sm text-slate-500">
            The event you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Button variant="outline" href="/explore">Browse Events</Button>
        </div>
      </div>
    );
  }

  return <EventDetailClient event={ev} />;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const ev = await resolveEvent(id);
  const title = ev ? `${ev.title} — ${ev.city}` : "Event";
  const description = ev?.description || "Event details and tickets";
  return {
    title,
    description,
    openGraph: { title, description, type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}
