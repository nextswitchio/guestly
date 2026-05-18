'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, TrendingUp, MousePointerClick, Users, DollarSign, Calendar, BarChart3, ArrowUpRight, ArrowDownRight, RefreshCw } from 'lucide-react';

interface PerformanceData {
  totalClicks: number;
  totalConversions: number;
  totalRevenue: number;
  totalCommission: number;
  conversionRate: number;
  clicksByDay: { date: string; clicks: number }[];
  conversionsByDay: { date: string; conversions: number }[];
  topEvents: { eventId: string; eventName: string; clicks: number; conversions: number; revenue: number; commission: number }[];
  topPlatforms: { platform: string; clicks: number; conversions: number }[];
}

type TimeRange = '7d' | '30d' | '90d' | 'all';

export default function PerformancePage() {
  const [data, setData] = useState<PerformanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');

  useEffect(() => {
    fetchPerformance();
  }, [timeRange]);

  const fetchPerformance = async () => {
    try {
      const res = await fetch(`/api/affiliates/performance?range=${timeRange}`);
      if (res.ok) {
        const result = await res.json();
        setData(result.performance);
      }
    } catch (error) {
      console.error('Failed to fetch performance:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-lime border-t-lime" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <Link href="/affiliate/dashboard" className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Performance</h1>
            <p className="text-neutral-500 mt-1">Detailed analytics for your affiliate promotions</p>
          </div>
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-12 text-center">
          <BarChart3 className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">No performance data yet</h3>
          <p className="text-neutral-500">Start promoting events to see your analytics here</p>
        </div>
      </div>
    );
  }

  const timeRanges: { id: TimeRange; label: string }[] = [
    { id: '7d', label: '7 Days' },
    { id: '30d', label: '30 Days' },
    { id: '90d', label: '90 Days' },
    { id: 'all', label: 'All Time' },
  ];

  const maxClicks = Math.max(...data.clicksByDay.map(d => d.clicks), 1);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/affiliate/dashboard" className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Performance</h1>
            <p className="text-neutral-500 mt-1">Detailed analytics for your affiliate promotions</p>
          </div>
        </div>
        <div className="flex gap-1">
          {timeRanges.map((r) => (
            <button
              key={r.id}
              onClick={() => setTimeRange(r.id)}
              className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                timeRange === r.id ? 'bg-lime text-dark' : 'text-neutral-500 hover:bg-neutral-100'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Clicks', value: data.totalClicks.toLocaleString(), icon: <MousePointerClick className="h-5 w-5" />, bg: 'bg-lime/10', color: 'text-lime' },
          { label: 'Conversions', value: data.totalConversions.toLocaleString(), icon: <TrendingUp className="h-5 w-5" />, bg: 'bg-green-100', color: 'text-green-600' },
          { label: 'Conversion Rate', value: `${data.conversionRate.toFixed(1)}%`, icon: <BarChart3 className="h-5 w-5" />, bg: 'bg-blue-100', color: 'text-blue-600' },
          { label: 'Commission Earned', value: `₦${data.totalCommission.toLocaleString()}`, icon: <DollarSign className="h-5 w-5" />, bg: 'bg-amber-100', color: 'text-amber-600' },
        ].map((m, i) => (
          <div key={i} className="rounded-2xl border border-neutral-200 bg-white p-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-neutral-500">{m.label}</p>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${m.bg}`}>
                <span className={m.color}>{m.icon}</span>
              </div>
            </div>
            <p className="text-2xl font-bold text-neutral-900">{m.value}</p>
          </div>
        ))}
      </div>

      {/* Clicks Chart */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-6">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Clicks Over Time</h3>
        <div className="flex items-end gap-1 h-40">
          {data.clicksByDay.map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full bg-lime rounded-t-sm transition-all"
                style={{ height: `${(d.clicks / maxClicks) * 100}%`, minHeight: d.clicks > 0 ? '4px' : '0' }}
              />
              <span className="text-[10px] text-neutral-400">{new Date(d.date).toLocaleDateString('en', { day: 'numeric' })}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top Events & Platforms */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Events */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Top Performing Events</h3>
          {data.topEvents.length === 0 ? (
            <p className="text-sm text-neutral-500 text-center py-8">No data yet</p>
          ) : (
            <div className="space-y-3">
              {data.topEvents.slice(0, 5).map((event, i) => (
                <div key={event.eventId} className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-lime/10 flex items-center justify-center text-xs font-bold text-lime">{i + 1}</span>
                    <div>
                      <p className="text-sm font-medium text-neutral-900 truncate max-w-[200px]">{event.eventName}</p>
                      <p className="text-xs text-neutral-500">{event.clicks} clicks • {event.conversions} conversions</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-neutral-900">₦{event.commission.toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Platforms */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Traffic by Platform</h3>
          {data.topPlatforms.length === 0 ? (
            <p className="text-sm text-neutral-500 text-center py-8">No data yet</p>
          ) : (
            <div className="space-y-3">
              {data.topPlatforms.map((p, i) => {
                const totalClicks = data.topPlatforms.reduce((sum, pl) => sum + pl.clicks, 0);
                const percentage = totalClicks > 0 ? (p.clicks / totalClicks) * 100 : 0;
                return (
                  <div key={i} className="p-3 bg-neutral-50 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-neutral-900 capitalize">{p.platform}</p>
                      <span className="text-sm text-neutral-500">{p.clicks} clicks ({percentage.toFixed(0)}%)</span>
                    </div>
                    <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                      <div className="h-full bg-lime rounded-full transition-all" style={{ width: `${percentage}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
