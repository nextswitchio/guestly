'use client';
import { AlertTriangle, Check } from 'lucide-react';

import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import type { ReferralStats as Stats } from '@/lib/marketing';

interface ReferralStatsProps {
  stats: Stats;
}

export default function ReferralStats({ stats }: ReferralStatsProps) {
  const metrics = [
    {
      label: 'Total Clicks',
      value: stats.totalClicks.toLocaleString(),
      icon: 'mouse-pointer',
      color: 'text-blue-500',
    },
    {
      label: 'Total Referrals',
      value: stats.totalReferrals.toLocaleString(),
      icon: 'users',
      color: 'text-purple-500',
    },
    {
      label: 'Conversions',
      value: stats.totalConversions.toLocaleString(),
      icon: 'check-circle',
      color: 'text-green-500',
    },
    {
      label: 'Conversion Rate',
      value: `${stats.conversionRate.toFixed(2)}%`,
      icon: 'trending-up',
      color: 'text-teal-500',
    },
    {
      label: 'Total Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: 'dollar-sign',
      color: 'text-green-600',
    },
    {
      label: 'Total Earned',
      value: `$${stats.totalEarned.toFixed(2)}`,
      icon: 'award',
      color: 'text-green-500',
    },
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Performance Metrics</h3>

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

      {/* Earnings Breakdown */}
      <Card className="p-6">
        <h4 className="font-semibold mb-4">Earnings Breakdown</h4>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-neutral-500">Total Earned</span>
              <span className="text-lg font-bold text-green-500">
                ${stats.totalEarned.toFixed(2)}
              </span>
            </div>
            <div className="w-full bg-neutral-200 rounded-full h-3">
              <div
                className="bg-green-500 h-3 rounded-full"
                style={{
                  width: `${Math.min(
                    (stats.totalEarned / (stats.totalEarned + stats.pendingRewards)) * 100,
                    100
                  )}%`,
                }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-neutral-500">Pending Rewards</span>
              <span className="text-lg font-bold text-amber-500">
                ${stats.pendingRewards.toFixed(2)}
              </span>
            </div>
            <div className="w-full bg-neutral-200 rounded-full h-3">
              <div
                className="bg-amber-500 h-3 rounded-full"
                style={{
                  width: `${Math.min(
                    (stats.pendingRewards / (stats.totalEarned + stats.pendingRewards)) * 100,
                    100
                  )}%`,
                }}
              />
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-500">
                Average Earning per Conversion
              </span>
              <span className="font-medium">
                ${(stats.totalEarned / stats.totalConversions || 0).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Top Events */}
      {stats.topEvents && stats.topEvents.length > 0 && (
        <Card className="p-6">
          <h4 className="font-semibold mb-4">Top Performing Events</h4>
          <div className="space-y-3">
            {stats.topEvents.slice(0, 5).map((event, index) => (
              <div
                key={event.eventId}
                className="flex items-center justify-between p-3 bg-neutral-50 rounded-2xl"
              >
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-lime/10 text-lime font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium">Event #{event.eventId}</p>
                    <p className="text-sm text-neutral-500">
                      {event.conversions} conversions
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-500">${event.earned.toFixed(2)}</p>
                  <p className="text-xs text-gray-500">earned</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Performance Insights */}
        <Card className="p-4 bg-gradient-to-r from-lime/10 to-blue-50">
        <div className="flex gap-3">
          <Icon name="lightbulb" className="w-5 h-5 text-lime flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold mb-2">Performance Insights</h4>
            <ul className="text-sm space-y-1">
              {stats.conversionRate > 5 && (
                <li className="text-green-700">
                 <Check className="h-4 w-4 inline" /> Excellent conversion rate - your referrals are highly effective
                </li>
              )}
              {stats.totalConversions > 10 && (
                <li className="text-green-700">
                 <Check className="h-4 w-4 inline" /> Great job! You've referred {stats.totalConversions} successful purchases
                </li>
              )}
              {stats.conversionRate < 2 && stats.totalClicks > 20 && (
                <li className="text-amber-700">
                  AlertTriangle Consider personalizing your referral messages to improve conversion
                </li>
              )}
              {stats.totalClicks === 0 && (
                <li className="text-blue-700 flex items-center gap-2">
                  <Icon name="lightbulb" className="w-4 h-4" />
                  Start sharing your referral links to earn rewards
                </li>
              )}
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
