'use client';

import { useState, useEffect } from 'react';
import { Icon } from '@/components/ui/Icon';

interface SEOMetrics {
  impressions: number;
  clicks: number;
  ctr: number;
  averagePosition: number;
  topQueries: Array<{ query: string; impressions: number; clicks: number; position: number }>;
  topPages: Array<{ page: string; impressions: number; clicks: number; ctr: number }>;
  trends: {
    impressions: number;
    clicks: number;
    ctr: number;
    position: number;
  };
}

interface SEOMetricsPanelProps {
  eventId: string;
}

export function SEOMetricsPanel({ eventId }: SEOMetricsPanelProps) {
  const [metrics, setMetrics] = useState<SEOMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    fetchMetrics();
  }, [eventId, timeRange]);

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/seo/metrics/${eventId}?range=${timeRange}`);
      if (response.ok) {
        const data = await response.json();
        setMetrics(data);
      }
    } catch (error) {
      console.error('Failed to fetch SEO metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatPercentage = (num: number) => {
    return `${num.toFixed(1)}%`;
  };

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return <Icon name="trending-up" className="w-4 h-4 text-green-500" />;
    if (trend < 0) return <Icon name="trending-down" className="w-4 h-4 text-red-500" />;
    return <Icon name="minus" className="w-4 h-4 text-neutral-400" />;
  };

  const getTrendColor = (trend: number) => {
    if (trend > 0) return 'text-green-600';
    if (trend < 0) return 'text-red-600';
    return 'text-neutral-600';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-neutral-200 rounded w-1/3"></div>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-neutral-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="bg-white rounded-2xl shadow p-6">
        <p className="text-neutral-500 text-center">No SEO metrics available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow">
      {/* Header */}
      <div className="p-6 border-b border-neutral-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-neutral-900">SEO Performance</h3>
          <div className="flex items-center gap-2">
            <select
              value={timeRange}
              onChange={e => setTimeRange(e.target.value as any)}
              className="px-3 py-1.5 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-lime/20 focus:border-lime"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
            <button
              onClick={fetchMetrics}
              className="p-1.5 text-neutral-400 hover:text-neutral-600 rounded-lg hover:bg-neutral-100"
            >
              <Icon name="refresh-cw" className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="p-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-neutral-50 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-neutral-500">Impressions</span>
            <div className="flex items-center gap-1">
              {getTrendIcon(metrics.trends.impressions)}
              <span className={`text-xs font-medium ${getTrendColor(metrics.trends.impressions)}`}>
                {metrics.trends.impressions > 0 ? '+' : ''}
                {formatPercentage(metrics.trends.impressions)}
              </span>
            </div>
          </div>
          <div className="text-2xl font-bold text-neutral-900">{formatNumber(metrics.impressions)}</div>
        </div>

        <div className="p-4 bg-neutral-50 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-neutral-500">Clicks</span>
            <div className="flex items-center gap-1">
              {getTrendIcon(metrics.trends.clicks)}
              <span className={`text-xs font-medium ${getTrendColor(metrics.trends.clicks)}`}>
                {metrics.trends.clicks > 0 ? '+' : ''}
                {formatPercentage(metrics.trends.clicks)}
              </span>
            </div>
          </div>
          <div className="text-2xl font-bold text-neutral-900">{formatNumber(metrics.clicks)}</div>
        </div>

        <div className="p-4 bg-neutral-50 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-neutral-500">CTR</span>
            <div className="flex items-center gap-1">
              {getTrendIcon(metrics.trends.ctr)}
              <span className={`text-xs font-medium ${getTrendColor(metrics.trends.ctr)}`}>
                {metrics.trends.ctr > 0 ? '+' : ''}
                {formatPercentage(metrics.trends.ctr)}
              </span>
            </div>
          </div>
          <div className="text-2xl font-bold text-neutral-900">{formatPercentage(metrics.ctr)}</div>
        </div>

        <div className="p-4 bg-neutral-50 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-neutral-500">Avg. Position</span>
            <div className="flex items-center gap-1">
              {getTrendIcon(-metrics.trends.position)}
              <span className={`text-xs font-medium ${getTrendColor(-metrics.trends.position)}`}>
                {metrics.trends.position < 0 ? '+' : ''}
                {formatPercentage(Math.abs(metrics.trends.position))}
              </span>
            </div>
          </div>
          <div className="text-2xl font-bold text-neutral-900">{metrics.averagePosition.toFixed(1)}</div>
        </div>
      </div>

      {/* Top Queries */}
      <div className="p-6 border-t border-neutral-200">
        <h4 className="text-sm font-semibold text-neutral-900 mb-4">Top Search Queries</h4>
        <div className="space-y-3">
          {metrics.topQueries.map((query, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-neutral-900 truncate">{query.query}</div>
                <div className="text-xs text-neutral-500">Position {query.position.toFixed(1)}</div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="text-right">
                  <div className="text-neutral-900 font-medium">{formatNumber(query.impressions)}</div>
                  <div className="text-xs text-neutral-500">impressions</div>
                </div>
                <div className="text-right">
                  <div className="text-neutral-900 font-medium">{formatNumber(query.clicks)}</div>
                  <div className="text-xs text-neutral-500">clicks</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Pages */}
      <div className="p-6 border-t border-neutral-200">
        <h4 className="text-sm font-semibold text-neutral-900 mb-4">Top Pages</h4>
        <div className="space-y-3">
          {metrics.topPages.map((page, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-neutral-900 truncate">{page.page}</div>
                <div className="text-xs text-neutral-500">CTR: {formatPercentage(page.ctr)}</div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="text-right">
                  <div className="text-neutral-900 font-medium">{formatNumber(page.impressions)}</div>
                  <div className="text-xs text-neutral-500">impressions</div>
                </div>
                <div className="text-right">
                  <div className="text-neutral-900 font-medium">{formatNumber(page.clicks)}</div>
                  <div className="text-xs text-neutral-500">clicks</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
