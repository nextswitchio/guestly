'use client';

import { useState, useEffect } from 'react';
import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import { InfluencerDiscovery } from '@/components/marketing/InfluencerDiscovery';
import { InfluencerInviteForm } from '@/components/marketing/InfluencerInviteForm';
import { InfluencerCollaboration } from '@/components/marketing/InfluencerCollaboration';
import { MediaKitGenerator } from '@/components/marketing/MediaKitGenerator';
import InfluencerSearch from '@/components/marketing/InfluencerSearch';

type InfluencerTab = 'discover' | 'collaborations' | 'media-kit';

export default function InfluencersPage() {
  const [organizerId, setOrganizerId] = useState<string>('');
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<InfluencerTab>('discover');

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((d) => { if (d.ok && d.user?.id) setOrganizerId(d.user.id); })
      .catch(() => {});

    fetch('/api/events/my?page_size=50')
      .then((r) => r.json())
      .then((d) => {
        const list = Array.isArray(d.events) ? d.events : [];
        if (list.length > 0) setSelectedEventId(list[0].id);
      })
      .catch(() => {});
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
          <Button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            variant={activeTab === tab.id ? 'primary' : 'outline'}
          >
            <Icon name={tab.icon} size={16} />
            {tab.label}
          </Button>
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
          <InfluencerInviteForm organizerId={organizerId} eventId={selectedEventId} />
          <InfluencerCollaboration organizerId={organizerId} />
        </div>
      )}

      {activeTab === 'media-kit' && (
        <MediaKitGenerator eventId={selectedEventId} organizerId={organizerId} />
      )}
    </div>
  );
}
