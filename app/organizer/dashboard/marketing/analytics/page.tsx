'use client';

import { useState, useEffect } from 'react';
import AttributionDashboard from '@/components/marketing/analytics/AttributionDashboard';
import ChannelPerformanceChart from '@/components/marketing/analytics/ChannelPerformanceChart';
import ROICalculator from '@/components/marketing/analytics/ROICalculator';
import FunnelVisualization from '@/components/marketing/analytics/FunnelVisualization';
import CohortAnalysis from '@/components/marketing/analytics/CohortAnalysis';
import DateRangeSelector from '@/components/marketing/analytics/DateRangeSelector';

export default function AnalyticsPage() {
  const [organizerId, setOrganizerId] = useState('');
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0],
  });
  const [channels, setChannels] = useState<any[]>([]);
  const [stages, setStages] = useState<any[]>([]);
  const [cohorts, setCohorts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((d) => { if (d.ok && d.user?.id) setOrganizerId(d.user.id); })
      .catch((err) => console.error("Failed to fetch organizer ID:", err));
  }, []);

  useEffect(() => {
    if (!dateRange.start || !dateRange.end) return;
    setLoading(true);

    const params = `startDate=${dateRange.start}&endDate=${dateRange.end}`;

    Promise.all([
      fetch(`/api/analytics/channels?${params}`).then((r) => r.ok ? r.json() : []).catch((err) => { console.error("Failed to fetch channel analytics:", err); return []; }),
      fetch(`/api/analytics/funnel?${params}`).then((r) => r.ok ? r.json() : null).catch((err) => { console.error("Failed to fetch funnel analytics:", err); return null; }),
      fetch(`/api/analytics/cohorts?cohortDate=${dateRange.start}`).then((r) => r.ok ? r.json() : []).catch((err) => { console.error("Failed to fetch cohort analytics:", err); return []; }),
    ]).then(([ch, funnel, coh]) => {
      setChannels(Array.isArray(ch) ? ch : []);
      setStages(funnel?.stages ?? []);
      setCohorts(Array.isArray(coh) ? coh : []);
    }).finally(() => setLoading(false));
  }, [dateRange]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Marketing Analytics</h1>
          <p className="text-neutral-500 mt-1">Track attribution, ROI, and campaign performance</p>
        </div>
        <DateRangeSelector value={dateRange} onChange={setDateRange} />
      </div>

      {organizerId && <AttributionDashboard organizerId={organizerId} />}

      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="h-64 bg-neutral-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          {channels.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChannelPerformanceChart channels={channels} />
              <ROICalculator channels={channels} />
            </div>
          ) : (
            <div className="rounded-2xl border border-neutral-200 bg-white p-10 text-center">
              <p className="text-sm text-neutral-400">No channel performance data yet. Run campaigns to see results here.</p>
            </div>
          )}

          {stages.length > 0 && <FunnelVisualization stages={stages} />}

          {cohorts.length > 0 && <CohortAnalysis cohorts={cohorts} />}
        </>
      )}
    </div>
  );
}
