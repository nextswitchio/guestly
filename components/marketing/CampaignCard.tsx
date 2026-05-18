'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import CampaignMetrics from './CampaignMetrics';
import type { Campaign } from '@/lib/marketing';

interface CampaignCardProps {
  campaign: Campaign;
  onUpdate?: () => void;
}

export default function CampaignCard({ campaign, onUpdate }: CampaignCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);

  const getStatusColor = (status: Campaign['status']) => {
    switch (status) {
      case 'active':
        return 'text-green-700 bg-green-100';
      case 'scheduled':
        return 'text-amber-700 bg-amber-100';
      case 'paused':
        return 'text-neutral-500 bg-neutral-100';
      case 'completed':
        return 'text-blue-700 bg-blue-100';
      case 'failed':
        return 'text-red-700 bg-red-100';
      default:
        return 'text-neutral-500 bg-neutral-100';
    }
  };

  const handlePause = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/campaigns/${campaign.id}/pause`, {
        method: 'POST',
      });
      if (response.ok) {
        onUpdate?.();
      }
    } catch (error) {
      console.error('Failed to pause campaign:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResume = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/campaigns/${campaign.id}/resume`, {
        method: 'POST',
      });
      if (response.ok) {
        onUpdate?.();
      }
    } catch (error) {
      console.error('Failed to resume campaign:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExecute = async () => {
    if (!confirm('Execute this campaign now?')) return;
    try {
      setLoading(true);
      const response = await fetch(`/api/campaigns/${campaign.id}/execute`, {
        method: 'POST',
      });
      if (response.ok) {
        onUpdate?.();
      }
    } catch (error) {
      console.error('Failed to execute campaign:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp?: number) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-semibold">{campaign.name}</h3>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                campaign.status
              )}`}
            >
              {campaign.status}
            </span>
          </div>
          <p className="text-neutral-500 text-sm">{campaign.description}</p>
        </div>
        <div className="flex gap-2">
          {campaign.status === 'active' && (
            <Button variant="outline" size="sm" onClick={handlePause} disabled={loading}>
              <Icon name="pause" className="w-4 h-4" />
            </Button>
          )}
          {campaign.status === 'paused' && (
            <Button variant="outline" size="sm" onClick={handleResume} disabled={loading}>
              <Icon name="play" className="w-4 h-4" />
            </Button>
          )}
          {campaign.status === 'scheduled' && (
            <Button variant="outline" size="sm" onClick={handleExecute} disabled={loading}>
              <Icon name="send" className="w-4 h-4" />
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setExpanded(!expanded)}
          >
            <Icon name={expanded ? 'chevron-up' : 'chevron-down'} className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
        <div>
          <p className="text-xs text-neutral-500">Channels</p>
          <p className="text-lg font-semibold">{campaign.channels.length}</p>
        </div>
        <div>
          <p className="text-xs text-neutral-500">Reach</p>
          <p className="text-lg font-semibold">{campaign.metrics.reach.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs text-neutral-500">Clicks</p>
          <p className="text-lg font-semibold">{campaign.metrics.clicks.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs text-neutral-500">Conversions</p>
          <p className="text-lg font-semibold">{campaign.metrics.conversions.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs text-neutral-500">ROI</p>
          <p
            className={`text-lg font-semibold ${
              campaign.metrics.roi >= 0 ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {campaign.metrics.roi.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Channel Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {campaign.channels.map((channel) => (
          <span
            key={channel.type}
            className="px-2 py-1 bg-neutral-100 rounded text-xs font-medium capitalize"
          >
            {channel.type}
          </span>
        ))}
      </div>

      {/* Dates */}
      <div className="flex gap-4 text-sm text-neutral-500">
        {campaign.scheduledAt && (
          <div className="flex items-center gap-1">
            <Icon name="clock" className="w-4 h-4" />
            <span>Scheduled: {formatDate(campaign.scheduledAt)}</span>
          </div>
        )}
        {campaign.startedAt && (
          <div className="flex items-center gap-1">
            <Icon name="play" className="w-4 h-4" />
            <span>Started: {formatDate(campaign.startedAt)}</span>
          </div>
        )}
        {campaign.completedAt && (
          <div className="flex items-center gap-1">
            <Icon name="check-circle" className="w-4 h-4" />
            <span>Completed: {formatDate(campaign.completedAt)}</span>
          </div>
        )}
      </div>

      {/* Expanded Metrics */}
      {expanded && (
        <div className="mt-6 pt-6 border-t border-neutral-200">
          <CampaignMetrics campaignId={campaign.id} />
        </div>
      )}
    </Card>
  );
}
