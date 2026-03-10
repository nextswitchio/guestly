'use client';

import { useMemo } from 'react';
import { Icon } from '@/components/ui/Icon';

interface FunnelStage {
  stage: string;
  users: number;
  dropoffRate: number;
}

interface Props {
  stages: FunnelStage[];
}

export default function FunnelVisualization({ stages }: Props) {
  const maxUsers = useMemo(() => {
    return Math.max(...stages.map(s => s.users), 1);
  }, [stages]);

  const conversionRate = useMemo(() => {
    if (stages.length < 2) return 0;
    const firstStage = stages[0].users;
    const lastStage = stages[stages.length - 1].users;
    if (firstStage === 0) return 0;
    return (lastStage / firstStage) * 100;
  }, [stages]);

  const getStageIcon = (stage: string) => {
    const icons: Record<string, string> = {
      awareness: 'eye',
      interest: 'cursor-click',
      consideration: 'search',
      intent: 'shopping-cart',
      purchase: 'check-circle',
      visit: 'globe',
      'view event': 'ticket',
      'add to cart': 'shopping-bag',
      checkout: 'credit-card',
      complete: 'check',
    };
    return icons[stage.toLowerCase()] || 'arrow-right';
  };

  const getStageColor = (index: number, total: number) => {
    const colors = [
      'from-blue-500 to-blue-600',
      'from-indigo-500 to-indigo-600',
      'from-purple-500 to-purple-600',
      'from-pink-500 to-pink-600',
      'from-rose-500 to-rose-600',
    ];
    return colors[index % colors.length];
  };

  if (stages.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No funnel data available
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overall conversion rate */}
      <div className="p-4 bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg border border-primary-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">Overall Conversion Rate</p>
            <p className="text-3xl font-bold text-gray-900">{conversionRate.toFixed(2)}%</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600 mb-1">Total Users</p>
            <p className="text-2xl font-bold text-gray-900">{stages[0]?.users.toLocaleString() || 0}</p>
          </div>
        </div>
      </div>

      {/* Funnel visualization */}
      <div className="space-y-2">
        {stages.map((stage, index) => {
          const widthPercent = (stage.users / maxUsers) * 100;
          const prevUsers = index > 0 ? stages[index - 1].users : stage.users;
          const stageConversionRate = prevUsers > 0 ? (stage.users / prevUsers) * 100 : 100;

          return (
            <div key={stage.stage} className="space-y-1">
              {/* Stage header */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Icon name={getStageIcon(stage.stage)} className="w-4 h-4 text-gray-600" />
                  <span className="font-medium text-gray-900">{stage.stage}</span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-gray-600">{stage.users.toLocaleString()} users</span>
                  {index > 0 && (
                    <span className={`font-semibold ${stageConversionRate >= 50 ? 'text-success-600' : stageConversionRate >= 25 ? 'text-warning-600' : 'text-danger-600'}`}>
                      {stageConversionRate.toFixed(1)}%
                    </span>
                  )}
                </div>
              </div>

              {/* Funnel bar */}
              <div className="relative">
                <div className="h-12 bg-gray-100 rounded-lg overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${getStageColor(index, stages.length)} transition-all duration-500 flex items-center justify-between px-4`}
                    style={{ width: `${widthPercent}%` }}
                  >
                    <span className="text-white font-semibold text-sm">{stage.users.toLocaleString()}</span>
                    {stage.dropoffRate > 0 && (
                      <span className="text-white text-xs opacity-90">
                        -{stage.dropoffRate.toFixed(1)}% drop
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Drop-off indicator */}
              {index < stages.length - 1 && stage.dropoffRate > 0 && (
                <div className="flex items-center gap-2 pl-2 text-xs text-gray-500">
                  <Icon name="arrow-down" className="w-3 h-3" />
                  <span>{Math.round((prevUsers - stage.users))} users dropped off ({stage.dropoffRate.toFixed(1)}%)</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Funnel insights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {stages.map((stage, index) => {
          if (index === 0) return null;
          const prevUsers = stages[index - 1].users;
          const dropoff = prevUsers - stage.users;
          const dropoffPercent = prevUsers > 0 ? (dropoff / prevUsers) * 100 : 0;

          return (
            <div key={stage.stage} className={`p-3 rounded-lg border ${dropoffPercent > 50 ? 'bg-danger-50 border-danger-200' : dropoffPercent > 25 ? 'bg-warning-50 border-warning-200' : 'bg-success-50 border-success-200'}`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-gray-700">{stages[index - 1].stage} → {stage.stage}</span>
                <Icon 
                  name={dropoffPercent > 50 ? 'exclamation-circle' : dropoffPercent > 25 ? 'exclamation' : 'check-circle'} 
                  className={`w-4 h-4 ${dropoffPercent > 50 ? 'text-danger-600' : dropoffPercent > 25 ? 'text-warning-600' : 'text-success-600'}`} 
                />
              </div>
              <p className="text-xs text-gray-600">
                {dropoff.toLocaleString()} users lost ({dropoffPercent.toFixed(1)}%)
              </p>
            </div>
          );
        })}
      </div>

      {/* Optimization tips */}
      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-start gap-2">
          <Icon name="lightbulb" className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-blue-800">
            <p className="font-semibold mb-1">Optimization Tips</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>Focus on stages with highest drop-off rates</li>
              <li>A/B test improvements at critical conversion points</li>
              <li>Industry average conversion rate is 2-5%</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
