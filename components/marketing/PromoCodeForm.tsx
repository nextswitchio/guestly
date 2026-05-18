'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Icon } from '@/components/ui/Icon';

interface Event {
  id: string;
  title: string;
}

interface PromoCodeFormProps {
  organizerId: string;
  eventId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function PromoCodeForm({
  organizerId,
  eventId: initialEventId,
  onSuccess,
  onCancel,
}: PromoCodeFormProps) {
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [formData, setFormData] = useState({
    eventId: initialEventId || '',
    code: '',
    description: '',
    type: 'percentage' as 'percentage' | 'fixed' | 'free',
    value: '',
    usageLimit: '',
    perUserLimit: '',
    expiresAt: '',
    startsAt: '',
    minPurchaseAmount: '',
    maxDiscountAmount: '',
    stackable: false,
  });

  useEffect(() => {
    // Fetch events for the organizer
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events');
        if (response.ok) {
          const data = await response.json();
          // Ensure data is an array
          setEvents(Array.isArray(data) ? data : []);
        } else {
          setEvents([]);
        }
      } catch (error) {
        console.error('Failed to fetch events:', error);
        setEvents([]);
      } finally {
        setLoadingEvents(false);
      }
    };

    fetchEvents();
  }, []);

  const generateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData({ ...formData, code });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch('/api/promo-codes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organizerId,
          eventId: formData.eventId,
          code: formData.code.toUpperCase(),
          description: formData.description,
          type: formData.type,
          value: formData.type === 'free' ? 0 : parseFloat(formData.value),
          usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : undefined,
          perUserLimit: formData.perUserLimit ? parseInt(formData.perUserLimit) : undefined,
          expiresAt: formData.expiresAt ? new Date(formData.expiresAt).getTime() : undefined,
          startsAt: formData.startsAt ? new Date(formData.startsAt).getTime() : undefined,
          minPurchaseAmount: formData.minPurchaseAmount
            ? parseFloat(formData.minPurchaseAmount)
            : undefined,
          maxDiscountAmount: formData.maxDiscountAmount
            ? parseFloat(formData.maxDiscountAmount)
            : undefined,
          stackable: formData.stackable,
        }),
      });

      if (response.ok) {
        onSuccess?.();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to create promo code');
      }
    } catch (error) {
      console.error('Failed to create promo code:', error);
      alert('Failed to create promo code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
      {/* Basic Information Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
          Basic Information
        </h3>
        
        {/* Event Selection */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Event <span className="text-red-500">*</span>
          </label>
          {loadingEvents ? (
            <div className="flex items-center gap-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800">
              <Icon name="loader" className="w-4 h-4 animate-spin" />
              <span className="text-sm text-gray-500">Loading events...</span>
            </div>
          ) : (
            <select
              value={formData.eventId}
              onChange={(e) => setFormData({ ...formData, eventId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
              required
              disabled={!!initialEventId}
            >
              <option value="">Select an event</option>
              {Array.isArray(events) && events.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.title}
                </option>
              ))}
            </select>
          )}
          {initialEventId && (
            <p className="text-xs text-gray-500 mt-1">
              Event is pre-selected and cannot be changed
            </p>
          )}
        </div>

        {/* Code and Description in 2 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Code */}
          <div>
            <label className="block text-sm font-medium mb-1">Promo Code <span className="text-red-500">*</span></label>
            <div className="flex gap-2">
              <Input
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value.toUpperCase() })
                }
                placeholder="SUMMER2024"
                required
                maxLength={20}
                className="flex-1"
              />
              <Button type="button" variant="outline" onClick={generateCode}>
                <Icon name="refresh-cw" className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              4-20 characters, letters and numbers only
            </p>
          </div>

          {/* Type and Value */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium mb-1">Type <span className="text-red-500">*</span></label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    type: e.target.value as typeof formData.type,
                    value: e.target.value === 'free' ? '0' : formData.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm"
                required
              >
                <option value="percentage">% Off</option>
                <option value="fixed">$ Off</option>
                <option value="free">Free</option>
              </select>
            </div>
            {formData.type !== 'free' && (
              <Input
                label="Value"
                type="number"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                placeholder={formData.type === 'percentage' ? '10' : '5.00'}
                leftIcon={formData.type === 'fixed' ? <span className="text-gray-500">$</span> : undefined}
                rightIcon={formData.type === 'percentage' ? <span className="text-gray-500">%</span> : undefined}
                min="0"
                max={formData.type === 'percentage' ? '100' : undefined}
                step={formData.type === 'fixed' ? '0.01' : '1'}
                required
              />
            )}
          </div>
        </div>

        {/* Description */}
        <Textarea
          label="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="e.g., Summer festival early bird discount"
          rows={2}
          required
        />
      </div>

      {/* Usage Limits Section */}
      <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
          Usage Limits
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Total Usage Limit"
            type="number"
            value={formData.usageLimit}
            onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
            placeholder="Unlimited"
            min="1"
          />
          <Input
            label="Per User Limit"
            type="number"
            value={formData.perUserLimit}
            onChange={(e) => setFormData({ ...formData, perUserLimit: e.target.value })}
            placeholder="Unlimited"
            min="1"
          />
        </div>
      </div>

      {/* Date Range Section */}
      <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
          Validity Period
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Start Date"
            type="datetime-local"
            value={formData.startsAt}
            onChange={(e) => setFormData({ ...formData, startsAt: e.target.value })}
          />
          <Input
            label="Expiration Date"
            type="datetime-local"
            value={formData.expiresAt}
            onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
          />
        </div>
      </div>

      {/* Advanced Options Section */}
      <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
          Advanced Options
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Min Purchase Amount"
            type="number"
            value={formData.minPurchaseAmount}
            onChange={(e) => setFormData({ ...formData, minPurchaseAmount: e.target.value })}
            placeholder="0.00"
            prefix="$"
            step="0.01"
            min="0"
          />
          {formData.type === 'percentage' && (
            <Input
              label="Max Discount Amount"
              type="number"
              value={formData.maxDiscountAmount}
              onChange={(e) => setFormData({ ...formData, maxDiscountAmount: e.target.value })}
              placeholder="Unlimited"
              prefix="$"
              step="0.01"
              min="0"
            />
          )}
        </div>

        {/* Stackable */}
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.stackable}
            onChange={(e) => setFormData({ ...formData, stackable: e.target.checked })}
            className="w-4 h-4 text-primary-500 rounded"
          />
          <span className="text-sm">Allow stacking with other promo codes</span>
        </label>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700 sticky bottom-0 bg-white dark:bg-gray-900 pb-2">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading || !formData.eventId || !formData.code || !formData.description}
          className="flex-1"
        >
          {loading ? <Icon name="loader" className="w-5 h-5 animate-spin" /> : 'Create Promo Code'}
        </Button>
      </div>
    </form>
  );
}
