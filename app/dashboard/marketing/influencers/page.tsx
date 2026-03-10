'use client';

import { useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { InfluencerDiscovery } from '@/components/marketing/InfluencerDiscovery';
import { InfluencerInviteForm } from '@/components/marketing/InfluencerInviteForm';
import { InfluencerCollaboration } from '@/components/marketing/InfluencerCollaboration';
import { MediaKitGenerator } from '@/components/marketing/MediaKitGenerator';
import InfluencerSearch from '@/components/marketing/InfluencerSearch';

type InfluencerTab = 'discover' | 'collaborations' | 'media-kit';

export default function InfluencersPage() {
  const [organizerId] = useState('org_123');
  const [activeTab, setActiveTab] = useState<InfluencerTab>('discover');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Influencer Marketing</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Discover, collaborate, and track influencer partnerships
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex">
            <button
              onClick={() => setActiveTab('discover')}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'discover'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <Icon name="search" className="w-4 h-4" />
              Discover
            </button>
            <button
              onClick={() => setActiveTab('collaborations')}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'collaborations'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <Icon name="users" className="w-4 h-4" />
              Collaborations
            </button>
            <button
              onClick={() => setActiveTab('media-kit')}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'media-kit'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <Icon name="package" className="w-4 h-4" />
              Media Kit
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'discover' && (
        <div className="space-y-6">
          <InfluencerSearch organizerId={organizerId} />
          <InfluencerDiscovery organizerId={organizerId} />
        </div>
      )}

      {activeTab === 'collaborations' && (
        <div className="space-y-6">
          <InfluencerInviteForm organizerId={organizerId} eventId="event_123" />
          <InfluencerCollaboration organizerId={organizerId} />
        </div>
      )}

      {activeTab === 'media-kit' && (
        <MediaKitGenerator eventId="event_123" organizerId={organizerId} />
      )}
    </div>
  );
}
