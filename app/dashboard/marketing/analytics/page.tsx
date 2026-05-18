'use client';

import { useState } from 'react';
import AttributionDashboard from '@/components/marketing/analytics/AttributionDashboard';
import ChannelPerformanceChart from '@/components/marketing/analytics/ChannelPerformanceChart';
import ROICalculator from '@/components/marketing/analytics/ROICalculator';
import FunnelVisualization from '@/components/marketing/analytics/FunnelVisualization';
import CohortAnalysis from '@/components/marketing/analytics/CohortAnalysis';
import DateRangeSelector from '@/components/marketing/analytics/DateRangeSelector';

export default function AnalyticsPage() {
  const organizerId = 'org_123';
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  // Mock data for components
  const mockChannels = [
    { channel: 'Email', revenue: 15000, cost: 3000, conversions: 450, roi: 400, cac: 6.67 },
    { channel: 'Social Media', revenue: 12000, cost: 2500, conversions: 380, roi: 380, cac: 6.58 },
    { channel: 'Paid Ads', revenue: 20000, cost: 8000, conversions: 600, roi: 150, cac: 13.33 },
    { channel: 'Organic Search', revenue: 18000, cost: 1000, conversions: 520, roi: 1700, cac: 1.92 },
  ];

  const mockStages = [
    { stage: 'Visited Site', users: 10000, dropoffRate: 0 },
    { stage: 'Viewed Event', users: 6000, dropoffRate: 40 },
    { stage: 'Started Checkout', users: 2400, dropoffRate: 60 },
    { stage: 'Completed Purchase', users: 1200, dropoffRate: 50 },
  ];

  const mockCohorts = [
    {
      cohortName: 'Jan 2024',
      cohortDate: '2024-01-01',
      initialSize: 1000,
      periods: [
        { period: 0, activeUsers: 1000, retentionRate: 100, revenue: 50000, ltv: 50 },
        { period: 1, activeUsers: 650, retentionRate: 65, revenue: 32500, ltv: 50 },
        { period: 2, activeUsers: 520, retentionRate: 52, revenue: 26000, ltv: 50 },
        { period: 3, activeUsers: 450, retentionRate: 45, revenue: 22500, ltv: 50 },
      ],
    },
    {
      cohortName: 'Feb 2024',
      cohortDate: '2024-02-01',
      initialSize: 1200,
      periods: [
        { period: 0, activeUsers: 1200, retentionRate: 100, revenue: 60000, ltv: 50 },
        { period: 1, activeUsers: 780, retentionRate: 65, revenue: 39000, ltv: 50 },
        { period: 2, activeUsers: 600, retentionRate: 50, revenue: 30000, ltv: 50 },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Marketing Analytics</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Track attribution, ROI, and campaign performance
          </p>
        </div>
        <DateRangeSelector
          value={dateRange}
          onChange={setDateRange}
        />
      </div>

      <AttributionDashboard organizerId={organizerId} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChannelPerformanceChart channels={mockChannels} />
        <ROICalculator channels={mockChannels} />
      </div>

      <FunnelVisualization stages={mockStages} />
      
      <CohortAnalysis cohorts={mockCohorts} />
    </div>
  );
}
