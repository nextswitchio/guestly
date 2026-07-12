'use client';
import { RefreshCw, Save, ArrowLeft, MapPin, Calendar, Settings, Image, Tag } from 'lucide-react';
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import CloudinaryUploadField from '@/components/ui/CloudinaryUploadField';
import { DEFAULT_PLATFORM_CATALOG, PlatformCatalog, normalizeCatalog } from '@/lib/platformCatalog';
import { useToast } from '@/components/ui/ToastProvider';

interface EventData {
  id: string;
  title: string;
  description: string;
  event_type: string;
  date: string;
  end_date: string | null;
  country: string;
  state: string | null;
  city: string;
  venue: string | null;
  latitude: number | null;
  longitude: number | null;
  category: string;
  capacity: number | null;
  image: string;
  banner_image: string | null;
  community: string | null;
  community_type: string | null;
  post_event_merch_sales: boolean;
  post_event_community_access: boolean;
  tags: string[];
  status: string;
}

export default function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [catalog, setCatalog] = useState<PlatformCatalog>(DEFAULT_PLATFORM_CATALOG);
  const { addToast } = useToast();
  const [tagsInput, setTagsInput] = useState('');

  const [form, setForm] = useState<EventData>({
    id: '',
    title: '',
    description: '',
    event_type: 'Physical',
    date: '',
    end_date: null,
    country: '',
    state: null,
    city: '',
    venue: null,
    latitude: null,
    longitude: null,
    category: '',
    capacity: null,
    image: '',
    banner_image: null,
    community: null,
    community_type: null,
    post_event_merch_sales: false,
    post_event_community_access: true,
    tags: [],
    status: 'draft',
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
        const endDate = event.end_date ? new Date(event.end_date) : null;
        setForm({
          id: event.id,
          title: event.title || '',
          description: event.description || '',
          event_type: event.event_type || 'Physical',
          date: eventDate ? eventDate.toISOString().slice(0, 16) : '',
          end_date: endDate ? endDate.toISOString().slice(0, 16) : null,
          country: event.country || '',
          state: event.state || null,
          city: event.city || '',
          venue: event.venue || null,
          latitude: event.latitude ?? null,
          longitude: event.longitude ?? null,
          category: event.category || '',
          capacity: event.capacity ?? null,
          image: event.image || event.imageUrl || '',
          banner_image: event.banner_image || null,
          community: event.community || null,
          community_type: event.community_type || null,
          post_event_merch_sales: event.post_event_merch_sales ?? false,
          post_event_community_access: event.post_event_community_access ?? true,
          tags: event.tags || [],
          status: event.status || 'draft',
        });
        setTagsInput((event.tags || []).join(', '));
      }
    } catch (error) {
      console.error('Failed to fetch event:', error);
    } finally {
      setLoading(false);
    }
  };

  const update = (patch: Partial<EventData>) => setForm(prev => ({ ...prev, ...patch }));

  const countryCities = catalog.cities.filter(c => c.countryName === form.country && c.isActive);
  const stateOptions = Array.from(new Set(countryCities.map(c => c.state).filter(Boolean))) as string[];
  const cityOptions = countryCities.filter(c => !form.state || c.state === form.state);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload: Record<string, unknown> = {
      title: form.title,
      description: form.description,
      event_type: form.event_type,
      category: form.category,
      country: form.country,
      city: form.city,
      image: form.image,
      post_event_merch_sales: form.post_event_merch_sales,
      post_event_community_access: form.post_event_community_access,
      tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean),
    };

    if (form.date) {
      payload.date = new Date(form.date).toISOString();
    }
    if (form.end_date) {
      payload.end_date = new Date(form.end_date).toISOString();
    }
    if (form.state) payload.state = form.state;
    if (form.venue) payload.venue = form.venue;
    if (form.latitude != null) payload.latitude = form.latitude;
    if (form.longitude != null) payload.longitude = form.longitude;
    if (form.capacity != null && form.capacity > 0) payload.capacity = form.capacity;
    if (form.banner_image) payload.banner_image = form.banner_image;
    if (form.community) payload.community = form.community;
    if (form.community_type) payload.community_type = form.community_type;

    try {
      const response = await fetch(`/api/events/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setSaved(true);
        addToast('Event updated successfully!', { type: 'success' });
        setTimeout(() => {
          router.push(`/organizer/dashboard/events/${id}/manage`);
        }, 1500);
      } else {
        const data = await response.json();
        addToast(data.error || 'Failed to update event', { type: 'error' });
      }
    } catch {
      addToast('Network error. Please try again.', { type: 'error' });
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
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push(`/organizer/dashboard/events/${id}/manage`)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-500 transition hover:bg-neutral-50"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Edit Event</h1>
          <p className="text-neutral-500 mt-1">Update your event details</p>
        </div>
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8">
        {saved ? (
          <div className="text-center py-8">
            <Save className="w-12 h-12 text-lime-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">Event Updated!</h3>
            <p className="text-neutral-500">Redirecting to event management...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Event Details */}
            <Section icon={<Settings className="h-4 w-4" />} title="Event Details">
              <Input
                label="Event Title"
                value={form.title}
                onChange={(e) => update({ title: e.target.value })}
                required
                placeholder="e.g., Afrobeats Summer Festival 2026"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Select
                  label="Category"
                  value={form.category}
                  onChange={(e) => update({ category: e.target.value })}
                  options={[
                    { value: '', label: 'Select category' },
                    ...catalog.eventCategories.filter(c => c.isActive).map(c => ({ value: c.name, label: c.name })),
                  ]}
                />
                <Select
                  label="Event Type"
                  value={form.event_type}
                  onChange={(e) => update({ event_type: e.target.value })}
                  options={[
                    { value: 'Physical', label: 'Physical' },
                    { value: 'Virtual', label: 'Virtual' },
                    { value: 'Hybrid', label: 'Hybrid' },
                  ]}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => update({ description: e.target.value })}
                  required
                  rows={5}
                  placeholder="Describe your event, what attendees can expect..."
                  className="w-full px-4 py-3 border border-neutral-200 rounded-xl bg-white text-neutral-900 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-lime/40 focus:border-lime-400"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">Tags</label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="Comma-separated tags (e.g., afrobeats, outdoor, family-friendly)"
                  className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl bg-white text-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-lime/40 focus:border-lime-400"
                />
                <p className="mt-1 text-xs text-neutral-400">Separate tags with commas</p>
              </div>
            </Section>

            {/* Location */}
            <Section icon={<MapPin className="h-4 w-4" />} title="Location">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Select
                  label="Country"
                  value={form.country}
                  onChange={(e) => update({ country: e.target.value, state: null, city: '' })}
                  options={[
                    { value: '', label: 'Select country' },
                    ...catalog.countries.filter(c => c.isActive).map(c => ({ value: c.name, label: c.name })),
                  ]}
                />
                {form.country && stateOptions.length > 0 && (
                  <Select
                    label="State / Region"
                    value={form.state || ''}
                    onChange={(e) => update({ state: e.target.value || null, city: '' })}
                    options={[
                      { value: '', label: 'Select state' },
                      ...stateOptions.map(s => ({ value: s, label: s })),
                    ]}
                  />
                )}
              </div>
              {form.country && (stateOptions.length === 0 || form.state) && (
                <>
                  {cityOptions.length > 0 ? (
                    <Select
                      label="City"
                      value={form.city}
                      onChange={(e) => update({ city: e.target.value })}
                      options={[
                        { value: '', label: 'Select city' },
                        ...cityOptions.map(c => ({ value: c.name, label: c.name })),
                      ]}
                    />
                  ) : (
                    <Input
                      label="City"
                      value={form.city}
                      onChange={(e) => update({ city: e.target.value })}
                      placeholder="Enter city name"
                    />
                  )}
                </>
              )}
              {(form.event_type === 'Physical' || form.event_type === 'Hybrid') && (
                <>
                  <Input
                    label="Venue"
                    value={form.venue || ''}
                    onChange={(e) => update({ venue: e.target.value || null })}
                    placeholder="e.g., Eko Convention Centre, Victoria Island"
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Input
                      label="Community / Campus"
                      value={form.community || ''}
                      onChange={(e) => update({ community: e.target.value || null })}
                      placeholder="e.g., University of Lagos, Tech Community"
                    />
                    <Select
                      label="Community Type"
                      value={form.community_type || ''}
                      onChange={(e) => update({ community_type: e.target.value || null })}
                      options={[
                        { value: '', label: 'Select type' },
                        { value: 'campus', label: 'Campus' },
                        { value: 'neighborhood', label: 'Neighborhood' },
                        { value: 'professional', label: 'Professional' },
                        { value: 'cultural', label: 'Cultural' },
                      ]}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Input
                      label="Latitude"
                      type="number"
                      step="any"
                      value={form.latitude?.toString() || ''}
                      onChange={(e) => update({ latitude: e.target.value ? Number(e.target.value) : null })}
                      placeholder="e.g., 6.4281"
                    />
                    <Input
                      label="Longitude"
                      type="number"
                      step="any"
                      value={form.longitude?.toString() || ''}
                      onChange={(e) => update({ longitude: e.target.value ? Number(e.target.value) : null })}
                      placeholder="e.g., 3.4219"
                    />
                  </div>
                </>
              )}
            </Section>

            {/* Schedule */}
            <Section icon={<Calendar className="h-4 w-4" />} title="Schedule">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input
                  label="Start Date & Time"
                  type="datetime-local"
                  value={form.date}
                  onChange={(e) => update({ date: e.target.value })}
                  required
                />
                <Input
                  label="End Date & Time"
                  type="datetime-local"
                  value={form.end_date || ''}
                  onChange={(e) => update({ end_date: e.target.value || null })}
                />
              </div>
            </Section>

            {/* Capacity */}
            <Section icon={<Tag className="h-4 w-4" />} title="Capacity">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input
                  label="Maximum Capacity"
                  type="number"
                  value={form.capacity?.toString() || ''}
                  onChange={(e) => update({ capacity: e.target.value ? parseInt(e.target.value) : null })}
                  placeholder="Leave empty for unlimited"
                />
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3 rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                  <input
                    type="checkbox"
                    id="postEventCommunityAccess"
                    checked={form.post_event_community_access}
                    onChange={(e) => update({ post_event_community_access: e.target.checked })}
                    className="mt-0.5 h-5 w-5 rounded border-neutral-300 text-lime-600 focus:ring-lime"
                  />
                  <label htmlFor="postEventCommunityAccess" className="flex-1 cursor-pointer">
                    <span className="font-medium text-neutral-900">Keep Community Active After Event</span>
                    <p className="mt-1 text-xs text-neutral-500">Allow attendees to continue discussions and share memories after the event ends</p>
                  </label>
                </div>
                <div className="flex items-start gap-3 rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                  <input
                    type="checkbox"
                    id="postEventMerchSales"
                    checked={form.post_event_merch_sales}
                    onChange={(e) => update({ post_event_merch_sales: e.target.checked })}
                    className="mt-0.5 h-5 w-5 rounded border-neutral-300 text-lime-600 focus:ring-lime"
                  />
                  <label htmlFor="postEventMerchSales" className="flex-1 cursor-pointer">
                    <span className="font-medium text-neutral-900">Keep Merchandise Store Open After Event</span>
                    <p className="mt-1 text-xs text-neutral-500">Allow post-event merchandise sales to attendees and the public</p>
                  </label>
                </div>
              </div>
            </Section>

            {/* Images */}
            <Section icon={<Image className="h-4 w-4" />} title="Images">
              <CloudinaryUploadField
                label="Cover Image"
                value={form.image}
                onChange={(url) => update({ image: url })}
                folder="guestly/events/covers"
                accept="image/*"
                placeholder="Upload event cover image"
              />
              <CloudinaryUploadField
                label="Banner Image (Optional)"
                value={form.banner_image || ''}
                onChange={(url) => update({ banner_image: url || null })}
                folder="guestly/events/banners"
                accept="image/*"
                placeholder="Upload event banner image"
              />
            </Section>

            <div className="flex gap-3 pt-2">
              <Button type="submit" loading={saving}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/organizer/dashboard/events/${id}/manage`)}
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

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-lime/10 text-lime-600">
          {icon}
        </div>
        <h2 className="text-lg font-semibold text-neutral-900">{title}</h2>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}
