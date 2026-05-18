import React from "react";
import type { Metadata } from "next";
import { getEventById } from "@/lib/events";
import Button from "@/components/ui/Button";
import EventDetailClient from "./EventDetailClient";
import Icon from '@/components/ui/Icon';

export default async function EventDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ev = getEventById(id);

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
  const ev = getEventById(id);
  const title = ev ? `${ev.title} — ${ev.city}` : "Event";
  const description = ev?.description || "Event details and tickets";
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
