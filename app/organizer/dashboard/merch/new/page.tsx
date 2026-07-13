'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';
import Button from '@/components/ui/Button';
import CloudinaryUploadField from '@/components/ui/CloudinaryUploadField';
import { useToast } from '@/components/ui/ToastProvider';

interface EventOption {
  id: string;
  name: string;
  date?: string;
}

export default function NewMerchProductPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState<EventOption[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    imageUrl: '',
    eventId: '',
  });

  useEffect(() => {
    fetch('/api/events/my')
      .then((r) => r.json())
      .then((d) => {
        const list = (d.events || []).map((e: any) => ({
          id: e.id,
          name: e.title || e.name,
          date: e.date,
        }));
        setEvents(list);
      })
      .catch(() => {})
      .finally(() => setEventsLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/merch/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
        }),
      });

      if (response.ok) {
        addToast('Product created successfully!', { type: 'success' });
        router.push('/organizer/dashboard/merch');
      } else {
        const error = await response.json();
        addToast(error.error || 'Failed to create product', { type: 'error' });
      }
    } catch {
      addToast('Failed to create product', { type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors"
        >
          <Icon name="arrow-left" size={16} />
          Back
        </button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">Add New Product</h1>
          <p className="text-neutral-500 mt-1">
            Create a new merchandise item for your events
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">Product Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Event T-Shirt"
              required
              className="w-full h-11 rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-lime focus:bg-white focus:outline-none focus:ring-2 focus:ring-lime/20 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your product..."
              required
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-lime focus:bg-white focus:outline-none focus:ring-2 focus:ring-lime/20 transition-all min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Price (₦)</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="0.00"
                min="0"
                step="0.01"
                required
                className="w-full h-11 rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-lime focus:bg-white focus:outline-none focus:ring-2 focus:ring-lime/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Stock Quantity</label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                placeholder="0"
                min="0"
                required
                className="w-full h-11 rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-lime focus:bg-white focus:outline-none focus:ring-2 focus:ring-lime/20 transition-all"
              />
            </div>
          </div>

          <CloudinaryUploadField
            label="Product Image"
            value={formData.imageUrl}
            onChange={(imageUrl) => setFormData({ ...formData, imageUrl })}
            folder="guestly/merch/products"
            accept="image/*"
            placeholder="Upload product image"
          />

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">Associated Event</label>
            {eventsLoading ? (
              <div className="w-full h-11 rounded-xl border border-neutral-200 bg-neutral-50 px-4 flex items-center">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-lime border-t-transparent" />
              </div>
            ) : events.length === 0 ? (
              <div className="w-full h-11 rounded-xl border border-neutral-200 bg-neutral-50 px-4 flex items-center text-sm text-neutral-400">
                No events found. Create an event first.
              </div>
            ) : (
              <select
                value={formData.eventId}
                onChange={(e) => setFormData({ ...formData, eventId: e.target.value })}
                className="w-full h-11 rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-sm text-neutral-900 focus:border-lime focus:bg-white focus:outline-none focus:ring-2 focus:ring-lime/20 transition-all appearance-none"
              >
                <option value="">Select an event</option>
                {events.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.name}{event.date ? ` — ${new Date(event.date).toLocaleDateString()}` : ''}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" loading={loading}>
              Create Product
            </Button>
            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-xl border border-neutral-200 bg-white px-6 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
