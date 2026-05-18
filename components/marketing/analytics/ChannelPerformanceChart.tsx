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

export default function ChannelPerformanceChart({ channels }: Props) {
  const maxRevenue = useMemo(() => {
    return Math.max(...channels.map(c => c.revenue), 1);
  }, [channels]);

  const maxConversions = useMemo(() => {
    return Math.max(...channels.map(c => c.conversions), 1);
  }, [channels]);

  const getChannelColor = (channel: string) => {
    const colors: Record<string, string> = {
      email: 'bg-blue-500',
      sms: 'bg-green-500',
      whatsapp: 'bg-emerald-500',
      push: 'bg-purple-500',
      facebook: 'bg-indigo-500',
      instagram: 'bg-pink-500',
      twitter: 'bg-sky-500',
      linkedin: 'bg-blue-700',
      tiktok: 'bg-gray-900',
      google: 'bg-red-500',
      organic: 'bg-yellow-500',
      referral: 'bg-orange-500',
      affiliate: 'bg-violet-500',
    };
    return colors[channel.toLowerCase()] || 'bg-gray-500';
  };

  const getChannelIcon = (channel: string) => {
    const icons: Record<string, string> = {
      email: 'mail',
      sms: 'message-square',
      whatsapp: 'message-circle',
      push: 'bell',
      facebook: 'facebook',
      instagram: 'instagram',
      twitter: 'twitter',
      linkedin: 'linkedin',
      tiktok: 'music',
      google: 'search',
      organic: 'trending-up',
      referral: 'link',
      affiliate: 'users',
    };
    return icons[channel.toLowerCase()] || 'bar-chart';
  };

  if (channels.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No channel data available
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Bar chart visualization */}
      <div className="space-y-4">
        {channels.map((channel) => (
          <div key={channel.channel} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon name={getChannelIcon(channel.channel) as any} className="w-5 h-5 text-primary-500" />
                <span className="font-medium text-gray-900 capitalize">{channel.channel}</span>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-gray-600">{channel.conversions} conversions</span>
                <span className="font-semibold text-gray-900">${channel.revenue.toLocaleString()}</span>
              </div>
            </div>
            
            {/* Revenue bar */}
            <div className="relative h-8 bg-gray-100 rounded-lg overflow-hidden">
              <div
                className={`h-full ${getChannelColor(channel.channel)} transition-all duration-500 flex items-center justify-end px-3`}
                style={{ width: `${(channel.revenue / maxRevenue) * 100}%` }}
              >
                {channel.revenue > 0 && (
                  <span className="text-xs font-semibold text-white">
                    ROI: {channel.roi.toFixed(0)}%
                  </span>
                )}
              </div>
            </div>

            {/* Metrics row */}
            <div className="flex items-center gap-4 text-xs text-gray-600 pl-7">
              <span>Cost: ${channel.cost.toLocaleString()}</span>
              <span>CAC: ${channel.cac.toFixed(2)}</span>
              <span className={channel.roi >= 0 ? 'text-success-600 font-medium' : 'text-danger-600 font-medium'}>
                {channel.roi >= 0 ? '+' : ''}{channel.roi.toFixed(1)}% ROI
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Summary table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-2 font-semibold text-gray-700">Channel</th>
              <th className="text-right py-3 px-2 font-semibold text-gray-700">Conversions</th>
              <th className="text-right py-3 px-2 font-semibold text-gray-700">Revenue</th>
              <th className="text-right py-3 px-2 font-semibold text-gray-700">Cost</th>
              <th className="text-right py-3 px-2 font-semibold text-gray-700">CAC</th>
              <th className="text-right py-3 px-2 font-semibold text-gray-700">ROI</th>
            </tr>
          </thead>
          <tbody>
            {channels.map((channel) => (
              <tr key={channel.channel} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-2">
                  <div className="flex items-center gap-2">
                    <Icon name={getChannelIcon(channel.channel) as any} className="w-4 h-4 text-gray-600" />
                    <span className="font-medium capitalize">{channel.channel}</span>
                  </div>
                </td>
                <td className="text-right py-3 px-2">{channel.conversions.toLocaleString()}</td>
                <td className="text-right py-3 px-2 font-medium">${channel.revenue.toLocaleString()}</td>
                <td className="text-right py-3 px-2">${channel.cost.toLocaleString()}</td>
                <td className="text-right py-3 px-2">${channel.cac.toFixed(2)}</td>
                <td className={`text-right py-3 px-2 font-semibold ${channel.roi >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
                  {channel.roi >= 0 ? '+' : ''}{channel.roi.toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
