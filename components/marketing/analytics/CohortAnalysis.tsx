'use client';

import { useMemo } from 'react';
import { Icon } from '@/components/ui/Icon';

interface CohortData {
  cohortName: string;
  cohortDate: string;
  initialSize: number;
  periods: CohortPeriod[];
}

interface CohortPeriod {
  period: number;
  activeUsers: number;
  retentionRate: number;
  revenue: number;
  ltv: number;
}

interface Props {
  cohorts: CohortData[];
  periodLabel?: string;
}

export default function CohortAnalysis({ cohorts, periodLabel = 'Month' }: Props) {
  const maxPeriods = useMemo(() => {
    return Math.max(...cohorts.map(c => c.periods.length), 0);
  }, [cohorts]);

  const averageRetention = useMemo(() => {
    if (cohorts.length === 0) return [];
    const periodAverages: number[] = [];
    
    for (let i = 0; i < maxPeriods; i++) {
      const rates = cohorts
        .filter(c => c.periods[i])
        .map(c => c.periods[i].retentionRate);
      
      if (rates.length > 0) {
        periodAverages.push(rates.reduce((a, b) => a + b, 0) / rates.length);
      }
    }
    
    return periodAverages;
  }, [cohorts, maxPeriods]);

  const getRetentionColor = (rate: number) => {
    if (rate >= 80) return 'bg-green-600';
    if (rate >= 60) return 'bg-green-500';
    if (rate >= 40) return 'bg-yellow-500';
    if (rate >= 20) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getRetentionTextColor = (rate: number) => {
    if (rate >= 80) return 'text-green-700';
    if (rate >= 60) return 'text-green-600';
    if (rate >= 40) return 'text-yellow-700';
    if (rate >= 20) return 'text-orange-600';
    return 'text-red-600';
  };

  if (cohorts.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No cohort data available
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-900 font-medium mb-1">Total Cohorts</p>
          <p className="text-2xl font-bold text-blue-900">{cohorts.length}</p>
        </div>
        <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
          <p className="text-sm text-purple-900 font-medium mb-1">Avg {periodLabel} 1 Retention</p>
          <p className="text-2xl font-bold text-purple-900">
            {averageRetention[0] ? averageRetention[0].toFixed(1) : 0}%
          </p>
        </div>
        <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
          <p className="text-sm text-green-900 font-medium mb-1">Avg {periodLabel} 3 Retention</p>
          <p className="text-2xl font-bold text-green-900">
            {averageRetention[2] ? averageRetention[2].toFixed(1) : 0}%
          </p>
        </div>
        <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200">
          <p className="text-sm text-orange-900 font-medium mb-1">Avg LTV</p>
          <p className="text-2xl font-bold text-orange-900">
            ${cohorts.reduce((sum, c) => sum + (c.periods[c.periods.length - 1]?.ltv || 0), 0) / cohorts.length || 0}
          </p>
        </div>
      </div>

      {/* Cohort retention heatmap */}
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left py-3 px-3 font-semibold text-gray-700 sticky left-0 bg-gray-50 z-10">
                    Cohort
                  </th>
                  <th className="text-right py-3 px-3 font-semibold text-gray-700">Size</th>
                  {Array.from({ length: maxPeriods }, (_, i) => (
                    <th key={i} className="text-center py-3 px-3 font-semibold text-gray-700">
                      {periodLabel} {i}
                    </th>
                  ))}
                  <th className="text-right py-3 px-3 font-semibold text-gray-700">LTV</th>
                </tr>
              </thead>
              <tbody>
                {cohorts.map((cohort) => (
                  <tr key={cohort.cohortName} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-3 font-medium text-gray-900 sticky left-0 bg-white hover:bg-gray-50 z-10">
                      <div>
                        <p className="font-semibold">{cohort.cohortName}</p>
                        <p className="text-gray-500">{cohort.cohortDate}</p>
                      </div>
                    </td>
                    <td className="text-right py-3 px-3 text-gray-700">
                      {cohort.initialSize.toLocaleString()}
                    </td>
                    {Array.from({ length: maxPeriods }, (_, i) => {
                      const period = cohort.periods[i];
                      if (!period) {
                        return <td key={i} className="py-3 px-3 bg-gray-50"></td>;
                      }
                      return (
                        <td key={i} className="py-3 px-3">
                          <div className="flex flex-col items-center gap-1">
                            <div
                              className={`w-full h-8 ${getRetentionColor(period.retentionRate)} rounded flex items-center justify-center`}
                            >
                              <span className="text-white font-semibold text-xs">
                                {period.retentionRate.toFixed(0)}%
                              </span>
                            </div>
                            <span className="text-gray-500 text-xs">
                              {period.activeUsers.toLocaleString()}
                            </span>
                          </div>
                        </td>
                      );
                    })}
                    <td className="text-right py-3 px-3 font-semibold text-gray-900">
                      ${cohort.periods[cohort.periods.length - 1]?.ltv.toFixed(2) || '0.00'}
                    </td>
                  </tr>
                ))}
              </tbody>
              {averageRetention.length > 0 && (
                <tfoot>
                  <tr className="bg-gray-100 border-t-2 border-gray-300 font-semibold">
                    <td className="py-3 px-3 text-gray-900 sticky left-0 bg-gray-100 z-10">Average</td>
                    <td className="text-right py-3 px-3 text-gray-900">
                      {Math.round(cohorts.reduce((sum, c) => sum + c.initialSize, 0) / cohorts.length).toLocaleString()}
                    </td>
                    {averageRetention.map((avg, i) => (
                      <td key={i} className="text-center py-3 px-3">
                        <span className={`font-bold ${getRetentionTextColor(avg)}`}>
                          {avg.toFixed(1)}%
                        </span>
                      </td>
                    ))}
                    <td className="text-right py-3 px-3 text-gray-900">
                      ${(cohorts.reduce((sum, c) => sum + (c.periods[c.periods.length - 1]?.ltv || 0), 0) / cohorts.length).toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>
      </div>

      {/* Retention curve chart */}
      <div className="p-5 bg-white border border-gray-200 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-4">Average Retention Curve</h4>
        <div className="space-y-2">
          {averageRetention.map((rate, index) => (
            <div key={index} className="flex items-center gap-3">
              <span className="text-sm text-gray-600 w-20">{periodLabel} {index}</span>
              <div className="flex-1 h-8 bg-gray-100 rounded-lg overflow-hidden">
                <div
                  className={`h-full ${getRetentionColor(rate)} transition-all duration-500 flex items-center justify-end px-3`}
                  style={{ width: `${rate}%` }}
                >
                  <span className="text-white font-semibold text-sm">{rate.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend and insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start gap-2">
            <Icon name="information-circle" className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">Retention Color Scale</p>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-600 rounded"></div>
                  <span>80%+ Excellent</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span>60-79% Good</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                  <span>40-59% Average</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-orange-500 rounded"></div>
                  <span>20-39% Poor</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span>&lt;20% Critical</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-start gap-2">
            <Icon name="lightbulb" className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-green-800">
              <p className="font-semibold mb-1">Key Insights</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>Track retention to measure product-market fit</li>
                <li>Higher LTV justifies higher acquisition costs</li>
                <li>Focus on improving early-period retention</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
