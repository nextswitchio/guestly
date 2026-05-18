'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';

interface PushNotificationFormProps {
  eventId: string;
  onSubmit?: (data: PushNotificationData) => void;
  onCancel?: () => void;
}

interface PushNotificationData {
  name: string;
  title: string;
  message: string;
  imageUrl?: string;
  actionUrl?: string;
  scheduledAt?: string;
  segmentId?: string;
  estimatedRecipients: number;
}

export function PushNotificationForm({ eventId, onSubmit, onCancel }: PushNotificationFormProps) {
  const [formData, setFormData] = useState<PushNotificationData>({
    name: '',
    title: '',
    message: '',
    imageUrl: '',
    actionUrl: '',
    scheduledAt: '',
    segmentId: '',
    estimatedRecipients: 0,
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/push/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId,
          ...formData,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        onSubmit?.(data.campaign);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to create push notification');
      }
    } catch (error) {
      console.error('Failed to create push notification:', error);
      alert('Failed to create push notification');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">Create Push Notification</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Campaign Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., Event Reminder"
          required
        />

        <Input
          label="Notification Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="e.g., Don't miss out!"
          required
        />

        <div>
          <label className="block text-sm font-medium mb-2">Message</label>
          <textarea
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="Your event starts in 1 hour..."
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white min-h-[100px]"
          />
          <p className="text-xs text-gray-500 mt-1">{formData.message.length}/200 characters</p>
        </div>

        <Input
          label="Image URL (Optional)"
          value={formData.imageUrl}
          onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
          placeholder="https://example.com/image.jpg"
        />

        <Input
          label="Action URL (Optional)"
          value={formData.actionUrl}
          onChange={(e) => setFormData({ ...formData, actionUrl: e.target.value })}
          placeholder="https://example.com/event"
        />

        <Input
          label="Schedule For (Optional)"
          type="datetime-local"
          value={formData.scheduledAt}
          onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
        />

        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-start gap-2">
            <Icon name="information-circle" className="w-5 h-5 text-blue-600" />
            <div className="text-sm text-blue-900 dark:text-blue-100">
              <p className="font-medium mb-1">Estimated Reach</p>
              <p>This notification will be sent to approximately {formData.estimatedRecipients.toLocaleString()} users who have enabled push notifications.</p>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="submit" disabled={loading}>
            {loading ? 'Creating...' : formData.scheduledAt ? 'Schedule Notification' : 'Send Now'}
          </Button>
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
}
