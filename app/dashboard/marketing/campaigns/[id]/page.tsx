'use client';
import { Bell, Camera, Mail, MessageCircle, Pause, Play, RefreshCw, Smartphone, Users, XCircle } from 'lucide-react';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
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
      <div className="flex items-center justify-center min-h-screen">
        <span className="text-4xl animate-spin"><RefreshCw className="h-4 w-4 inline-block" /></span>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="max-w-2xl mx-auto mt-12">
        <Card className="p-12 text-center">
          <span className="text-6xl mb-4 block"><XCircle className="h-4 w-4 inline-block" /></span>
          <h2 className="text-2xl font-bold mb-2">Campaign Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            The campaign you're looking for doesn't exist.
          </p>
          <Button onClick={() => router.push('/dashboard/marketing')}>
            Back to Marketing
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <Icon name="arrow-left" className="w-4 h-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{campaign.name}</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {campaign.description}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          {campaign.status === 'active' ? (
            <Button variant="outline" onClick={handlePause}>
              <span className="mr-2"><Pause className="h-4 w-4 inline-block" /></span>
              Pause
            </Button>
          ) : campaign.status === 'paused' ? (
            <Button onClick={handleResume}>
              <span className="mr-2"><Play className="h-4 w-4 inline-block" /></span>
              Resume
            </Button>
          ) : null}
          <Button
            variant="outline"
            onClick={() => router.push(`/dashboard/marketing/campaigns/${id}/edit`)}
          >
            <Icon name="edit" className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>

      {/* Status Badge */}
      <div>
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            campaign.status === 'active'
              ? 'bg-success-100 text-success-700'
              : campaign.status === 'paused'
              ? 'bg-warning-100 text-warning-700'
              : campaign.status === 'completed'
              ? 'bg-gray-100 text-gray-700'
              : 'bg-blue-100 text-blue-700'
          }`}
        >
          {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
        </span>
      </div>

      {/* Metrics */}
      <CampaignMetrics campaignId={campaign.id} />

      {/* Campaign Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Campaign Information</h3>
          <div className="space-y-3">
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-400">Type</label>
              <p className="font-medium capitalize">{campaign.type}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-400">Budget</label>
              <p className="font-medium">
                {campaign.budget ? `₦${campaign.budget.toLocaleString()}` : 'Not set'}
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-400">Spent</label>
              <p className="font-medium">₦{campaign.spent.toLocaleString()}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-400">Created</label>
              <p className="font-medium">
                {new Date(campaign.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Active Channels</h3>
          <div className="space-y-2">
            {campaign.channels.filter(c => c.enabled).map((channel, index) => (
              <div
                key={index}
                className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded"
              >
                <span className="text-xl">
                  {channel.type === 'email' && 'Mail'}
                  {channel.type === 'sms' && '💬'}
                  {channel.type === 'whatsapp' && '📱'}
                  {channel.type === 'push' && '🔔'}
                  {channel.type === 'facebook' && '👥'}
                  {channel.type === 'twitter' && '🐦'}
                  {channel.type === 'instagram' && '📷'}
                </span>
                <span className="font-medium capitalize">{channel.type}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
