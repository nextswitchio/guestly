'use client';
import { ArrowRight } from 'lucide-react';

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
  const safeStages = stages ?? [];

  const maxUsers = useMemo(() => {
    return Math.max(...safeStages.map(s => s.users), 1);
  }, [safeStages]);

  const conversionRate = useMemo(() => {
    if (safeStages.length < 2) return 0;
    const firstStage = safeStages[0].users;
    const lastStage = safeStages[safeStages.length - 1].users;
    if (firstStage === 0) return 0;
    return (lastStage / firstStage) * 100;
  }, [safeStages]);

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

  if (safeStages.length === 0) {
    return (
      <div className="text-center py-12 text-neutral-500">
        No funnel data available
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overall conversion rate */}
      <div className="p-4 bg-gradient-to-br from-lime-50 to-lime-100 rounded-lg border border-lime-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-neutral-500 mb-1">Overall Conversion Rate</p>
            <p className="text-3xl font-bold text-neutral-900">{conversionRate.toFixed(2)}%</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-neutral-500 mb-1">Total Users</p>
            <p className="text-2xl font-bold text-neutral-900">{safeStages[0]?.users.toLocaleString() || 0}</p>
          </div>
        </div>
      </div>

      {/* Funnel visualization */}
      <div className="space-y-2">
        {safeStages.map((stage, index) => {
          const widthPercent = (stage.users / maxUsers) * 100;
          const prevUsers = index > 0 ? safeStages[index - 1].users : stage.users;
          const stageConversionRate = prevUsers > 0 ? (stage.users / prevUsers) * 100 : 100;

          return (
            <div key={stage.stage} className="space-y-1">
              {/* Stage header */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Icon name={getStageIcon(stage.stage) as any} className="w-4 h-4 text-neutral-500" />
                  <span className="font-medium text-neutral-900">{stage.stage}</span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-neutral-500">{stage.users.toLocaleString()} users</span>
                  {index > 0 && (
                    <span className={`font-semibold ${stageConversionRate >= 50 ? 'text-green-700' : stageConversionRate >= 25 ? 'text-amber-700' : 'text-red-700'}`}>
                      {stageConversionRate.toFixed(1)}%
                    </span>
                  )}
                </div>
              </div>

              {/* Funnel bar */}
              <div className="relative">
                <div className="h-12 bg-neutral-50 rounded-lg overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${getStageColor(index, safeStages.length)} transition-all duration-500 flex items-center justify-between px-4`}
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
              {index < safeStages.length - 1 && stage.dropoffRate > 0 && (
                <div className="flex items-center gap-2 pl-2 text-xs text-neutral-500">
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
        {safeStages.map((stage, index) => {
          if (index === 0) return null;
          const prevUsers = safeStages[index - 1].users;
          const dropoff = prevUsers - stage.users;
          const dropoffPercent = prevUsers > 0 ? (dropoff / prevUsers) * 100 : 0;

          return (
            <div key={stage.stage} className={`p-3 rounded-lg border ${dropoffPercent > 50 ? 'bg-red-100 border-red-200' : dropoffPercent > 25 ? 'bg-amber-100 border-amber-200' : 'bg-green-100 border-green-200'}`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-neutral-900">{safeStages[index - 1].stage}<ArrowRight className="h-4 w-4 inline" /> {stage.stage}</span>
                <Icon 
                  name={dropoffPercent > 50 ? 'exclamation-circle' : dropoffPercent > 25 ? 'exclamation' : 'check-circle'} 
                  className={`w-4 h-4 ${dropoffPercent > 50 ? 'text-red-700' : dropoffPercent > 25 ? 'text-amber-700' : 'text-green-700'}`} 
                />
              </div>
              <p className="text-xs text-neutral-500">
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
