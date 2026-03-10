'use client';

import { use, useEffect, useState } from 'react';
import VirtualLobbyClient from '@/components/virtual/VirtualLobbyClient';
import type { Event } from '@/lib/events';

export default function EventLobbyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/events/${id}`)
      .then(res => res.json())
      .then(data => {
        setEvent(data.event);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch event:', err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading event...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-xl text-gray-600 dark:text-gray-400">Event not found</p>
        </div>
      </div>
    );
  }

  return <VirtualLobbyClient event={event} />;
}
