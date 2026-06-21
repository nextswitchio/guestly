'use client';
import { Mail, MessageCircle } from 'lucide-react';

import { Icon } from '@/components/ui/Icon';
import { Card } from '@/components/ui/Card';

interface CampaignSummary {
  totalCampaigns: number;
  activeCampaigns: number;
  completedCampaigns: number;
  totalReach: number;
  totalConversions: number;
  totalRevenue: number;
  totalSpent: number;
  averageROI: number;
  topPerformingChannel: string;
  recentCampaigns: RecentCampaign[];
}

interface RecentCampaign {
  id: string;
  name: string;
  status: 'active' | 'scheduled' | 'completed' | 'paused';
  reach: number;
  conversions: number;
  roi: number;
  startedAt: number;
}

interface Props {
  data: CampaignSummary;
}

export default function CampaignOverview({ data }: Props) {
  const safeData = data ?? {
    totalCampaigns: 0,
    activeCampaigns: 0,
    completedCampaigns: 0,
    totalReach: 0,
    totalConversions: 0,
    totalRevenue: 0,
    totalSpent: 0,
    averageROI: 0,
    topPerformingChannel: 'unknown',
    recentCampaigns: [],
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: 'bg-green-100 text-green-700',
      scheduled: 'bg-blue-100 text-blue-700',
      completed: 'bg-neutral-100 text-neutral-700',
      paused: 'bg-amber-100 text-amber-700',
    };
    return colors[status] || 'bg-neutral-100 text-neutral-700';
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Key metrics grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="chart-bar" className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-blue-900 font-medium">Total Campaigns</span>
          </div>
          <p className="text-3xl font-bold text-blue-900">{safeData.totalCampaigns}</p>
          <p className="text-xs text-blue-700 mt-1">
            {safeData.activeCampaigns} active, {safeData.completedCampaigns} completed
          </p>
        </div>

        <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="users" className="w-5 h-5 text-purple-600" />
            <span className="text-sm text-purple-900 font-medium">Total Reach</span>
          </div>
          <p className="text-3xl font-bold text-purple-900">{safeData.totalReach.toLocaleString()}</p>
          <p className="text-xs text-purple-700 mt-1">Unique users reached</p>
        </div>

        <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="check-circle" className="w-5 h-5 text-green-600" />
            <span className="text-sm text-green-900 font-medium">Conversions</span>
          </div>
          <p className="text-3xl font-bold text-green-900">{safeData.totalConversions.toLocaleString()}</p>
          <p className="text-xs text-green-700 mt-1">
            {safeData.totalReach > 0 ? ((safeData.totalConversions / safeData.totalReach) * 100).toFixed(2) : 0}% conversion rate
          </p>
        </div>

        <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="currency-dollar" className="w-5 h-5 text-orange-600" />
            <span className="text-sm text-orange-900 font-medium">Revenue</span>
          </div>
          <p className="text-3xl font-bold text-orange-900">${safeData.totalRevenue.toLocaleString()}</p>
          <p className="text-xs text-orange-700 mt-1">
            ${safeData.totalSpent.toLocaleString()} spent
          </p>
        </div>
      </div>

      {/* Performance summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-neutral-900">Average ROI</h4>
            <Icon name="trending-up" className={`w-5 h-5 ${safeData.averageROI >= 0 ? 'text-green-700' : 'text-red-700'}`} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-4xl font-bold ${safeData.averageROI >= 0 ? 'text-green-700' : 'text-red-700'}`}>
              {safeData.averageROI >= 0 ? '+' : ''}{safeData.averageROI.toFixed(1)}%
            </span>
            <span className="text-sm text-neutral-500">return on investment</span>
          </div>
          <div className="mt-4 pt-4 border-t border-neutral-200">
            <p className="text-sm text-neutral-500">
              For every $1 spent, you earn ${(1 + safeData.averageROI / 100).toFixed(2)}
            </p>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-neutral-900">Top Channel</h4>
            <Icon name="star" className="w-5 h-5 text-yellow-500" />
          </div>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-lime-100 rounded-lg">
              <span className="text-2xl">
                {safeData.topPerformingChannel === 'email' && 'Mail'}
                {safeData.topPerformingChannel === 'sms' && '💬'}
                {safeData.topPerformingChannel === 'social' && '👥'}
                {safeData.topPerformingChannel === 'push' && '🔔'}
                {!['email', 'sms', 'social', 'push'].includes(safeData.topPerformingChannel) && '📊'}
              </span>
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-900 capitalize">{safeData.topPerformingChannel}</p>
              <p className="text-sm text-neutral-500">Best performing channel</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent campaigns */}
      <Card className="p-5">
        <h4 className="font-semibold text-neutral-900 mb-4">Recent Campaigns</h4>
        <div className="space-y-3">
          {safeData.recentCampaigns.length === 0 ? (
            <p className="text-center py-8 text-neutral-500">No recent campaigns</p>
          ) : (
            safeData.recentCampaigns.map((campaign) => (
              <div key={campaign.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h5 className="font-medium text-neutral-900 truncate">{campaign.name}</h5>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                      {campaign.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-neutral-500">
                    <span>{campaign.reach.toLocaleString()} reach</span>
                    <span>{campaign.conversions} conversions</span>
                    <span className={campaign.roi >= 0 ? 'text-green-700 font-medium' : 'text-red-700 font-medium'}>
                      {campaign.roi >= 0 ? '+' : ''}{campaign.roi.toFixed(1)}% ROI
                    </span>
                  </div>
                </div>
                <div className="text-right ml-4">
                  <p className="text-xs text-neutral-500">{formatDate(campaign.startedAt)}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
