'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import type { CampaignMetrics as Metrics } from '@/lib/marketing';

interface CampaignMetricsProps {
  campaignId: string;
  refreshInterval?: number;
}

export default function CampaignMetrics({
  campaignId,
  refreshInterval = 30000,
}: CampaignMetricsProps) {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, refreshInterval);
    return () => clearInterval(interval);
  }, [campaignId, refreshInterval]);

  const fetchMetrics = async () => {
    try {
      const response = await fetch(`/api/campaigns/${campaignId}/metrics`);
      if (response.ok) {
        const data = await response.json();
        setMetrics(data.metrics);
      }
    } catch (error) {
      console.error('Failed to fetch metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Icon name="loader" className="w-6 h-6 animate-spin text-primary-500" />
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="text-center py-8 text-gray-500">
        No metrics available
      </div>
    );
  }

  const metricCards = [
    {
      label: 'Reach',
      value: metrics.reach.toLocaleString(),
      icon: 'users',
      color: 'text-blue-500',
    },
    {
      label: 'Impressions',
      value: metrics.impressions.toLocaleString(),
      icon: 'eye',
      color: 'text-purple-500',
    },
    {
      label: 'Clicks',
      value: metrics.clicks.toLocaleString(),
      icon: 'mouse-pointer',
      color: 'text-green-500',
    },
    {
      label: 'CTR',
      value: `${metrics.ctr.toFixed(2)}%`,
      icon: 'trending-up',
      color: 'text-teal-500',
    },
    {
      label: 'Conversions',
      value: metrics.conversions.toLocaleString(),
      icon: 'check-circle',
      color: 'text-success-500',
    },
    {
      label: 'Conversion Rate',
      value: `${metrics.conversionRate.toFixed(2)}%`,
      icon: 'percent',
      color: 'text-indigo-500',
    },
    {
      label: 'Revenue',
      value: `$${metrics.revenue.toLocaleString()}`,
      icon: 'dollar-sign',
      color: 'text-green-600',
    },
    {
      label: 'Cost',
      value: `$${metrics.cost.toLocaleString()}`,
      icon: 'credit-card',
      color: 'text-orange-500',
    },
    {
      label: 'ROI',
      value: `${metrics.roi.toFixed(1)}%`,
      icon: 'trending-up',
      color: metrics.roi >= 0 ? 'text-success-500' : 'text-danger-500',
    },
    {
      label: 'CAC',
      value: `$${metrics.cac.toFixed(2)}`,
      icon: 'user-plus',
      color: 'text-gray-600',
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Campaign Performance</h3>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Icon name="refresh-cw" className="w-4 h-4" />
          <span>Auto-refreshing</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {metricCards.map((metric) => (
          <Card key={metric.label} className="p-4">
            <div className="flex items-start justify-between mb-2">
              <p className="text-xs text-gray-600 dark:text-gray-400">{metric.label}</p>
              <Icon name={metric.icon as any} className={`w-4 h-4 ${metric.color}`} />
            </div>
            <p className={`text-xl font-bold ${metric.color}`}>{metric.value}</p>
          </Card>
        ))}
      </div>

      {/* Performance Summary */}
      <Card className="p-4 mt-4">
        <h4 className="font-semibold mb-3">Performance Summary</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Engagement Rate</span>
            <span className="font-medium">
              {((metrics.clicks / metrics.impressions) * 100 || 0).toFixed(2)}%
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Cost per Click</span>
            <span className="font-medium">
              ${(metrics.cost / metrics.clicks || 0).toFixed(2)}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Cost per Conversion</span>
            <span className="font-medium">
              ${(metrics.cost / metrics.conversions || 0).toFixed(2)}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Revenue per Conversion</span>
            <span className="font-medium">
              ${(metrics.revenue / metrics.conversions || 0).toFixed(2)}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}
