'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Icon } from '@/components/ui/Icon';
import ChannelSelector from '@/components/marketing/ChannelSelector';
import type { CampaignType, Channel } from '@/lib/marketing';

export default function NewCampaignPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'multi-channel' as CampaignType,
    eventId: '',
    budget: '',
    scheduledAt: '',
  });
  const [selectedChannels, setSelectedChannels] = useState<Channel[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          budget: formData.budget ? parseFloat(formData.budget) : undefined,
          scheduledAt: formData.scheduledAt ? new Date(formData.scheduledAt).getTime() : undefined,
          channels: selectedChannels,
        }),
      });

      if (response.ok) {
        const campaign = await response.json();
        router.push(`/dashboard/marketing/campaigns/${campaign.id}`);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to create campaign');
      }
    } catch (error) {
      console.error('Failed to create campaign:', error);
      alert('Failed to create campaign');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
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
          <h1 className="text-3xl font-bold">Create New Campaign</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Launch a multi-channel marketing campaign
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Campaign Details</h2>
          
          <div className="space-y-4">
            <Input
              label="Campaign Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Summer Festival Promotion"
              required
            />

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your campaign goals and strategy..."
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white min-h-[100px]"
              />
            </div>

            <Input
              label="Event ID (Optional)"
              value={formData.eventId}
              onChange={(e) => setFormData({ ...formData, eventId: e.target.value })}
              placeholder="Link to a specific event"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Budget (Optional)"
                type="number"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                placeholder="0.00"
                min="0"
                step="0.01"
              />

              <Input
                label="Schedule For (Optional)"
                type="datetime-local"
                value={formData.scheduledAt}
                onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
              />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Select Channels</h2>
          <ChannelSelector
            selectedChannels={selectedChannels}
            onChange={setSelectedChannels}
          />
        </Card>

        {/* Actions */}
        <div className="flex gap-3">
          <Button type="submit" disabled={loading || selectedChannels.length === 0}>
            {loading ? 'Creating...' : 'Create Campaign'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
