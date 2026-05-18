'use client';

import { useState, useEffect } from 'react';
import { Icon } from '@/components/ui/Icon';
import { InfluencerDiscovery } from '@/components/marketing/InfluencerDiscovery';
import { InfluencerInviteForm } from '@/components/marketing/InfluencerInviteForm';
import { InfluencerCollaboration } from '@/components/marketing/InfluencerCollaboration';
import { MediaKitGenerator } from '@/components/marketing/MediaKitGenerator';
import InfluencerSearch from '@/components/marketing/InfluencerSearch';

type InfluencerTab = 'discover' | 'collaborations' | 'media-kit';

export default function InfluencersPage() {
  const [organizerId, setOrganizerId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<InfluencerTab>('discover');

  useEffect(() => {
    const cookies = document.cookie.split(";");
    const userIdCookie = cookies.find((c) => c.trim().startsWith("user_id="));
    if (userIdCookie) {
      setOrganizerId(userIdCookie.split("=")[1]);
    }
  }, []);

  if (!organizerId) {
    return <div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2 border-lime border-t-lime" /></div>;
  }

  const tabs = [
    { id: 'discover' as const, label: 'Discover', icon: 'search' as const },
    { id: 'collaborations' as const, label: 'Collaborations', icon: 'users' as const },
    { id: 'media-kit' as const, label: 'Media Kit', icon: 'package' as const },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Influencer Marketing</h1>
        <p className="text-neutral-500 mt-1">
          Discover, collaborate, and track influencer partnerships
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-lime text-dark'
                : 'text-neutral-500 hover:bg-neutral-100'
            }`}
          >
            <Icon name={tab.icon} size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'discover' && (
        <div className="space-y-6">
          <InfluencerSearch organizerId={organizerId} />
          <InfluencerDiscovery 
            organizerId={organizerId}
            onInvite={() => {}}
          />
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
