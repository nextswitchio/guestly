'use client';

import { useState } from 'react';
import { Icon } from '@/components/ui/Icon';

interface InfluencerInviteFormProps {
  organizerId: string;
  eventId: string;
  influencerId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function InfluencerInviteForm({ organizerId, eventId, influencerId, onSuccess, onCancel }: InfluencerInviteFormProps) {
  const [formData, setFormData] = useState({
    influencerEmail: '',
    influencerName: '',
    message: '',
    compensationType: 'free-tickets',
    compensationValue: '',
    ticketQuantity: '2',
    deliverables: [] as string[],
    deadline: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const deliverableOptions = [
    { id: 'instagram-post', label: 'Instagram Post' },
    { id: 'instagram-story', label: 'Instagram Story' },
    { id: 'twitter-post', label: 'Twitter Post' },
    { id: 'tiktok-video', label: 'TikTok Video' },
    { id: 'youtube-video', label: 'YouTube Video' },
    { id: 'blog-post', label: 'Blog Post' },
  ];

  const handleDeliverableToggle = (deliverableId: string) => {
    setFormData(prev => ({
      ...prev,
      deliverables: prev.deliverables.includes(deliverableId)
        ? prev.deliverables.filter(d => d !== deliverableId)
        : [...prev.deliverables, deliverableId],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/influencers/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId,
          influencerId,
          ...formData,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to send invitation');
      }

      onSuccess?.();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Invite Influencer</h3>
        <p className="text-sm text-gray-600 mt-1">Send a collaboration invitation to an influencer</p>
      </div>

      <div className="p-6 space-y-6">
        {error && (
          <div className="p-4 bg-danger-50 border border-danger-200 rounded-lg flex items-start gap-3">
            <Icon name="alert-triangle" className="w-5 h-5 text-danger-600" />
            <p className="text-sm text-danger-700">{error}</p>
          </div>
        )}

        {/* Influencer Details */}
        {!influencerId && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Influencer Name <span className="text-danger-500">*</span>
              </label>
              <input
                type="text"
                value={formData.influencerName}
                onChange={e => setFormData({ ...formData, influencerName: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Enter influencer name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address <span className="text-danger-500">*</span>
              </label>
              <input
                type="email"
                value={formData.influencerEmail}
                onChange={e => setFormData({ ...formData, influencerEmail: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="influencer@example.com"
              />
            </div>
          </div>
        )}

        {/* Compensation */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Compensation Type <span className="text-danger-500">*</span>
          </label>
          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, compensationType: 'free-tickets' })}
              className={`p-4 border-2 rounded-lg text-center transition-colors ${
                formData.compensationType === 'free-tickets'
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Icon name="ticket" className="w-6 h-6 mx-auto mb-2 text-gray-700" />
              <div className="text-sm font-medium text-gray-900">Free Tickets</div>
            </button>

            <button
              type="button"
              onClick={() => setFormData({ ...formData, compensationType: 'fixed-payment' })}
              className={`p-4 border-2 rounded-lg text-center transition-colors ${
                formData.compensationType === 'fixed-payment'
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Icon name="dollar-sign" className="w-6 h-6 mx-auto mb-2 text-gray-700" />
              <div className="text-sm font-medium text-gray-900">Fixed Payment</div>
            </button>

            <button
              type="button"
              onClick={() => setFormData({ ...formData, compensationType: 'commission' })}
              className={`p-4 border-2 rounded-lg text-center transition-colors ${
                formData.compensationType === 'commission'
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Icon name="percent" className="w-6 h-6 mx-auto mb-2 text-gray-700" />
              <div className="text-sm font-medium text-gray-900">Commission</div>
            </button>
          </div>
        </div>

        {/* Compensation Value */}
        {formData.compensationType === 'free-tickets' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Number of Tickets</label>
            <input
              type="number"
              value={formData.ticketQuantity}
              onChange={e => setFormData({ ...formData, ticketQuantity: e.target.value })}
              min="1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        )}

        {formData.compensationType === 'fixed-payment' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Payment Amount</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                value={formData.compensationValue}
                onChange={e => setFormData({ ...formData, compensationValue: e.target.value })}
                min="0"
                step="0.01"
                className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="0.00"
              />
            </div>
          </div>
        )}

        {formData.compensationType === 'commission' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Commission Rate</label>
            <div className="relative">
              <input
                type="number"
                value={formData.compensationValue}
                onChange={e => setFormData({ ...formData, compensationValue: e.target.value })}
                min="0"
                max="100"
                step="0.1"
                className="w-full pr-8 pl-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="10"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
            </div>
          </div>
        )}

        {/* Deliverables */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Expected Deliverables <span className="text-danger-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            {deliverableOptions.map(option => (
              <label
                key={option.id}
                className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                  formData.deliverables.includes(option.id)
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={formData.deliverables.includes(option.id)}
                  onChange={() => handleDeliverableToggle(option.id)}
                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
                <span className="text-sm font-medium text-gray-900">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Deadline */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Deadline</label>
          <input
            type="date"
            value={formData.deadline}
            onChange={e => setFormData({ ...formData, deadline: e.target.value })}
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Personal Message</label>
          <textarea
            value={formData.message}
            onChange={e => setFormData({ ...formData, message: e.target.value })}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Add a personal message to the influencer..."
          />
        </div>
      </div>

      {/* Actions */}
      <div className="p-6 border-t border-gray-200 flex items-center justify-end gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading || formData.deliverables.length === 0}
          className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Sending...' : 'Send Invitation'}
        </button>
      </div>
    </form>
  );
}
