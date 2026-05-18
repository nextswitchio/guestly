'use client';
import { AlertTriangle, Check, Lightbulb, RefreshCw } from 'lucide-react';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';

interface PerformanceData {
  totalClicks: number;
  totalConversions: number;
  totalRevenue: number;
  totalEarnings: number;
  conversionRate: number;
  averageOrderValue: number;
  clicksByDate: Array<{ date: string; clicks: number }>;
  conversionsByDate: Array<{ date: string; conversions: number }>;
  topEvents: Array<{
    eventId: string;
    eventName: string;
    clicks: number;
    conversions: number;
    revenue: number;
    earnings: number;
  }>;
}

interface AffiliatePerformanceProps {
  affiliateId: string;
}

export default function AffiliatePerformance({ affiliateId }: AffiliatePerformanceProps) {
  const [data, setData] = useState<PerformanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');

  useEffect(() => {
    fetchPerformance();
  }, [affiliateId, timeRange]);

  const fetchPerformance = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/affiliates/${affiliateId}/performance?range=${timeRange}`
      );
      if (response.ok) {
        const result = await response.json();
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
      <div className="flex items-center justify-center py-8">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-lime border-t-lime" />
      </div>
    );
  }

  if (!data) {
    return (
      <Card className="p-8 text-center">
        <Icon name="bar-chart" className="w-12 h-12 mx-auto text-neutral-400 mb-2" />
        <p className="text-neutral-500">No performance data available</p>
      </Card>
    );
  }

  const metrics = [
    {
      label: 'Total Clicks',
      value: data.totalClicks.toLocaleString(),
      icon: 'mouse-pointer',
      color: 'text-blue-500',
    },
    {
      label: 'Conversions',
      value: data.totalConversions.toLocaleString(),
      icon: 'check-circle',
      color: 'text-green-600',
    },
    {
      label: 'Conversion Rate',
      value: `${data.conversionRate.toFixed(2)}%`,
      icon: 'trending-up',
      color: 'text-purple-500',
    },
    {
      label: 'Total Revenue',
      value: `$${data.totalRevenue.toLocaleString()}`,
      icon: 'dollar-sign',
      color: 'text-green-600',
    },
    {
      label: 'Total Earnings',
      value: `$${data.totalEarnings.toFixed(2)}`,
      icon: 'award',
      color: 'text-green-500',
    },
    {
      label: 'Avg Order Value',
      value: `$${data.averageOrderValue.toFixed(2)}`,
      icon: 'shopping-cart',
      color: 'text-teal-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Performance Metrics</h3>
        <div className="flex gap-2">
          {[
            { value: '7d', label: '7 Days' },
            { value: '30d', label: '30 Days' },
            { value: '90d', label: '90 Days' },
            { value: 'all', label: 'All Time' },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setTimeRange(option.value as typeof timeRange)}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                timeRange === option.value
                  ? 'bg-lime text-dark'
                  : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {metrics.map((metric) => (
          <Card key={metric.label} className="p-4">
            <div className="flex items-start justify-between mb-2">
              <p className="text-xs text-neutral-500">{metric.label}</p>
              <Icon name={metric.icon as any} className={`w-4 h-4 ${metric.color}`} />
            </div>
            <p className={`text-xl font-bold ${metric.color}`}>{metric.value}</p>
          </Card>
        ))}
      </div>

      {/* Performance Summary */}
      <Card className="p-6">
        <h4 className="font-semibold mb-4">Performance Summary</h4>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-neutral-500">Click-to-Conversion Rate</span>
              <span className="font-medium">{data.conversionRate.toFixed(2)}%</span>
            </div>
            <div className="w-full bg-neutral-200 rounded-full h-2">
              <div
                className="bg-lime h-2 rounded-full"
                style={{ width: `${Math.min(data.conversionRate, 100)}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-200">
            <div>
              <p className="text-sm text-neutral-500 mb-1">
                Earnings per Click
              </p>
              <p className="text-lg font-bold text-green-500">
                ${(data.totalEarnings / data.totalClicks || 0).toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-neutral-500 mb-1">
                Earnings per Conversion
              </p>
              <p className="text-lg font-bold text-green-500">
                ${(data.totalEarnings / data.totalConversions || 0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Top Events */}
      {data.topEvents && data.topEvents.length > 0 && (
        <Card className="p-6">
          <h4 className="font-semibold mb-4">Top Performing Events</h4>
          <div className="space-y-3">
            {data.topEvents.slice(0, 5).map((event, index) => (
              <div
                key={event.eventId}
                className="flex items-center justify-between p-4 bg-neutral-50 rounded-2xl"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-lime/10 text-lime font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{event.eventName || `Event #${event.eventId}`}</p>
                    <div className="flex gap-4 text-sm text-neutral-500 mt-1">
                      <span>{event.clicks} clicks</span>
                      <span>{event.conversions} conversions</span>
                      <span>
                        {((event.conversions / event.clicks) * 100 || 0).toFixed(1)}% CVR
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-500">${event.earnings.toFixed(2)}</p>
                  <p className="text-xs text-neutral-500">earned</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Insights */}
      <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex gap-3">
          <Icon name="lightbulb" className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold mb-2">Performance Insights</h4>
            <ul className="text-sm space-y-1">
              {data.conversionRate > 5 && (
                <li className="text-green-600">
                 <Check className="h-4 w-4 inline" /> Excellent conversion rate - your promotional strategy is working well
                </li>
              )}
              {data.totalConversions > 50 && (
                <li className="text-green-600">
                 <Check className="h-4 w-4 inline" /> Strong performance with {data.totalConversions} conversions
                </li>
              )}
              {data.averageOrderValue > 100 && (
                <li className="text-green-600">
                 <Check className="h-4 w-4 inline" /> High average order value - attracting quality customers
                </li>
              )}
              {data.conversionRate < 2 && data.totalClicks > 100 && (
                <li className="text-amber-600">
                  <AlertTriangle className="h-4 w-4 inline" /> Consider optimizing your promotional content to improve conversion rate
                </li>
              )}
              {data.totalClicks < 50 && (
                <li className="text-blue-600">
                 <Lightbulb className="h-4 w-4 inline" /> Increase your promotional efforts to drive more traffic
                </li>
              )}
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
