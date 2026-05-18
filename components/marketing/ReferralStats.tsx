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
      color: 'text-success-500',
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
              <p className="text-xs text-gray-600 dark:text-gray-400">{metric.label}</p>
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
              <span className="text-sm text-gray-600 dark:text-gray-400">Total Earned</span>
              <span className="text-lg font-bold text-green-500">
                ${stats.totalEarned.toFixed(2)}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
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
              <span className="text-sm text-gray-600 dark:text-gray-400">Pending Rewards</span>
              <span className="text-lg font-bold text-warning-500">
                ${stats.pendingRewards.toFixed(2)}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div
                className="bg-warning-500 h-3 rounded-full"
                style={{
                  width: `${Math.min(
                    (stats.pendingRewards / (stats.totalEarned + stats.pendingRewards)) * 100,
                    100
                  )}%`,
                }}
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
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
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium">Event #{event.eventId}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
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
      <Card className="p-4 bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20">
        <div className="flex gap-3">
          <Icon name="lightbulb" className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold mb-2">Performance Insights</h4>
            <ul className="text-sm space-y-1">
              {stats.conversionRate > 5 && (
                <li className="text-success-600 dark:text-success-400">
                 <Check className="h-4 w-4 inline" /> Excellent conversion rate - your referrals are highly effective
                </li>
              )}
              {stats.totalConversions > 10 && (
                <li className="text-success-600 dark:text-success-400">
                 <Check className="h-4 w-4 inline" /> Great job! You've referred {stats.totalConversions} successful purchases
                </li>
              )}
              {stats.conversionRate < 2 && stats.totalClicks > 20 && (
                <li className="text-warning-600 dark:text-warning-400">
                  AlertTriangle Consider personalizing your referral messages to improve conversion
                </li>
              )}
              {stats.totalClicks === 0 && (
                <li className="text-blue-600 dark:text-blue-400 flex items-center gap-2">
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
