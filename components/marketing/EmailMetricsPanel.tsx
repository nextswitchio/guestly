'use client';
import { AlertTriangle, Check } from 'lucide-react';

import { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Icon from '@/components/ui/Icon';
import type { EmailMetrics } from '@/lib/marketing';

interface EmailMetricsPanelProps {
  campaignId: string;
  refreshInterval?: number;
}

export default function EmailMetricsPanel({
  campaignId,
  refreshInterval = 30000,
}: EmailMetricsPanelProps) {
  const [metrics, setMetrics] = useState<EmailMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, refreshInterval);
    return () => clearInterval(interval);
  }, [campaignId, refreshInterval]);

  const fetchMetrics = async () => {
    try {
      const response = await fetch(`/api/email/campaigns/${campaignId}/metrics`);
      if (response.ok) {
        const data = await response.json();
        setMetrics(data);
      }
    } catch (error) {
      console.error('Failed to fetch email metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
        <div className="flex items-center justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-lime border-t-lime"></div>
        </div>
    );
  }

  if (!metrics) {
    return (
      <div className="text-center py-8 text-neutral-500">
        No metrics available
      </div>
    );
  }

  const keyMetrics = [
    {
      label: 'Sent',
      value: metrics.sent.toLocaleString(),
      icon: 'upload' as const,
      color: 'text-blue-500',
    },
    {
      label: 'Delivered',
      value: metrics.delivered.toLocaleString(),
      icon: 'check' as const,
      color: 'text-green-500',
    },
    {
      label: 'Opened',
      value: metrics.opened.toLocaleString(),
      icon: 'document' as const,
      color: 'text-purple-500',
    },
    {
      label: 'Open Rate',
      value: `${metrics.openRate.toFixed(2)}%`,
      icon: 'chart' as const,
      color: 'text-teal-500',
    },
    {
      label: 'Clicked',
      value: metrics.clicked.toLocaleString(),
      icon: 'target' as const,
      color: 'text-indigo-500',
    },
    {
      label: 'Click Rate',
      value: `${metrics.clickRate.toFixed(2)}%`,
      icon: 'trending-up' as const,
      color: 'text-cyan-500',
    },
    {
      label: 'Conversions',
      value: `${metrics.conversionRate.toFixed(2)}%`,
      icon: 'trophy' as const,
      color: 'text-green-500',
    },
    {
      label: 'Revenue',
      value: `${metrics.revenue.toLocaleString()}`,
      icon: 'money' as const,
      color: 'text-green-600',
    },
  ];

  const deliveryMetrics = [
    {
      label: 'Bounced',
      value: metrics.bounced.toLocaleString(),
      icon: 'arrow-left' as const,
      color: 'text-orange-500',
    },
    {
      label: 'Spam',
      value: metrics.spam.toLocaleString(),
      icon: 'shield' as const,
      color: 'text-red-500',
    },
    {
      label: 'Unsubscribed',
      value: metrics.unsubscribed.toLocaleString(),
      icon: 'user' as const,
      color: 'text-gray-500',
    },
  ];

  const deliveryRate = metrics.sent > 0 ? (metrics.delivered / metrics.sent) * 100 : 0;
  const bounceRate = metrics.sent > 0 ? (metrics.bounced / metrics.sent) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Email Campaign Metrics</h3>
        <div className="flex items-center gap-2 text-sm text-neutral-500">
          <Icon name="clock" className="w-4 h-4" />
          <span>Auto-refreshing</span>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {keyMetrics.map((metric) => (
          <Card key={metric.label} className="p-4">
            <div className="flex items-start justify-between mb-2">
              <p className="text-xs text-neutral-500">{metric.label}</p>
              <Icon name={metric.icon} className={`w-4 h-4 ${metric.color}`} />
            </div>
            <p className={`text-xl font-bold ${metric.color}`}>{metric.value}</p>
          </Card>
        ))}
      </div>

      {/* Performance Visualization */}
      <Card className="p-6">
        <h4 className="font-semibold mb-4">Performance Overview</h4>
        <div className="space-y-4">
          {/* Open Rate Visualization */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-neutral-500">Open Rate</span>
              <span className="text-lg font-bold text-purple-500">
                {metrics.openRate.toFixed(2)}%
              </span>
            </div>
            <div className="w-full bg-neutral-200 rounded-full h-3">
              <div
                className="bg-purple-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(metrics.openRate, 100)}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {metrics.opened} of {metrics.delivered} delivered emails opened
            </p>
          </div>

          {/* Click Rate Visualization */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-neutral-500">Click Rate</span>
              <span className="text-lg font-bold text-indigo-500">
                {metrics.clickRate.toFixed(2)}%
              </span>
            </div>
            <div className="w-full bg-neutral-200 rounded-full h-3">
              <div
                className="bg-indigo-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(metrics.clickRate, 100)}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {metrics.clicked} of {metrics.opened} opened emails clicked
            </p>
          </div>

          {/* Conversion Rate Visualization */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-neutral-500">Conversion Rate</span>
              <span className="text-lg font-bold text-green-500">
                {metrics.conversionRate.toFixed(2)}%
              </span>
            </div>
            <div className="w-full bg-neutral-200 rounded-full h-3">
              <div
                className="bg-green-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(metrics.conversionRate, 100)}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Percentage of recipients who completed desired action
            </p>
          </div>

          {/* Delivery Rate */}
          <div className="pt-3 border-t border-neutral-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-neutral-500">Delivery Rate</span>
              <span className="text-lg font-bold text-green-500">
                {deliveryRate.toFixed(2)}%
              </span>
            </div>
            <div className="w-full bg-neutral-200 rounded-full h-3">
              <div
                className="bg-green-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(deliveryRate, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Delivery Issues */}
      <Card className="p-6">
        <h4 className="font-semibold mb-4">Delivery Status</h4>
        <div className="grid grid-cols-3 gap-4">
          {deliveryMetrics.map((metric) => (
            <div key={metric.label} className="text-center">
              <Icon name={metric.icon} className={`w-6 h-6 ${metric.color} mx-auto mb-2`} />
              <p className={`text-2xl font-bold ${metric.color}`}>{metric.value}</p>
              <p className="text-xs text-neutral-500 mt-1">{metric.label}</p>
            </div>
          ))}
        </div>
        {bounceRate > 5 && (
          <div className="mt-4 p-3 bg-amber-100 border border-amber-200 rounded-lg">
            <div className="flex gap-2">
              <Icon name="shield" className="w-5 h-5 text-amber-500 flex-shrink-0" />
              <p className="text-sm text-amber-800">
                High bounce rate detected ({bounceRate.toFixed(1)}%). Consider cleaning your email list.
              </p>
            </div>
          </div>
        )}
      </Card>

      {/* Engagement Summary */}
      <Card className="p-6">
        <h4 className="font-semibold mb-4">Engagement Summary</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-500">Click-to-Open Rate</span>
            <span className="font-medium">
              {metrics.opened > 0
                ? ((metrics.clicked / metrics.opened) * 100).toFixed(2)
                : '0.00'}%
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-500">Revenue per Email</span>
            <span className="font-medium">
              ${metrics.sent > 0 ? (metrics.revenue / metrics.sent).toFixed(2) : '0.00'}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-500">Revenue per Click</span>
            <span className="font-medium">
              ${metrics.clicked > 0 ? (metrics.revenue / metrics.clicked).toFixed(2) : '0.00'}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-500">Revenue per Conversion</span>
            <span className="font-medium">
              ${metrics.conversionRate > 0
                ? (metrics.revenue / (metrics.sent * (metrics.conversionRate / 100))).toFixed(2)
                : '0.00'}
            </span>
          </div>
        </div>
      </Card>

      {/* Performance Insights */}
        <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex gap-3">
          <Icon name="lightbulb" className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold mb-2">Performance Insights</h4>
            <ul className="text-sm space-y-1">
              {metrics.openRate > 20 && (
                <li className="text-green-700">
                 <Check className="h-4 w-4 inline" /> Excellent open rate - your subject line is working well
                </li>
              )}
              {metrics.openRate < 15 && metrics.sent > 100 && (
                <li className="text-amber-700">
                  AlertTriangle Low open rate - consider testing different subject lines
                </li>
              )}
              {metrics.clickRate > 3 && (
                <li className="text-green-700">
                 <Check className="h-4 w-4 inline" /> Strong click rate - your content is engaging
                </li>
              )}
              {metrics.clickRate < 1 && metrics.opened > 50 && (
                <li className="text-amber-700">
                  AlertTriangle Low click rate - consider improving your call-to-action
                </li>
              )}
              {metrics.conversionRate > 2 && (
                <li className="text-green-700">
                 <Check className="h-4 w-4 inline" /> Great conversion rate - your campaign is driving results
                </li>
              )}
              {bounceRate > 5 && (
                <li className="text-red-700">
                  AlertTriangle High bounce rate - clean your email list to improve deliverability
                </li>
              )}
              {metrics.spam > 0 && (
                <li className="text-red-700">
                  AlertTriangle Spam complaints detected - review your content and sending practices
                </li>
              )}
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
