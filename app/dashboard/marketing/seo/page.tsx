'use client';

import { useState } from 'react';
import { SEOChecklist } from '@/components/marketing/SEOChecklist';
import { SEOMetricsPanel } from '@/components/marketing/SEOMetricsPanel';
import { Icon } from '@/components/ui/Icon';

export default function SEOPage() {
  const [eventId] = useState('event_123');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">SEO Optimization</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Optimize your events for search engines and track SEO performance
        </p>
      </div>

      {/* SEO Score Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">SEO Score</h3>
            <Icon name="trending-up" className="w-5 h-5 text-success-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">92/100</div>
          <p className="text-xs text-success-600 mt-2">Excellent</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Pages Indexed</h3>
            <Icon name="search" className="w-5 h-5 text-primary-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">156</div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">+12 this week</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Organic Traffic</h3>
            <Icon name="users" className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">8.9K</div>
          <p className="text-xs text-success-600 mt-2">↑ 24% from last month</p>
        </div>
      </div>

      <SEOChecklist eventId={eventId} />
      
      <SEOMetricsPanel eventId={eventId} />

      {/* Sitemap Info */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Sitemap & Structured Data
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">XML Sitemap</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Automatically generated and updated
              </p>
            </div>
            <a
              href="/sitemap.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              <Icon name="external-link" className="w-4 h-4" />
              View Sitemap
            </a>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Structured Data</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                JSON-LD schema for events, places, and offers
              </p>
            </div>
            <span className="px-3 py-1 text-xs font-medium bg-success-100 text-success-700 rounded-full">
              Active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
