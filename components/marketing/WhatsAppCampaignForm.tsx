'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';

interface WhatsAppCampaignFormProps {
  eventId: string;
  onSubmit?: (data: WhatsAppCampaignData) => void;
  onCancel?: () => void;
}

interface WhatsAppCampaignData {
  name: string;
  message: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'document';
  buttons?: WhatsAppButton[];
  scheduledAt?: string;
  segmentId?: string;
  estimatedRecipients: number;
}

interface WhatsAppButton {
  type: 'url' | 'phone' | 'quick_reply';
  text: string;
  value: string;
}

export function WhatsAppCampaignForm({ eventId, onSubmit, onCancel }: WhatsAppCampaignFormProps) {
  const [formData, setFormData] = useState<WhatsAppCampaignData>({
    name: '',
    message: '',
    mediaUrl: '',
    mediaType: undefined,
    buttons: [],
    scheduledAt: '',
    segmentId: '',
    estimatedRecipients: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showMediaOptions, setShowMediaOptions] = useState(false);
  const [showButtonOptions, setShowButtonOptions] = useState(false);

  const costPerMessage = 0.08; // $0.08 per WhatsApp message
  const mediaCost = formData.mediaUrl ? 0.02 : 0; // Additional $0.02 for media
  const estimatedCost = formData.estimatedRecipients * (costPerMessage + mediaCost);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/whatsapp/campaigns', {
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
        throw new Error(data.error || 'Failed to create WhatsApp campaign');
      }

      const campaign = await response.json();
      onSubmit?.(campaign);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create campaign');
    } finally {
      setLoading(false);
    }
  };

  const addButton = () => {
    if (formData.buttons && formData.buttons.length < 3) {
      setFormData({
        ...formData,
        buttons: [...(formData.buttons || []), { type: 'url', text: '', value: '' }],
      });
    }
  };

  const removeButton = (index: number) => {
    setFormData({
      ...formData,
      buttons: formData.buttons?.filter((_, i) => i !== index),
    });
  };

  const updateButton = (index: number, field: keyof WhatsAppButton, value: string) => {
    const newButtons = [...(formData.buttons || [])];
    newButtons[index] = { ...newButtons[index], [field]: value };
    setFormData({ ...formData, buttons: newButtons });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">WhatsApp Campaign Details</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Campaign Name
            </label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Event Announcement WhatsApp"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Message
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Your WhatsApp message here..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              rows={5}
              maxLength={1000}
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              {formData.message.length} / 1000 characters
            </p>
          </div>

          {/* Rich Media Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium">
                Rich Media (Optional)
              </label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowMediaOptions(!showMediaOptions)}
              >
                {showMediaOptions ? 'Hide' : 'Add Media'}
              </Button>
            </div>
            
            {showMediaOptions && (
              <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                <div>
                  <label className="block text-sm mb-1">Media Type</label>
                  <select
                    value={formData.mediaType || ''}
                    onChange={(e) => setFormData({ ...formData, mediaType: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Select type</option>
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                    <option value="document">Document</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-1">Media URL</label>
                  <Input
                    type="url"
                    value={formData.mediaUrl}
                    onChange={(e) => setFormData({ ...formData, mediaUrl: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Interactive Buttons Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium">
                Interactive Buttons (Optional)
              </label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowButtonOptions(!showButtonOptions)}
              >
                {showButtonOptions ? 'Hide' : 'Add Buttons'}
              </Button>
            </div>
            
            {showButtonOptions && (
              <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                {formData.buttons?.map((button, index) => (
                  <div key={index} className="flex gap-2 items-start p-3 bg-white rounded border">
                    <div className="flex-1 space-y-2">
                      <select
                        value={button.type}
                        onChange={(e) => updateButton(index, 'type', e.target.value)}
                        className="w-full px-2 py-1 text-sm border rounded"
                      >
                        <option value="url">URL Button</option>
                        <option value="phone">Call Button</option>
                        <option value="quick_reply">Quick Reply</option>
                      </select>
                      <Input
                        type="text"
                        value={button.text}
                        onChange={(e) => updateButton(index, 'text', e.target.value)}
                        placeholder="Button text"
                      />
                      <Input
                        type="text"
                        value={button.value}
                        onChange={(e) => updateButton(index, 'value', e.target.value)}
                        placeholder={button.type === 'url' ? 'https://...' : button.type === 'phone' ? '+1234567890' : 'Reply text'}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeButton(index)}
                    >
                      <Icon name="x" />
                    </Button>
                  </div>
                ))}
                {(!formData.buttons || formData.buttons.length < 3) && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addButton}
                    className="w-full"
                  >
                    <Icon name="plus" className="mr-2" />
                    Add Button (max 3)
                  </Button>
                )}
              </div>
            )}
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
      <Card className="p-6 bg-green-50 border-green-200">
        <div className="flex items-start gap-3">
          <Icon name="information-circle" className="text-green-600 mt-1" />
          <div className="flex-1">
            <h4 className="font-semibold text-green-900 mb-2">Cost Estimation</h4>
            <div className="space-y-1 text-sm text-green-800">
              <div className="flex justify-between">
                <span>Recipients:</span>
                <span className="font-medium">{formData.estimatedRecipients.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Cost per message:</span>
                <span className="font-medium">${costPerMessage.toFixed(2)}</span>
              </div>
              {formData.mediaUrl && (
                <div className="flex justify-between">
                  <span>Media cost per message:</span>
                  <span className="font-medium">${mediaCost.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-green-300">
                <span className="font-semibold">Estimated Total:</span>
                <span className="font-bold text-lg">${estimatedCost.toFixed(2)}</span>
              </div>
            </div>
            <p className="text-xs text-green-700 mt-2">
              WhatsApp Business API pricing. Includes delivery and read receipts.
            </p>
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
