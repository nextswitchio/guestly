'use client';
import { RefreshCw, Save, XCircle } from 'lucide-react';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import CloudinaryUploadField from '@/components/ui/CloudinaryUploadField';
import { DEFAULT_PLATFORM_CATALOG, PlatformCatalog, normalizeCatalog } from '@/lib/platformCatalog';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  imageUrl: string;
  capacity: number;
}

export default function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [catalog, setCatalog] = useState<PlatformCatalog>(DEFAULT_PLATFORM_CATALOG);
  const [form, setForm] = useState<Event>({
    id: '',
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: '',
    imageUrl: '',
    capacity: 0,
  });

  useEffect(() => {
    fetchEvent();
  }, [id]);

  useEffect(() => {
    fetch('/api/platform/catalog')
      .then(res => res.json())
      .then(data => setCatalog(normalizeCatalog(data)))
      .catch(() => setCatalog(DEFAULT_PLATFORM_CATALOG));
  }, []);

  const fetchEvent = async () => {
    try {
      const response = await fetch(`/api/events/${id}`);
      if (response.ok) {
        const data = await response.json();
        const event = data.event || data;
        const eventDate = event.date ? new Date(event.date) : null;
        setForm({
          id: event.id,
          title: event.title,
          description: event.description,
          date: eventDate ? eventDate.toISOString().split('T')[0] : '',
          time: eventDate ? eventDate.toISOString().slice(11, 16) : '',
          location: event.location || event.city || event.venue || '',
          category: event.category || '',
          imageUrl: event.imageUrl || event.image || '',
          capacity: event.capacity || 0,
        });
      }
    } catch (error) {
      console.error('Failed to fetch event:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const response = await fetch(`/api/events/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          // Construct a UTC ISO string — backend requires timezone-aware datetime
          date: form.date
            ? new Date(`${form.date}T${form.time || '00:00'}:00Z`).toISOString()
            : undefined,
          category: form.category,
          city: form.location,
          image: form.imageUrl,
          capacity: form.capacity || null,
        }),
      });

      if (response.ok) {
        setSaved(true);
        setTimeout(() => {
          router.push(`/dashboard/events/${id}/manage`);
        }, 1500);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to update event');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="w-8 h-8 animate-spin text-neutral-400" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">Edit Event</h1>
        <p className="text-neutral-500 mt-1">Update your event details</p>
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8">
        {saved ? (
          <div className="text-center py-8">
            <Save className="w-12 h-12 text-lime-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">Event Updated!</h3>
            <p className="text-neutral-500">Redirecting to event management...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Event Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
                rows={5}
                className="w-full px-4 py-3 border border-neutral-200 rounded-xl bg-white text-neutral-900 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-lime/40 focus:border-lime-400"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input
                label="Date"
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                required
              />
              <Input
                label="Time"
                type="time"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
              />
            </div>
            <Input
              label="Location"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              required
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="h-11 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm text-neutral-900 focus:border-lime-400 focus:outline-none focus:ring-2 focus:ring-lime/40"
                >
                  <option value="">Select category</option>
                  {catalog.eventCategories.filter(category => category.isActive).map(category => (
                    <option key={category.slug} value={category.name}>{category.name}</option>
                  ))}
                </select>
              </div>
              <Input
                label="Capacity"
                type="number"
                value={form.capacity.toString()}
                onChange={(e) => setForm({ ...form, capacity: parseInt(e.target.value) || 0 })}
              />
            </div>
            <CloudinaryUploadField
              label="Event Image"
              value={form.imageUrl}
              onChange={(imageUrl) => setForm({ ...form, imageUrl })}
              folder="guestly/events/covers"
              accept="image/*"
              placeholder="Upload event image"
            />

            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-xl">{error}</div>
            )}

            <div className="flex gap-3 pt-2">
              <Button type="submit" loading={saving}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/dashboard/events/${id}/manage`)}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
