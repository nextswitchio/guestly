'use client';
import { RefreshCw } from 'lucide-react';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Icon } from '@/components/ui/Icon';
import AdPlatformSelector from './AdPlatformSelector';
import AdTargetingForm from './AdTargetingForm';
import AdCreativeUploader from './AdCreativeUploader';

interface AdCampaignBuilderProps {
  organizerId: string;
  eventId?: string;
  onComplete?: (campaign: any) => void;
  onCancel?: () => void;
}

type Step = 'platform' | 'creative' | 'targeting' | 'budget' | 'review';

export default function AdCampaignBuilder({
  organizerId,
  eventId,
  onComplete,
  onCancel,
}: AdCampaignBuilderProps) {
  const [currentStep, setCurrentStep] = useState<Step>('platform');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    platform: '' as 'facebook' | 'google' | 'tiktok' | '',
    objective: 'conversions' as 'awareness' | 'traffic' | 'conversions' | 'engagement',
    creative: {
      headline: '',
      description: '',
      imageUrl: '',
      callToAction: 'Learn More',
    },
    targeting: {
      locations: [] as string[],
      ageMin: 18,
      ageMax: 65,
      interests: [] as string[],
      behaviors: [] as string[],
    },
    budget: {
      type: 'daily' as 'daily' | 'lifetime',
      amount: '',
      startDate: '',
      endDate: '',
    },
  });

  const steps: { id: Step; label: string; icon: string }[] = [
    { id: 'platform', label: 'Platform', icon: 'target' },
    { id: 'creative', label: 'Creative', icon: 'image' },
    { id: 'targeting', label: 'Targeting', icon: 'users' },
    { id: 'budget', label: 'Budget', icon: 'dollar-sign' },
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
      const response = await fetch('/api/ads/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organizerId,
          eventId: eventId || undefined,
          ...formData,
          budget: {
            ...formData.budget,
            amount: parseFloat(formData.budget.amount),
            startDate: formData.budget.startDate ? new Date(formData.budget.startDate).getTime() : undefined,
            endDate: formData.budget.endDate ? new Date(formData.budget.endDate).getTime() : undefined,
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        onComplete?.(data.campaign);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to create ad campaign');
      }
    } catch (error) {
      console.error('Failed to create ad campaign:', error);
      alert('Failed to create ad campaign');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'platform':
        return (
          <div className="space-y-4">
            <Input
              label="Campaign Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Summer Festival Ticket Sales"
              required
            />
            
            <div>
              <label className="block text-sm font-medium mb-2">Campaign Objective</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'awareness', label: 'Brand Awareness', icon: 'eye' },
                  { value: 'traffic', label: 'Website Traffic', icon: 'external-link' },
                  { value: 'conversions', label: 'Conversions', icon: 'shopping-cart' },
                  { value: 'engagement', label: 'Engagement', icon: 'heart' },
                ].map((obj) => (
                  <button
                    key={obj.value}
                    onClick={() => setFormData({ ...formData, objective: obj.value as any })}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      formData.objective === obj.value
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon name={obj.icon as any} className="w-6 h-6 mx-auto mb-2" />
                    <div className="text-sm font-medium">{obj.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <AdPlatformSelector
              selectedPlatform={formData.platform}
              onChange={(platform) => setFormData({ ...formData, platform })}
            />
          </div>
        );

      case 'creative':
        return (
          <AdCreativeUploader
            creative={formData.creative}
            onChange={(creative) => setFormData({ ...formData, creative })}
          />
        );

      case 'targeting':
        return (
          <AdTargetingForm
            targeting={formData.targeting}
            onChange={(targeting) => setFormData({ ...formData, targeting })}
          />
        );

      case 'budget':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Budget Type</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setFormData({ ...formData, budget: { ...formData.budget, type: 'daily' } })}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData.budget.type === 'daily'
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <Icon name="calendar" className="w-6 h-6 mx-auto mb-2" />
                  <div className="text-sm font-medium">Daily Budget</div>
                  <div className="text-xs text-gray-500 mt-1">Spend per day</div>
                </button>
                <button
                  onClick={() => setFormData({ ...formData, budget: { ...formData.budget, type: 'lifetime' } })}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData.budget.type === 'lifetime'
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <Icon name="trending-up" className="w-6 h-6 mx-auto mb-2" />
                  <div className="text-sm font-medium">Lifetime Budget</div>
                  <div className="text-xs text-gray-500 mt-1">Total campaign spend</div>
                </button>
              </div>
            </div>

            <Input
              label={`${formData.budget.type === 'daily' ? 'Daily' : 'Lifetime'} Budget`}
              type="number"
              value={formData.budget.amount}
              onChange={(e) => setFormData({ ...formData, budget: { ...formData.budget, amount: e.target.value } })}
              placeholder="0.00"
              prefix="$"
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Start Date"
                type="date"
                value={formData.budget.startDate}
                onChange={(e) => setFormData({ ...formData, budget: { ...formData.budget, startDate: e.target.value } })}
                required
              />
              <Input
                label="End Date (Optional)"
                type="date"
                value={formData.budget.endDate}
                onChange={(e) => setFormData({ ...formData, budget: { ...formData.budget, endDate: e.target.value } })}
              />
            </div>

            {formData.budget.amount && (
              <Card className="p-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-3">
                  <Icon name="info" className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div className="text-sm text-blue-900 dark:text-blue-100">
                    <p className="font-medium mb-1">Estimated Results</p>
                    <p>
                      With a ${formData.budget.amount} {formData.budget.type} budget, you can expect:
                    </p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>~{Math.round(parseFloat(formData.budget.amount) * 100)} impressions</li>
                      <li>~{Math.round(parseFloat(formData.budget.amount) * 5)} clicks</li>
                      <li>~{Math.round(parseFloat(formData.budget.amount) * 0.5)} conversions</li>
                    </ul>
                  </div>
                </div>
              </Card>
            )}
          </div>
        );

      case 'review':
        return (
          <div className="space-y-4">
            <Card className="p-4">
              <h4 className="font-semibold mb-3">Campaign Summary</h4>
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="text-gray-600 dark:text-gray-400">Name:</dt>
                  <dd className="font-medium">{formData.name}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600 dark:text-gray-400">Platform:</dt>
                  <dd className="font-medium capitalize">{formData.platform}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600 dark:text-gray-400">Objective:</dt>
                  <dd className="font-medium capitalize">{formData.objective}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600 dark:text-gray-400">Budget:</dt>
                  <dd className="font-medium">
                    ${formData.budget.amount} {formData.budget.type}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600 dark:text-gray-400">Locations:</dt>
                  <dd className="font-medium">{formData.targeting.locations.length || 'All'}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600 dark:text-gray-400">Age Range:</dt>
                  <dd className="font-medium">
                    {formData.targeting.ageMin}-{formData.targeting.ageMax}
                  </dd>
                </div>
              </dl>
            </Card>

            <Card className="p-4">
              <h4 className="font-semibold mb-3">Ad Preview</h4>
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                {formData.creative.imageUrl && (
                  <img
                    src={formData.creative.imageUrl}
                    alt="Ad creative"
                    className="w-full rounded-lg mb-3"
                  />
                )}
                <h5 className="font-semibold mb-1">{formData.creative.headline}</h5>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {formData.creative.description}
                </p>
                <Button size="sm">{formData.creative.callToAction}</Button>
              </div>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 'platform':
        return formData.name && formData.platform;
      case 'creative':
        return formData.creative.headline && formData.creative.description;
      case 'targeting':
        return true;
      case 'budget':
        return formData.budget.amount && formData.budget.startDate;
      case 'review':
        return true;
      default:
        return false;
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
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                }`}
              >
                <Icon name={step.icon as any} className="w-5 h-5" />
              </div>
              <div className="ml-2 flex-1">
                <p
                  className={`text-sm font-medium ${
                    index <= currentStepIndex ? 'text-primary-500' : 'text-gray-500'
                  }`}
                >
                  {step.label}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`h-1 flex-1 mx-2 ${
                    index < currentStepIndex ? 'bg-primary-500' : 'bg-gray-200 dark:bg-gray-700'
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
          disabled={loading || !canProceed()}
        >
          {loading ? (
            <span className="animate-spin inline-block"><RefreshCw className="h-4 w-4 inline-block" /></span>
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
