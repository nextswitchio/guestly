'use client';
import { Bell, Camera, Mail, MessageCircle, Pause, Play, RefreshCw, Smartphone, Users, XCircle } from 'lucide-react';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import CampaignMetrics from '@/components/marketing/CampaignMetrics';
import type { Campaign } from '@/lib/marketing';

export default function CampaignDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCampaign();
  }, [id]);

  const fetchCampaign = async () => {
    try {
      const response = await fetch(`/api/campaigns/${id}`);
      if (response.ok) {
        const data = await response.json();
        setCampaign(data.campaign);
      }
    } catch (error) {
      console.error('Failed to fetch campaign:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePause = async () => {
    try {
      const response = await fetch(`/api/campaigns/${id}/pause`, { method: 'POST' });
      if (response.ok) {
        fetchCampaign();
      }
    } catch (error) {
      console.error('Failed to pause campaign:', error);
    }
  };

  const handleResume = async () => {
    try {
      const response = await fetch(`/api/campaigns/${id}/resume`, { method: 'POST' });
      if (response.ok) {
        fetchCampaign();
      }
    } catch (error) {
      console.error('Failed to resume campaign:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-lime border-t-lime" />
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="max-w-2xl mx-auto mt-12">
        <div className="rounded-2xl border border-neutral-200 bg-white p-12 text-center">
          <div className="flex h-16 w-16 mx-auto mb-4 items-center justify-center rounded-full bg-red-100">
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">Campaign Not Found</h2>
          <p className="text-neutral-500 mb-4">
            The campaign you're looking for doesn't exist.
          </p>
          <Button onClick={() => router.push('/dashboard/marketing')}>
            Back to Marketing
          </Button>
        </div>
      </div>
    );
  }

  const statusStyles: Record<string, string> = {
    active: 'bg-green-100 text-green-700',
    paused: 'bg-amber-100 text-amber-700',
    completed: 'bg-neutral-100 text-neutral-700',
    draft: 'bg-blue-100 text-blue-700',
  };

  const channelIcons: Record<string, React.ReactNode> = {
    email: <Mail className="w-4 h-4" />,
    sms: <MessageCircle className="w-4 h-4" />,
    whatsapp: <Smartphone className="w-4 h-4" />,
    push: <Bell className="w-4 h-4" />,
    facebook: <Users className="w-4 h-4" />,
    twitter: <span className="text-sm font-bold">𝕏</span>,
    instagram: <Camera className="w-4 h-4" />,
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => router.back()}
            variant="outline"
          >
            <Icon name="arrow-left" size={16} />
            Back
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">{campaign.name}</h1>
            <p className="text-neutral-500 mt-1">{campaign.description}</p>
          </div>
        </div>

        <div className="flex gap-2">
          {campaign.status === 'active' ? (
            <Button
              onClick={handlePause}
              variant="outline"
            >
              <Pause className="h-4 w-4" />
              Pause
            </Button>
          ) : campaign.status === 'paused' ? (
            <Button
              onClick={handleResume}
            >
              <Play className="h-4 w-4" />
              Resume
            </Button>
          ) : null}
          <Button
            onClick={() => router.push(`/dashboard/marketing/campaigns/${id}/edit`)}
            variant="outline"
          >
            <Icon name="edit" size={16} />
            Edit
          </Button>
        </div>
      </div>

      {/* Status Badge */}
      <span
        className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium ${
          statusStyles[campaign.status] || 'bg-neutral-100 text-neutral-700'
        }`}
      >
        {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
      </span>

      {/* Metrics */}
      <CampaignMetrics campaignId={campaign.id} />

      {/* Campaign Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-neutral-200 bg-white p-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Campaign Information</h3>
          <div className="space-y-4">
            {[
              { label: 'Type', value: campaign.type },
              { label: 'Budget', value: campaign.budget ? `₦${campaign.budget.toLocaleString()}` : 'Not set' },
              { label: 'Spent', value: `₦${campaign.spent.toLocaleString()}` },
              { label: 'Created', value: new Date(campaign.createdAt).toLocaleDateString() },
            ].map((item) => (
              <div key={item.label}>
                <label className="text-sm text-neutral-500">{item.label}</label>
                <p className="font-medium text-neutral-900 capitalize">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Active Channels</h3>
          <div className="space-y-2">
            {campaign.channels.filter(c => c.enabled).map((channel, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl"
              >
                <span className="text-neutral-600">
                  {channelIcons[channel.type] || channel.type}
                </span>
                <span className="font-medium text-neutral-900 capitalize">{channel.type}</span>
              </div>
            ))}
            {campaign.channels.filter(c => c.enabled).length === 0 && (
              <p className="text-sm text-neutral-500">No active channels</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
