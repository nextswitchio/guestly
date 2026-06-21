'use client';
import { AlertTriangle, CheckCircle } from 'lucide-react';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import type { PromoCodeMetrics } from '@/lib/marketing';

interface PromoCodeStatsProps {
  promoCodeId: string;
}

export default function PromoCodeStats({ promoCodeId }: PromoCodeStatsProps) {
  const [metrics, setMetrics] = useState<PromoCodeMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, [promoCodeId]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/promo-codes/${promoCodeId}/stats`);
      if (response.ok) {
        const data = await response.json();
        setMetrics(data.metrics);
      }
    } catch (error) {
      console.error('Failed to fetch promo code stats:', error);
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
        No statistics available
      </div>
    );
  }

  const stats = [
    {
      label: 'Total Redemptions',
      value: metrics.totalRedemptions.toLocaleString(),
      icon: 'tag',
      color: 'text-blue-500',
    },
    {
      label: 'Total Revenue',
      value: `$${metrics.totalRevenue.toLocaleString()}`,
      icon: 'dollar-sign',
      color: 'text-green-500',
    },
    {
      label: 'Total Discount',
      value: `$${metrics.totalDiscount.toLocaleString()}`,
      icon: 'percent',
      color: 'text-orange-500',
    },
    {
      label: 'Conversion Rate',
      value: `${metrics.conversionRate.toFixed(2)}%`,
      icon: 'trending-up',
      color: 'text-purple-500',
    },
    {
      label: 'Avg Order Value',
      value: `$${metrics.averageOrderValue.toFixed(2)}`,
      icon: 'shopping-cart',
      color: 'text-teal-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-4">
            <div className="flex items-start justify-between mb-2">
              <p className="text-xs text-neutral-500">{stat.label}</p>
              <Icon name={stat.icon as any} className={`w-4 h-4 ${stat.color}`} />
            </div>
            <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
          </Card>
        ))}
      </div>

      {/* Performance Summary */}
      <Card className="p-4">
        <h4 className="font-semibold mb-3">Performance Summary</h4>
        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-neutral-500">Revenue Impact</span>
              <span className="font-medium text-green-500">
                +${(metrics.totalRevenue - metrics.totalDiscount).toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-neutral-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{
                  width: `${Math.min(
                    ((metrics.totalRevenue - metrics.totalDiscount) / metrics.totalRevenue) * 100,
                    100
                  )}%`,
                }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-neutral-500">Discount Given</span>
              <span className="font-medium text-orange-500">
                ${metrics.totalDiscount.toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-neutral-200 rounded-full h-2">
              <div
                className="bg-orange-500 h-2 rounded-full"
                style={{
                  width: `${Math.min((metrics.totalDiscount / metrics.totalRevenue) * 100, 100)}%`,
                }}
              />
            </div>
          </div>

          <div className="pt-3 border-t border-neutral-200">
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-500">Avg Discount per Order</span>
              <span className="font-medium">
                ${(metrics.totalDiscount / metrics.totalRedemptions || 0).toFixed(2)}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-500">Revenue per Redemption</span>
            <span className="font-medium">
              ${(metrics.totalRevenue / metrics.totalRedemptions || 0).toFixed(2)}
            </span>
          </div>
        </div>
      </Card>

      {/* Insights */}
        <Card className="p-4 bg-blue-100 border-blue-200">
        <div className="flex gap-3">
          <Icon name="info" className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">
              Performance Insights
            </h4>
            <ul className="text-sm text-blue-800 space-y-1">
              {metrics.conversionRate > 5 && (
                <li><CheckCircle className="h-4 w-4 inline-block" /> Strong conversion rate - this code is performing well</li>
              )}
              {metrics.averageOrderValue > 50 && (
                <li><CheckCircle className="h-4 w-4 inline-block" /> High average order value - attracting quality customers</li>
              )}
              {metrics.totalRedemptions > 100 && (
                <li><CheckCircle className="h-4 w-4 inline-block" /> Popular code - consider creating similar offers</li>
              )}
              {metrics.conversionRate < 2 && (
                <li>AlertTriangle Low conversion rate - consider adjusting the offer</li>
              )}
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
