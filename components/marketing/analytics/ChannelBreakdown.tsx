'use client';
import { Mail, MessageCircle } from 'lucide-react';

import { useMemo } from 'react';
import { Icon } from '@/components/ui/Icon';

interface ChannelData {
  channel: string;
  reach: number;
  impressions: number;
  clicks: number;
  conversions: number;
  revenue: number;
  cost: number;
  ctr: number;
  conversionRate: number;
  roi: number;
}

interface Props {
  channels: ChannelData[];
}

export default function ChannelBreakdown({ channels }: Props) {
  const totals = useMemo(() => {
    return channels.reduce(
      (acc, channel) => ({
        reach: acc.reach + channel.reach,
        impressions: acc.impressions + channel.impressions,
        clicks: acc.clicks + channel.clicks,
        conversions: acc.conversions + channel.conversions,
        revenue: acc.revenue + channel.revenue,
        cost: acc.cost + channel.cost,
      }),
      { reach: 0, impressions: 0, clicks: 0, conversions: 0, revenue: 0, cost: 0 }
    );
  }, [channels]);

  const getChannelIcon = (channel: string) => {
    const icons: Record<string, string> = {
      email: 'Mail',
      sms: '💬',
      whatsapp: '📱',
      push: '🔔',
      facebook: '👥',
      instagram: '📷',
      twitter: '🐦',
      linkedin: '💼',
      tiktok: '🎵',
      google: '🔍',
      organic: '🌱',
      referral: '🔗',
      affiliate: '🤝',
    };
    return icons[channel.toLowerCase()] || '📊';
  };

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

  if (channels.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No channel data available
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-900 font-medium mb-1">Total Reach</p>
          <p className="text-2xl font-bold text-blue-900">{totals.reach.toLocaleString()}</p>
        </div>
        <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
          <p className="text-sm text-purple-900 font-medium mb-1">Total Clicks</p>
          <p className="text-2xl font-bold text-purple-900">{totals.clicks.toLocaleString()}</p>
        </div>
        <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
          <p className="text-sm text-green-900 font-medium mb-1">Total Conversions</p>
          <p className="text-2xl font-bold text-green-900">{totals.conversions.toLocaleString()}</p>
        </div>
      </div>

      {/* Channel breakdown cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {channels.map((channel) => {
          const reachPercent = totals.reach > 0 ? (channel.reach / totals.reach) * 100 : 0;
          const revenuePercent = totals.revenue > 0 ? (channel.revenue / totals.revenue) * 100 : 0;

          return (
            <div key={channel.channel} className="p-5 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              {/* Channel header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${getChannelColor(channel.channel)} rounded-lg flex items-center justify-center text-xl`}>
                    {getChannelIcon(channel.channel)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 capitalize">{channel.channel}</h4>
                    <p className="text-xs text-gray-500">{reachPercent.toFixed(1)}% of total reach</p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-semibold ${channel.roi >= 100 ? 'bg-success-100 text-success-700' : channel.roi >= 0 ? 'bg-warning-100 text-warning-700' : 'bg-danger-100 text-danger-700'}`}>
                  {channel.roi >= 0 ? '+' : ''}{channel.roi.toFixed(0)}% ROI
                </div>
              </div>

              {/* Metrics grid */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <p className="text-xs text-gray-600 mb-0.5">Reach</p>
                  <p className="text-lg font-semibold text-gray-900">{channel.reach.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-0.5">Impressions</p>
                  <p className="text-lg font-semibold text-gray-900">{channel.impressions.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-0.5">Clicks</p>
                  <p className="text-lg font-semibold text-gray-900">{channel.clicks.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-0.5">Conversions</p>
                  <p className="text-lg font-semibold text-gray-900">{channel.conversions.toLocaleString()}</p>
                </div>
              </div>

              {/* Performance bars */}
              <div className="space-y-2">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-600">CTR</span>
                    <span className="font-semibold text-gray-900">{channel.ctr.toFixed(2)}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 transition-all duration-500"
                      style={{ width: `${Math.min(channel.ctr * 10, 100)}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-600">Conversion Rate</span>
                    <span className="font-semibold text-gray-900">{channel.conversionRate.toFixed(2)}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 transition-all duration-500"
                      style={{ width: `${Math.min(channel.conversionRate * 20, 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Revenue and cost */}
              <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600">Revenue</p>
                  <p className="text-lg font-bold text-gray-900">${channel.revenue.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">{revenuePercent.toFixed(1)}% of total</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-600">Cost</p>
                  <p className="text-lg font-bold text-gray-900">${channel.cost.toLocaleString()}</p>
                  <p className={`text-xs font-medium ${channel.revenue - channel.cost >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
                    {channel.revenue - channel.cost >= 0 ? '+' : ''}${(channel.revenue - channel.cost).toLocaleString()} profit
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Channel comparison table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-gray-200 bg-gray-50">
              <th className="text-left py-3 px-3 font-semibold text-gray-700">Channel</th>
              <th className="text-right py-3 px-3 font-semibold text-gray-700">Reach</th>
              <th className="text-right py-3 px-3 font-semibold text-gray-700">Clicks</th>
              <th className="text-right py-3 px-3 font-semibold text-gray-700">CTR</th>
              <th className="text-right py-3 px-3 font-semibold text-gray-700">Conversions</th>
              <th className="text-right py-3 px-3 font-semibold text-gray-700">Conv. Rate</th>
              <th className="text-right py-3 px-3 font-semibold text-gray-700">Revenue</th>
              <th className="text-right py-3 px-3 font-semibold text-gray-700">ROI</th>
            </tr>
          </thead>
          <tbody>
            {channels.map((channel) => (
              <tr key={channel.channel} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-3">
                  <div className="flex items-center gap-2">
                    <span>{getChannelIcon(channel.channel)}</span>
                    <span className="font-medium capitalize">{channel.channel}</span>
                  </div>
                </td>
                <td className="text-right py-3 px-3">{channel.reach.toLocaleString()}</td>
                <td className="text-right py-3 px-3">{channel.clicks.toLocaleString()}</td>
                <td className="text-right py-3 px-3">{channel.ctr.toFixed(2)}%</td>
                <td className="text-right py-3 px-3">{channel.conversions.toLocaleString()}</td>
                <td className="text-right py-3 px-3">{channel.conversionRate.toFixed(2)}%</td>
                <td className="text-right py-3 px-3 font-medium">${channel.revenue.toLocaleString()}</td>
                <td className={`text-right py-3 px-3 font-semibold ${channel.roi >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
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
