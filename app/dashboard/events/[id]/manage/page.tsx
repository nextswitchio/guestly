'use client';
import { RefreshCw, XCircle } from 'lucide-react';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Tabs } from '@/components/ui/Tabs';
import MobileTabs from '@/components/ui/MobileTabs';

interface Event {
  id: string;
  title: string;
  description: string;
  date: number;
  location: string;
  status: string;
}

export default function ManageEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const response = await fetch(`/api/events/${id}`);
      if (response.ok) {
        const data = await response.json();
        setEvent(data.event);
      }
    } catch (error) {
      console.error('Failed to fetch event:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="text-4xl animate-spin"><RefreshCw className="h-4 w-4 inline-block" /></span>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-2xl mx-auto mt-12">
        <Card className="p-12 text-center">
          <span className="text-6xl mb-4 block"><XCircle className="h-4 w-4 inline-block" /></span>
          <h2 className="text-2xl font-bold mb-2">Event Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            The event you're looking for doesn't exist or has been deleted.
          </p>
          <Button onClick={() => router.push('/dashboard')}>
            Back to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      icon: 'home',
      description: 'Event details and quick actions',
      content: (
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Event Details</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400">Title</label>
                <p className="font-medium">{event.title}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400">Description</label>
                <p className="text-gray-900 dark:text-white">{event.description}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400">Date</label>
                <p className="font-medium">{new Date(event.date).toLocaleDateString()}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400">Location</label>
                <p className="font-medium">{event.location}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400">Status</label>
                <p className="font-medium capitalize">{event.status}</p>
              </div>
            </div>
          </Card>

          <div className="flex gap-3">
            <Button onClick={() => router.push(`/dashboard/events/${id}/edit`)}>
              <Icon name="edit" className="w-4 h-4 mr-2" />
              Edit Event
            </Button>
            <Button variant="outline" onClick={() => router.push(`/events/${id}`)}>
              <Icon name="eye" className="w-4 h-4 mr-2" />
              View Public Page
            </Button>
          </div>
        </div>
      ),
    },
    {
      id: 'tickets',
      label: 'Tickets',
      icon: 'ticket',
      description: 'Manage pricing and availability',
      content: (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Ticket Management</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Manage ticket types, pricing, and availability for this event.
          </p>
          <Button onClick={() => router.push(`/dashboard/events/${id}/tickets`)}>
            Manage Tickets
          </Button>
        </Card>
      ),
    },
    {
      id: 'attendees',
      label: 'Attendees',
      icon: 'users',
      description: 'View registered participants',
      content: (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Attendee List</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            View and manage registered attendees for this event.
          </p>
          <Button onClick={() => router.push(`/dashboard/events/${id}/attendees`)}>
            View Attendees
          </Button>
        </Card>
      ),
    },
    {
      id: 'marketing',
      label: 'Marketing',
      icon: 'megaphone',
      description: 'Promote your event',
      content: (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Marketing Campaigns</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Create and manage marketing campaigns for this event.
          </p>
          <Button onClick={() => router.push(`/dashboard/marketing?eventId=${id}`)}>
            Go to Marketing
          </Button>
        </Card>
      ),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-6">
      {/* Header */}
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
          <h1 className="text-3xl font-bold">{event.title}</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage all aspects of your event
          </p>
        </div>
      </div>

      {/* Tabs */}
      <MobileTabs items={tabs.map(tab => ({ ...tab, title: tab.label }))} defaultTab="overview" />
    </div>
  );
}
