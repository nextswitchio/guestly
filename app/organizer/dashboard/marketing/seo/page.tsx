'use client';

import { useState, useEffect } from 'react';
import { SEOChecklist } from '@/components/marketing/SEOChecklist';
import { SEOMetricsPanel } from '@/components/marketing/SEOMetricsPanel';
import { Icon } from '@/components/ui/Icon';

export default function SEOPage() {
  const [eventId, setEventId] = useState('');
  const [events, setEvents] = useState<Array<{ id: string; title: string }>>([]);

  useEffect(() => {
    fetch('/api/events/my?page_size=50')
      .then((r) => r.json())
      .then((d) => {
        const list = Array.isArray(d.events) ? d.events.map((e: any) => ({ id: e.id, title: e.title })) : [];
        setEvents(list);
        if (list.length > 0) setEventId(list[0].id);
      })
      .catch((err) => console.error("Failed to fetch events:", err));
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">SEO Optimization</h1>
        <p className="text-neutral-500 mt-1">Optimize your events for search engines and track SEO performance</p>
      </div>

      {/* Event selector */}
      {events.length > 0 && (
        <div className="rounded-2xl border border-neutral-200 bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime/10">
              <Icon name="search" size={18} className="text-lime" />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium text-neutral-500 mb-1">Analyze Event</label>
              <select
                value={eventId}
                onChange={(e) => setEventId(e.target.value)}
                className="w-full h-10 rounded-xl border border-neutral-200 bg-neutral-50 px-3 text-sm text-neutral-900 focus:border-lime focus:bg-white focus:outline-none focus:ring-2 focus:ring-lime/20 transition-all"
              >
                {events.map((ev) => (
                  <option key={ev.id} value={ev.id}>{ev.title}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {events.length === 0 && (
        <div className="rounded-2xl border border-neutral-200 bg-white p-10 text-center">
          <p className="text-sm text-neutral-400">Create an event first to use SEO tools.</p>
        </div>
      )}

      {eventId && (
        <>
          <SEOChecklist eventId={eventId} eventName={events.find((e) => e.id === eventId)?.title} />
          <SEOMetricsPanel eventId={eventId} />
        </>
      )}

      {/* Sitemap Info */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Sitemap & Structured Data</h2>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-neutral-50 rounded-xl">
            <div>
              <h3 className="font-medium text-neutral-900">XML Sitemap</h3>
              <p className="text-sm text-neutral-500 mt-1">Automatically generated and updated</p>
            </div>
            <a
              href="/sitemap.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 text-sm bg-lime text-dark font-semibold rounded-xl hover:bg-lime-hover transition-colors w-fit"
            >
              <Icon name="external-link" size={16} />
              View Sitemap
            </a>
          </div>
          <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl">
            <div>
              <h3 className="font-medium text-neutral-900">Structured Data</h3>
              <p className="text-sm text-neutral-500 mt-1">JSON-LD schema for events, places, and offers</p>
            </div>
            <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-lg">Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}
