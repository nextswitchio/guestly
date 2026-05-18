'use client';

import { useMemo } from 'react';
import { Icon } from '@/components/ui/Icon';

interface ChannelPerformance {
  channel: string;
  conversions: number;
  revenue: number;
  cost: number;
  roi: number;
  cac: number;
}

interface Props {
  channels: ChannelPerformance[];
}

export default function ROICalculator({ channels }: Props) {
  const sortedChannels = useMemo(() => {
    return [...channels].sort((a, b) => b.roi - a.roi);
  }, [channels]);

  const totals = useMemo(() => {
    return channels.reduce(
      (acc, channel) => ({
        revenue: acc.revenue + channel.revenue,
        cost: acc.cost + channel.cost,
        conversions: acc.conversions + channel.conversions,
      }),
      { revenue: 0, cost: 0, conversions: 0 }
    );
  }, [channels]);

  const overallROI = useMemo(() => {
    if (totals.cost === 0) return 0;
    return ((totals.revenue - totals.cost) / totals.cost) * 100;
  }, [totals]);

  const averageCAC = useMemo(() => {
    if (totals.conversions === 0) return 0;
    return totals.cost / totals.conversions;
  }, [totals]);

  const getROIColor = (roi: number) => {
    if (roi >= 200) return 'text-success-700 bg-success-100';
    if (roi >= 100) return 'text-success-600 bg-success-50';
    if (roi >= 0) return 'text-warning-600 bg-warning-50';
    return 'text-danger-600 bg-danger-50';
  };

  const getROILabel = (roi: number) => {
    if (roi >= 200) return 'Excellent';
    if (roi >= 100) return 'Good';
    if (roi >= 0) return 'Break Even';
    return 'Loss';
  };

  if (channels.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No ROI data available
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overall ROI Summary */}
      <div className="p-4 bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg border border-primary-200">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-gray-900">Overall Performance</h4>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getROIColor(overallROI)}`}>
            {getROILabel(overallROI)}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-600 mb-1">Total Revenue</p>
            <p className="text-xl font-bold text-gray-900">${totals.revenue.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Total Cost</p>
            <p className="text-xl font-bold text-gray-900">${totals.cost.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Overall ROI</p>
            <p className={`text-xl font-bold ${overallROI >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
              {overallROI >= 0 ? '+' : ''}{overallROI.toFixed(1)}%
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Avg CAC</p>
            <p className="text-xl font-bold text-gray-900">${averageCAC.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Channel ROI Rankings */}
      <div className="space-y-3">
        <h4 className="font-semibold text-gray-900 text-sm">Channel Rankings</h4>
        {sortedChannels.map((channel, index) => {
          const profit = channel.revenue - channel.cost;
          return (
            <div key={channel.channel} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white border-2 border-gray-200 font-bold text-sm text-gray-700">
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-gray-900 capitalize truncate">{channel.channel}</span>
                  <span className={`text-sm font-semibold ${channel.roi >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
                    {channel.roi >= 0 ? '+' : ''}{channel.roi.toFixed(1)}%
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-600">
                  <span>Rev: ${channel.revenue.toLocaleString()}</span>
                  <span>Cost: ${channel.cost.toLocaleString()}</span>
                  <span className={profit >= 0 ? 'text-success-600 font-medium' : 'text-danger-600 font-medium'}>
                    Profit: ${Math.abs(profit).toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="flex items-center">
                {channel.roi >= 0 ? (
                  <Icon name="trending-up" className="w-5 h-5 text-success-600" />
                ) : (
                  <Icon name="trending-down" className="w-5 h-5 text-danger-600" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ROI Formula Explanation */}
      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-start gap-2">
          <Icon name="calculator" className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-blue-800">
            <p className="font-semibold mb-1">ROI Calculation</p>
            <p className="font-mono">ROI = ((Revenue - Cost) / Cost) × 100</p>
            <p className="mt-2">A positive ROI means the channel is profitable. Higher ROI indicates better performance.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
