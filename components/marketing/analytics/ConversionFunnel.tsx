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
  title?: string;
  showInsights?: boolean;
}

export default function ConversionFunnel({ stages, title = 'Conversion Funnel', showInsights = true }: Props) {
  const maxUsers = useMemo(() => {
    return Math.max(...stages.map(s => s.users), 1);
  }, [stages]);

  const overallConversionRate = useMemo(() => {
    if (stages.length < 2) return 0;
    const firstStage = stages[0].users;
    const lastStage = stages[stages.length - 1].users;
    if (firstStage === 0) return 0;
    return (lastStage / firstStage) * 100;
  }, [stages]);

  const biggestDropoff = useMemo(() => {
    if (stages.length < 2) return null;
    let maxDropoff = 0;
    let maxDropoffStage = '';
    
    for (let i = 1; i < stages.length; i++) {
      if (stages[i].dropoffRate > maxDropoff) {
        maxDropoff = stages[i].dropoffRate;
        maxDropoffStage = `${stages[i - 1].stage}<ArrowRight className="h-4 w-4 inline" /> ${stages[i].stage}`;
      }
    }
    
    return { rate: maxDropoff, stage: maxDropoffStage };
  }, [stages]);

  if (stages.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No funnel data available
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-gray-900">{title}</h4>
        <div className="text-right">
          <p className="text-xs text-gray-600">Overall Conversion</p>
          <p className="text-lg font-bold text-gray-900">{overallConversionRate.toFixed(2)}%</p>
        </div>
      </div>

      {/* Funnel stages */}
      <div className="space-y-1">
        {stages.map((stage, index) => {
          const widthPercent = (stage.users / maxUsers) * 100;
          const prevUsers = index > 0 ? stages[index - 1].users : stage.users;
          const stageConversionRate = prevUsers > 0 ? (stage.users / prevUsers) * 100 : 100;

          return (
            <div key={stage.stage}>
              {/* Stage bar */}
              <div className="relative group">
                <div className="h-14 bg-gray-100 rounded-lg overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 flex items-center justify-between px-4 ${
                      index === 0
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600'
                        : index === stages.length - 1
                        ? 'bg-gradient-to-r from-green-500 to-green-600'
                        : 'bg-gradient-to-r from-purple-500 to-purple-600'
                    }`}
                    style={{ width: `${widthPercent}%` }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-white font-semibold text-sm">{stage.stage}</span>
                      {index > 0 && (
                        <span className="text-white text-xs opacity-90">
                          ({stageConversionRate.toFixed(1)}%)
                        </span>
                      )}
                    </div>
                    <span className="text-white font-bold">{stage.users.toLocaleString()}</span>
                  </div>
                </div>

                {/* Tooltip on hover */}
                <div className="absolute left-0 right-0 top-full mt-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  <div className="bg-gray-900 text-white text-xs rounded px-3 py-2 shadow-lg">
                    <p className="font-semibold mb-1">{stage.stage}</p>
                    <p>{stage.users.toLocaleString()} users</p>
                    {index > 0 && (
                      <p className="mt-1">
                        {stageConversionRate.toFixed(2)}% from previous stage
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Drop-off indicator */}
              {index < stages.length - 1 && stage.dropoffRate > 0 && (
                <div className="flex items-center gap-2 py-1 px-2">
                  <Icon name="arrow-down" className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-500">
                    {Math.round((prevUsers - stage.users))} users dropped ({stage.dropoffRate.toFixed(1)}%)
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Insights */}
      {showInsights && biggestDropoff && (
        <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <div className="flex items-start gap-2">
            <Icon name="exclamation" className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-semibold text-yellow-900 mb-1">Biggest Drop-off Point</p>
              <p className="text-yellow-800">
                <span className="font-medium">{biggestDropoff.rate.toFixed(1)}%</span> of users drop off at{' '}
                <span className="font-medium">{biggestDropoff.stage}</span>
              </p>
              <p className="text-xs text-yellow-700 mt-2">
                Focus optimization efforts on this stage to improve overall conversion rate.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
