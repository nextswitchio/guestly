'use client';
import { AlertTriangle } from 'lucide-react';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Icon } from '@/components/ui/Icon';
import ChannelSelector from './ChannelSelector';
import type { Campaign, Channel } from '@/lib/marketing';

interface CampaignBuilderProps {
  organizerId: string;
  eventId?: string;
  onComplete?: (campaign: Campaign) => void;
  onCancel?: () => void;
}

type Step = 'basics' | 'channels' | 'content' | 'schedule' | 'review';

export default function CampaignBuilder({
  organizerId,
  eventId,
  onComplete,
  onCancel,
}: CampaignBuilderProps) {
  const [currentStep, setCurrentStep] = useState<Step>('basics');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    eventId: eventId || '',
    type: 'multi-channel' as Campaign['type'],
    channels: [] as Channel[],
    budget: '',
    scheduledAt: '',
    targetAudience: {
      locations: [] as string[],
      interests: [] as string[],
      ageRange: { min: 18, max: 65 },
    },
  });

  const steps: { id: Step; label: string; icon: string }[] = [
    { id: 'basics', label: 'Basic Info', icon: 'info' },
    { id: 'channels', label: 'Channels', icon: 'megaphone' },
    { id: 'content', label: 'Content', icon: 'edit' },
    { id: 'schedule', label: 'Schedule', icon: 'calendar' },
    { id: 'review', label: 'Review', icon: 'check-circle' },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

  const handleNext = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex].id);
    }
  };

  const handleBack = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex].id);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organizerId,
          ...formData,
          budget: formData.budget ? parseFloat(formData.budget) : undefined,
          scheduledAt: formData.scheduledAt ? new Date(formData.scheduledAt).getTime() : undefined,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        onComplete?.(data.campaign);
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

  const renderStepContent = () => {
    switch (currentStep) {
      case 'basics':
        return (
          <div className="space-y-4">
            <Input
              label="Campaign Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Summer Festival Launch"
              required
            />
            <Textarea
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your campaign goals and strategy"
              rows={4}
            />
            <Input
              label="Budget (Optional)"
              type="number"
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              placeholder="0.00"
              prefix="$"
            />
          </div>
        );

      case 'channels':
        return (
          <div className="space-y-4">
            <p className="text-neutral-500">
              Select the marketing channels you want to use for this campaign
            </p>
            <ChannelSelector
              selectedChannels={formData.channels}
              onChange={(channels) => setFormData({ ...formData, channels })}
            />
          </div>
        );

      case 'content':
        return (
          <div className="space-y-4">
            <p className="text-neutral-500">
              Configure content for each selected channel
            </p>
            {formData.channels.length === 0 ? (
              <Card className="p-8 text-center">
                <span className="text-6xl mb-2 block"><AlertTriangle className="h-4 w-4 inline-block" /></span>
                <p className="text-neutral-500">
                  Please select at least one channel in the previous step
                </p>
              </Card>
            ) : (
              <div className="space-y-4">
                {formData.channels.map((channel) => (
                  <Card key={channel.type} className="p-4">
                    <h4 className="font-semibold mb-2 capitalize">{channel.type} Content</h4>
                    <Textarea
                      placeholder={`Enter ${channel.type} message content...`}
                      rows={3}
                    />
                  </Card>
                ))}
              </div>
            )}
          </div>
        );

      case 'schedule':
        return (
          <div className="space-y-4">
            <div className="flex gap-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setFormData({ ...formData, scheduledAt: '' })}
              >
                <Icon name="play" className="w-5 h-5 mr-2" />
                Send Now
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  const tomorrow = new Date();
                  tomorrow.setDate(tomorrow.getDate() + 1);
                  setFormData({
                    ...formData,
                    scheduledAt: tomorrow.toISOString().slice(0, 16),
                  });
                }}
              >
                <Icon name="clock" className="w-5 h-5 mr-2" />
                Schedule
              </Button>
            </div>
            {formData.scheduledAt && (
              <Input
                label="Scheduled Date & Time"
                type="datetime-local"
                value={formData.scheduledAt}
                onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
              />
            )}
          </div>
        );

      case 'review':
        return (
          <div className="space-y-4">
            <Card className="p-4">
              <h4 className="font-semibold mb-2">Campaign Details</h4>
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="text-neutral-500">Name:</dt>
                  <dd className="font-medium">{formData.name}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-neutral-500">Channels:</dt>
                  <dd className="font-medium">{formData.channels.length}</dd>
                </div>
                {formData.budget && (
                  <div className="flex justify-between">
                    <dt className="text-neutral-500">Budget:</dt>
                    <dd className="font-medium">${formData.budget}</dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-neutral-500">Schedule:</dt>
                  <dd className="font-medium">
                    {formData.scheduledAt
                      ? new Date(formData.scheduledAt).toLocaleString()
                      : 'Send immediately'}
                  </dd>
                </div>
              </dl>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  index <= currentStepIndex
                    ? 'bg-lime text-dark'
                    : 'bg-neutral-200 text-neutral-500'
                }`}
              >
                <Icon name={step.icon as any} className="w-5 h-5" />
              </div>
              <div className="ml-2 flex-1">
                <p
                  className={`text-sm font-medium ${
                    index <= currentStepIndex ? 'text-lime' : 'text-neutral-500'
                  }`}
                >
                  {step.label}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`h-1 flex-1 mx-2 ${
                    index < currentStepIndex ? 'bg-lime' : 'bg-neutral-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <Card className="p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">{steps[currentStepIndex].label}</h2>
        {renderStepContent()}
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={currentStepIndex === 0 ? onCancel : handleBack}>
          {currentStepIndex === 0 ? 'Cancel' : 'Back'}
        </Button>
        <Button
          onClick={currentStepIndex === steps.length - 1 ? handleSubmit : handleNext}
          disabled={loading || (currentStep === 'basics' && !formData.name)}
        >
          {loading ? (
            <Icon name="loader" className="w-5 h-5 animate-spin" />
          ) : currentStepIndex === steps.length - 1 ? (
            'Create Campaign'
          ) : (
            'Next'
          )}
        </Button>
      </div>
    </div>
  );
}
