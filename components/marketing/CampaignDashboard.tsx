'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import CampaignCard from './CampaignCard';
import CampaignCalendar from './CampaignCalendar';
import { ErrorBoundary } from './ErrorBoundary';
import { LoadingState, SkeletonLoader } from './LoadingState';
import { ErrorMessage } from './ErrorMessage';
import type { Campaign } from '@/lib/marketing';

interface CampaignDashboardProps {
  organizerId?: string;
}

export default function CampaignDashboard({ organizerId }: CampaignDashboardProps) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [filter, setFilter] = useState<'all' | 'active' | 'scheduled' | 'completed'>('all');

  useEffect(() => {
    fetchCampaigns();
  }, [organizerId, filter]);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!organizerId) {
        throw new Error('Organizer ID is required');
      }
      
      const params = new URLSearchParams({ organizerId });
      if (filter !== 'all') {
        params.append('status', filter);
      }
      
      const response = await fetch(`/api/campaigns?${params}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch campaigns: ${response.statusText}`);
      }
      
      const data = await response.json();
      setCampaigns(data.campaigns || []);
    } catch (err) {
      console.error('Failed to fetch campaigns:', err);
      setError(err instanceof Error ? err.message : 'Failed to load campaigns');
    } finally {
      setLoading(false);
    }
  };

  const filteredCampaigns = campaigns.filter((campaign) => {
    if (filter === 'all') return true;
    return campaign.status === filter;
  });

  const stats = {
    total: campaigns.length,
    active: campaigns.filter((c) => c.status === 'active').length,
    scheduled: campaigns.filter((c) => c.status === 'scheduled').length,
    completed: campaigns.filter((c) => c.status === 'completed').length,
  };

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Marketing Campaigns</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage and track your marketing campaigns across all channels
            </p>
          </div>
          <Button href="/dashboard/marketing/campaigns/new" className="flex items-center gap-2">
            <Icon name="plus" className="w-5 h-5" />
            Create Campaign
          </Button>
        </div>

        {/* Error Message */}
        {error && (
          <ErrorMessage
            title="Failed to Load Campaigns"
            message={error}
            onRetry={fetchCampaigns}
            onDismiss={() => setError(null)}
          />
        )}

        {/* Stats Overview */}
        {!error && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Campaigns</p>
                  <p className="text-2xl font-bold mt-1">{stats.total}</p>
                </div>
                <Icon name="megaphone" className="w-8 h-8 text-primary-500" />
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Active</p>
                  <p className="text-2xl font-bold mt-1 text-success-500">{stats.active}</p>
                </div>
                <Icon name="play" className="w-8 h-8 text-success-500" />
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Scheduled</p>
                  <p className="text-2xl font-bold mt-1 text-warning-500">{stats.scheduled}</p>
                </div>
                <Icon name="clock" className="w-8 h-8 text-warning-500" />
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
                  <p className="text-2xl font-bold mt-1 text-gray-500">{stats.completed}</p>
                </div>
                <Icon name="check-circle" className="w-8 h-8 text-gray-500" />
              </div>
            </Card>
          </div>
        )}

        {/* View Toggle and Filters */}
        {!error && (
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button
                variant={view === 'list' ? 'primary' : 'outline'}
                onClick={() => setView('list')}
                className="flex items-center gap-2"
              >
                <Icon name="list" className="w-4 h-4" />
                List
              </Button>
              <Button
                variant={view === 'calendar' ? 'primary' : 'outline'}
                onClick={() => setView('calendar')}
                className="flex items-center gap-2"
              >
                <Icon name="calendar" className="w-4 h-4" />
                Calendar
              </Button>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filter === 'all'
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('active')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filter === 'active'
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setFilter('scheduled')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filter === 'scheduled'
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Scheduled
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filter === 'completed'
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Completed
              </button>
            </div>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <SkeletonLoader count={3} />
        ) : error ? null : view === 'list' ? (
          <div className="space-y-4">
            {filteredCampaigns.length === 0 ? (
              <Card className="p-12 text-center">
                <Icon name="megaphone" className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">No campaigns found</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Create your first campaign to start promoting your events
                </p>
                <Button href="/dashboard/marketing/campaigns/new">Create Campaign</Button>
              </Card>
            ) : (
              filteredCampaigns.map((campaign) => (
                <CampaignCard
                  key={campaign.id}
                  campaign={campaign}
                  onUpdate={fetchCampaigns}
                />
              ))
            )}
          </div>
        ) : (
          <CampaignCalendar campaigns={filteredCampaigns} onUpdate={fetchCampaigns} />
        )}
      </div>
    </ErrorBoundary>
  );
}
