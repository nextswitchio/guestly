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

interface EventOption {
  id: string;
  title: string;
}

export default function InfluencersPage() {
  const [organizerId, setOrganizerId] = useState<string>('');
  const [events, setEvents] = useState<EventOption[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<InfluencerTab>('discover');
  const [selectedInfluencer, setSelectedInfluencer] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((d) => { if (d.ok && d.user?.id) setOrganizerId(d.user.id); })
      .catch((err) => console.error("Failed to fetch organizer ID:", err));

    fetch('/api/events/my?page_size=50')
      .then((r) => r.json())
      .then((d) => {
        const list = Array.isArray(d.events) ? d.events : Array.isArray(d) ? d : [];
        const opts = list.map((e: any) => ({ id: e.id, title: e.title }));
        setEvents(opts);
        if (opts.length > 0 && !selectedEventId) setSelectedEventId(opts[0].id);
      })
      .catch((err) => console.error("Failed to fetch events:", err));
  }, []);

  const handleInvite = (influencerId: string, influencerName: string) => {
    setSelectedInfluencer({ id: influencerId, name: influencerName });
    setActiveTab('collaborations');
  };

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

      {/* Event selector */}
      <div className="flex items-center gap-3">
        <label className="text-sm font-medium text-neutral-700">Event:</label>
        <select
          value={selectedEventId}
          onChange={e => setSelectedEventId(e.target.value)}
          className="h-10 rounded-xl border border-neutral-200 px-3 text-sm bg-white max-w-xs"
        >
          {events.map(ev => (
            <option key={ev.id} value={ev.id}>{ev.title}</option>
          ))}
        </select>
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
            onInvite={handleInvite}
          />
        </div>
      )}

      {activeTab === 'collaborations' && (
        <div className="space-y-6">
          <InfluencerInviteForm
            organizerId={organizerId}
            eventId={selectedEventId}
            influencerId={selectedInfluencer?.id}
            onSuccess={() => setSelectedInfluencer(null)}
          />
          {selectedInfluencer && (
            <div className="rounded-xl bg-lime/10 border border-lime/20 p-3 flex items-center justify-between">
              <p className="text-sm text-neutral-700">
                Inviting <span className="font-semibold">{selectedInfluencer.name}</span>
              </p>
              <Button variant="outline" size="sm" onClick={() => setSelectedInfluencer(null)}>
                Clear
              </Button>
            </div>
          )}
          <InfluencerCollaboration organizerId={organizerId} />
        </div>
      )}

      {activeTab === 'media-kit' && (
        <MediaKitGenerator eventId={selectedEventId} organizerId={organizerId} />
      )}
    </div>
  );
}
