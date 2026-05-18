'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';

interface SMSCampaignFormProps {
  eventId: string;
  onSubmit?: (data: SMSCampaignData) => void;
  onCancel?: () => void;
}

interface SMSCampaignData {
  name: string;
  message: string;
  scheduledAt?: string;
  segmentId?: string;
  estimatedRecipients: number;
}

export function SMSCampaignForm({ eventId, onSubmit, onCancel }: SMSCampaignFormProps) {
  const [formData, setFormData] = useState<SMSCampaignData>({
    name: '',
    message: '',
    scheduledAt: '',
    segmentId: '',
    estimatedRecipients: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const messageLength = formData.message.length;
  const smsCount = Math.ceil(messageLength / 160);
  const costPerSMS = 0.05; // $0.05 per SMS
  const estimatedCost = formData.estimatedRecipients * smsCount * costPerSMS;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/sms/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId,
          ...formData,
          scheduledAt: formData.scheduledAt ? new Date(formData.scheduledAt).getTime() : undefined,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create SMS campaign');
      }

      const campaign = await response.json();
      onSubmit?.(campaign);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create campaign');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">SMS Campaign Details</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Campaign Name
            </label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Event Reminder SMS"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Message (160 characters per SMS)
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Your event message here..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              rows={4}
              maxLength={480}
              required
            />
            <div className="flex justify-between text-sm mt-1">
              <span className={messageLength > 160 ? 'text-warning-600' : 'text-gray-500'}>
                {messageLength} / 160 characters
              </span>
              <span className="text-gray-500">
                {smsCount} SMS {smsCount > 1 ? 'messages' : 'message'}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Estimated Recipients
            </label>
            <Input
              type="number"
              value={formData.estimatedRecipients}
              onChange={(e) => setFormData({ ...formData, estimatedRecipients: parseInt(e.target.value) || 0 })}
              placeholder="0"
              min="0"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Schedule Send Time (Optional)
            </label>
            <Input
              type="datetime-local"
              value={formData.scheduledAt}
              onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
            />
            <p className="text-sm text-gray-500 mt-1">
              Leave empty to send immediately
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Audience Segment (Optional)
            </label>
            <select
              value={formData.segmentId}
              onChange={(e) => setFormData({ ...formData, segmentId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">All attendees</option>
              <option value="ticket-holders">Ticket holders</option>
              <option value="interested">Interested users</option>
              <option value="past-attendees">Past attendees</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Cost Estimation */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <Icon name="info" className="text-blue-600 mt-1" />
          <div className="flex-1">
            <h4 className="font-semibold text-blue-900 mb-2">Cost Estimation</h4>
            <div className="space-y-1 text-sm text-blue-800">
              <div className="flex justify-between">
                <span>Recipients:</span>
                <span className="font-medium">{formData.estimatedRecipients.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>SMS per recipient:</span>
                <span className="font-medium">{smsCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Cost per SMS:</span>
                <span className="font-medium">${costPerSMS.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-blue-300">
                <span className="font-semibold">Estimated Total:</span>
                <span className="font-bold text-lg">${estimatedCost.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      <div className="flex gap-3 justify-end">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={loading || !formData.name || !formData.message || formData.estimatedRecipients === 0}>
          {loading ? 'Creating...' : formData.scheduledAt ? 'Schedule Campaign' : 'Send Now'}
        </Button>
      </div>
    </form>
  );
}
