"use client";
import React, { useState, useCallback } from 'react';
import EventPerformanceSummary from '@/components/admin/EventPerformanceSummary';
import EnhancedEventPerformanceTable from '@/components/admin/EnhancedEventPerformanceTable';
import EventDetailsModal from '@/components/admin/EventDetailsModal';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

interface EventFormData {
  title: string;
  description: string;
  event_type: string;
  category: string;
  status: string;
  date: string;
  end_date: string;
  country: string;
  state: string;
  city: string;
  venue: string;
  capacity: string;
  tags: string;
  is_featured: boolean;
  organizer_id?: string;
}

const emptyForm = (): EventFormData => ({
  title: '',
  description: '',
  event_type: 'Physical',
  category: 'Music',
  status: 'draft',
  date: '',
  end_date: '',
  country: 'Nigeria',
  state: '',
  city: '',
  venue: '',
  capacity: '',
  tags: '',
  is_featured: false,
  organizer_id: '',
});

const eventTypes = ['Physical', 'Virtual', 'Hybrid'];
const categories = ['Music', 'Tech', 'Art', 'Food', 'Cultural', 'Faith', 'Entertainment', 'Sports'];
const statuses = ['draft', 'published', 'ongoing', 'completed', 'cancelled'];

function EventFormModal({
  open,
  onClose,
  event,
  onSaved,
}: {
  open: boolean;
  onClose: () => void;
  event?: any;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<EventFormData>(emptyForm());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isEdit = !!event;

  React.useEffect(() => {
    if (event) {
      setForm({
        title: event.title || '',
        description: event.description || '',
        event_type: event.eventType || event.event_type || 'Physical',
        category: event.category || 'Music',
        status: event.status || 'draft',
        date: event.date ? new Date(event.date).toISOString().slice(0, 16) : '',
        end_date: event.end_date || event.endDate ? new Date(event.end_date || event.endDate).toISOString().slice(0, 16) : '',
        country: event.country || 'Nigeria',
        state: event.state || '',
        city: event.city || '',
        venue: event.venue || '',
        capacity: event.capacity ? String(event.capacity) : '',
        tags: Array.isArray(event.tags) ? event.tags.join(', ') : (event.tags || ''),
        is_featured: event.is_featured || event.isFeatured || false,
        organizer_id: event.organizer_id || event.organizerId || '',
      });
    } else {
      setForm(emptyForm());
    }
    setError(null);
  }, [event, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setForm((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload: any = {
      title: form.title,
      description: form.description,
      event_type: form.event_type,
      category: form.category,
      date: new Date(form.date).toISOString(),
      country: form.country,
      city: form.city,
      venue: form.venue || undefined,
      state: form.state || undefined,
      tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      status: form.status,
    };

    if (form.end_date) payload.end_date = new Date(form.end_date).toISOString();
    if (form.capacity) payload.capacity = Number(form.capacity);
    if (form.is_featured) payload.is_featured = true;

    if (!isEdit && form.organizer_id) {
      payload.organizer_id = form.organizer_id;
    }

    const url = isEdit
      ? `/api/admin/events/${event.id}`
      : `/api/admin/events`;

    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Failed to save event');
      }

      onSaved();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-lime focus:ring-1 focus:ring-lime outline-none bg-white";
  const labelClass = "block text-sm font-medium text-slate-700 mb-1";

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit Event' : 'Create Event'} size="xl">
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">{error}</div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Title *</label>
            <input name="title" value={form.title} onChange={handleChange} required className={inputClass} placeholder="Event title" />
          </div>
          <div>
            <label className={labelClass}>Category *</label>
            <select name="category" value={form.category} onChange={handleChange} required className={inputClass}>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className={labelClass}>Description *</label>
          <textarea name="description" value={form.description} onChange={handleChange} required rows={3} className={inputClass} placeholder="Event description" />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Event Type</label>
            <select name="event_type" value={form.event_type} onChange={handleChange} className={inputClass}>
              {eventTypes.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Status</label>
            <select name="status" value={form.status} onChange={handleChange} className={inputClass}>
              {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Featured</label>
            <label className="flex items-center gap-2 h-[42px]">
              <input type="checkbox" name="is_featured" checked={form.is_featured} onChange={handleChange} className="rounded border-slate-300 text-lime focus:ring-lime" />
              <span className="text-sm text-slate-600">Featured event</span>
            </label>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Start Date *</label>
            <input type="datetime-local" name="date" value={form.date} onChange={handleChange} required className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>End Date</label>
            <input type="datetime-local" name="end_date" value={form.end_date} onChange={handleChange} className={inputClass} />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Country *</label>
            <input name="country" value={form.country} onChange={handleChange} required className={inputClass} placeholder="Nigeria" />
          </div>
          <div>
            <label className={labelClass}>State</label>
            <input name="state" value={form.state} onChange={handleChange} className={inputClass} placeholder="Lagos" />
          </div>
          <div>
            <label className={labelClass}>City *</label>
            <input name="city" value={form.city} onChange={handleChange} required className={inputClass} placeholder="Lagos" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Venue</label>
            <input name="venue" value={form.venue} onChange={handleChange} className={inputClass} placeholder="Venue name" />
          </div>
          <div>
            <label className={labelClass}>Capacity</label>
            <input type="number" name="capacity" value={form.capacity} onChange={handleChange} className={inputClass} placeholder="Max attendees" />
          </div>
        </div>

        <div>
          <label className={labelClass}>Tags</label>
          <input name="tags" value={form.tags} onChange={handleChange} className={inputClass} placeholder="tag1, tag2, tag3" />
        </div>

        {!isEdit && (
          <div>
            <label className={labelClass}>Organizer ID (optional)</label>
            <input name="organizer_id" value={form.organizer_id} onChange={handleChange} className={inputClass} placeholder="Leave blank to use your own ID" />
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving...' : isEdit ? 'Update Event' : 'Create Event'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default function AdminEventsPage() {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleEventClick = (eventId: string) => {
    setSelectedEventId(eventId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEventId(null);
  };

  const handleCreateNew = () => {
    setEditingEvent(null);
    setShowEventForm(true);
  };

  const handleEdit = useCallback((event: any) => {
    setEditingEvent(event);
    setShowEventForm(true);
  }, []);

  const handleDelete = useCallback(async (eventId: string) => {
    try {
      const res = await fetch(`/api/admin/events/${eventId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) {
        const err = await res.json();
        alert(err.detail || 'Failed to delete event');
        return;
      }
      setRefreshKey((k) => k + 1);
    } catch (err: any) {
      alert(err.message || 'Failed to delete event');
    }
  }, []);

  const handleSaved = () => {
    setRefreshKey((k) => k + 1);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Event Performance</h1>
          <p className="text-sm text-slate-500">
            Comprehensive breakdown of all events with key performance metrics
          </p>
        </div>
        <Button onClick={handleCreateNew}>+ Create Event</Button>
      </div>

      <EventPerformanceSummary />

      <EnhancedEventPerformanceTable
        key={refreshKey}
        onEventClick={handleEventClick}
        onEventEdit={handleEdit}
        onEventDelete={handleDelete}
      />

      <EventDetailsModal
        eventId={selectedEventId}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      <EventFormModal
        open={showEventForm}
        onClose={() => setShowEventForm(false)}
        event={editingEvent || undefined}
        onSaved={handleSaved}
      />
    </div>
  );
}
