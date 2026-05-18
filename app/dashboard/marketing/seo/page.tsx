'use client';

import { useState } from 'react';
import { SEOChecklist } from '@/components/marketing/SEOChecklist';
import { SEOMetricsPanel } from '@/components/marketing/SEOMetricsPanel';
import { Icon } from '@/components/ui/Icon';

export default function SEOPage() {
  const [eventId] = useState('event_123');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">SEO Optimization</h1>
        <p className="text-neutral-500 mt-1">
          Optimize your events for search engines and track SEO performance
        </p>
      </div>

      {/* SEO Score Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'SEO Score', value: '92/100', sub: 'Excellent', subColor: 'text-green-600', icon: 'trending-up', iconColor: 'text-green-600' },
          { label: 'Pages Indexed', value: '156', sub: '+12 this week', subColor: 'text-neutral-500', icon: 'search', iconColor: 'text-lime' },
          { label: 'Organic Traffic', value: '8.9K', sub: '↑ 24% from last month', subColor: 'text-green-600', icon: 'users', iconColor: 'text-blue-600' },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-neutral-200 bg-white p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-neutral-500">{stat.label}</h3>
              <Icon name={stat.icon as any} className={`w-5 h-5 ${stat.iconColor}`} />
            </div>
            <div className="text-3xl font-bold text-neutral-900">{stat.value}</div>
            <p className={`text-xs mt-2 ${stat.subColor}`}>{stat.sub}</p>
          </div>
        ))}
      </div>

      <SEOChecklist eventId={eventId} />
      <SEOMetricsPanel eventId={eventId} />

      {/* Sitemap Info */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">
          Sitemap & Structured Data
        </h2>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-neutral-50 rounded-xl">
            <div>
              <h3 className="font-medium text-neutral-900">XML Sitemap</h3>
              <p className="text-sm text-neutral-500 mt-1">
                Automatically generated and updated
              </p>
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
              <p className="text-sm text-neutral-500 mt-1">
                JSON-LD schema for events, places, and offers
              </p>
            </div>
            <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-lg">
              Active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
