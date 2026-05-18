'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Icon from '@/components/ui/Icon';
import type { IconName } from '@/components/ui/Icon';

interface AudienceSegment {
  location?: string[];
  pastAttendance?: boolean;
  ticketType?: string[];
  engagementLevel?: 'high' | 'medium' | 'low';
}

interface EmailCampaignFormData {
  name: string;
  eventId: string;
  templateId: string;
  subject: string;
  previewText: string;
  fromName: string;
  fromEmail: string;
  replyTo: string;
  scheduledAt?: number;
  sendImmediately: boolean;
  targetAudience: AudienceSegment;
  abTestEnabled: boolean;
  abTestSubjects?: string[];
}

interface EmailCampaignFormProps {
  organizerId: string;
  events: Array<{ id: string; name: string }>;
  templates: Array<{ id: string; name: string; subject: string }>;
  onSubmit: (data: EmailCampaignFormData) => void;
  onCancel: () => void;
  initialData?: Partial<EmailCampaignFormData>;
}

export function EmailCampaignForm({
  organizerId,
  events,
  templates,
  onSubmit,
  onCancel,
  initialData,
}: EmailCampaignFormProps) {
  const [formData, setFormData] = useState<EmailCampaignFormData>({
    name: initialData?.name || '',
    eventId: initialData?.eventId || '',
    templateId: initialData?.templateId || '',
    subject: initialData?.subject || '',
    previewText: initialData?.previewText || '',
    fromName: initialData?.fromName || 'Guestly',
    fromEmail: initialData?.fromEmail || 'noreply@guestly.com',
    replyTo: initialData?.replyTo || 'support@guestly.com',
    sendImmediately: initialData?.sendImmediately ?? true,
    scheduledAt: initialData?.scheduledAt,
    targetAudience: initialData?.targetAudience || {},
    abTestEnabled: initialData?.abTestEnabled || false,
    abTestSubjects: initialData?.abTestSubjects || [],
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateField = <K extends keyof EmailCampaignFormData>(
    field: K,
    value: EmailCampaignFormData[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const updateAudience = <K extends keyof AudienceSegment>(
    field: K,
    value: AudienceSegment[K]
  ) => {
    setFormData(prev => ({
      ...prev,
      targetAudience: { ...prev.targetAudience, [field]: value },
    }));
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = 'Campaign name is required';
      if (!formData.eventId) newErrors.eventId = 'Please select an event';
      if (!formData.templateId) newErrors.templateId = 'Please select a template';
    }

    if (step === 2) {
      if (!formData.subject.trim()) newErrors.subject = 'Subject line is required';
      if (!formData.fromName.trim()) newErrors.fromName = 'From name is required';
      if (!formData.fromEmail.trim()) newErrors.fromEmail = 'From email is required';
      if (!formData.replyTo.trim()) newErrors.replyTo = 'Reply-to email is required';
    }

    if (step === 3) {
      if (!formData.sendImmediately && !formData.scheduledAt) {
        newErrors.scheduledAt = 'Please select a schedule time or send immediately';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = () => {
    if (validateStep(currentStep)) {
      onSubmit(formData);
    }
  };

  const steps: Array<{ number: number; title: string; icon: IconName }> = [
    { number: 1, title: 'Campaign Details', icon: 'document' },
    { number: 2, title: 'Email Content', icon: 'megaphone' },
    { number: 3, title: 'Audience & Schedule', icon: 'users' },
    { number: 4, title: 'Review & Send', icon: 'rocket' },
  ];

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                    currentStep >= step.number
                      ? 'bg-lime text-dark'
                      : 'bg-neutral-200 text-neutral-500'
                  }`}
                >
                  {currentStep > step.number ? (
                    <Icon name="check" className="w-5 h-5" />
                  ) : (
                    <Icon name={step.icon} className="w-5 h-5" />
                  )}
                </div>
                <span
                  className={`text-sm mt-2 font-medium ${
                    currentStep >= step.number ? 'text-lime' : 'text-neutral-500'
                  }`}
                >
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`h-0.5 flex-1 mx-4 transition-colors ${
                    currentStep > step.number ? 'bg-lime' : 'bg-neutral-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Step Content */}
      <Card className="p-6">
        {/* Step 1: Campaign Details */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">Campaign Details</h3>
              <p className="text-neutral-500 mb-6">
                Set up the basic information for your email campaign
              </p>
            </div>

            <Input
              label="Campaign Name"
              placeholder="e.g., Summer Festival Announcement"
              value={formData.name}
              onChange={(e) => updateField('name', e.target.value)}
              error={errors.name}
            />

            <div>
              <label className="block text-sm font-medium mb-2">Select Event</label>
              <select
                value={formData.eventId}
                onChange={(e) => updateField('eventId', e.target.value)}
                className={`w-full h-10 rounded-xl border bg-neutral-50 text-neutral-900 px-3.5 transition-all ${
                  errors.eventId
                    ? 'border-red-400'
                    : 'border-neutral-200 hover:border-neutral-300 focus:ring-lime/20 focus:border-lime'
                }`}
              >
                <option value="">Choose an event...</option>
                {events.map(event => (
                  <option key={event.id} value={event.id}>
                    {event.name}
                  </option>
                ))}
              </select>
              {errors.eventId && (
                <p className="text-xs text-red-600 mt-1">{errors.eventId}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Select Template</label>
              <select
                value={formData.templateId}
                onChange={(e) => {
                  const template = templates.find(t => t.id === e.target.value);
                  updateField('templateId', e.target.value);
                  if (template && !formData.subject) {
                    updateField('subject', template.subject);
                  }
                }}
                className={`w-full h-10 rounded-xl border bg-neutral-50 text-neutral-900 px-3.5 transition-all ${
                  errors.templateId
                    ? 'border-red-400'
                    : 'border-neutral-200 hover:border-neutral-300 focus:ring-lime/20 focus:border-lime'
                }`}
              >
                <option value="">Choose a template...</option>
                {templates.map(template => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </select>
              {errors.templateId && (
                <p className="text-xs text-red-600 mt-1">{errors.templateId}</p>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Email Content */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">Email Content</h3>
              <p className="text-neutral-500 mb-6">
                Customize your email subject and sender information
              </p>
            </div>

            <Input
              label="Subject Line"
              placeholder="e.g., Don't miss {{event_name}}!"
              value={formData.subject}
              onChange={(e) => updateField('subject', e.target.value)}
              error={errors.subject}
              hint="Use {{event_name}}, {{event_date}}, {{event_location}} for dynamic content"
            />

            <Input
              label="Preview Text"
              placeholder="This appears in the inbox preview..."
              value={formData.previewText}
              onChange={(e) => updateField('previewText', e.target.value)}
              hint="Optional: Shown in email client previews"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="From Name"
                placeholder="Guestly"
                value={formData.fromName}
                onChange={(e) => updateField('fromName', e.target.value)}
                error={errors.fromName}
              />

              <Input
                label="From Email"
                type="email"
                placeholder="noreply@guestly.com"
                value={formData.fromEmail}
                onChange={(e) => updateField('fromEmail', e.target.value)}
                error={errors.fromEmail}
              />
            </div>

            <Input
              label="Reply-To Email"
              type="email"
              placeholder="support@guestly.com"
              value={formData.replyTo}
              onChange={(e) => updateField('replyTo', e.target.value)}
              error={errors.replyTo}
            />

            <div className="border-t pt-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.abTestEnabled}
                  onChange={(e) => updateField('abTestEnabled', e.target.checked)}
                    className="w-4 h-4 rounded border-neutral-200 text-lime focus:ring-lime/20 focus:border-lime"
                />
                <div>
                  <div className="font-medium">Enable A/B Testing</div>
                  <div className="text-sm text-neutral-500">
                    Test different subject lines to optimize open rates
                  </div>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* Step 3: Audience & Schedule */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">Audience & Schedule</h3>
              <p className="text-neutral-500 mb-6">
                Define your target audience and when to send
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-3">Target Audience</h4>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.targetAudience.pastAttendance || false}
                    onChange={(e) => updateAudience('pastAttendance', e.target.checked)}
                  className="w-4 h-4 rounded border-neutral-200 text-lime focus:ring-lime/20 focus:border-lime"
                  />
                  <span>Past attendees only</span>
                </label>

                <div>
                  <label className="block text-sm font-medium mb-2">Engagement Level</label>
                  <select
                    value={formData.targetAudience.engagementLevel || ''}
                    onChange={(e) =>
                      updateAudience(
                        'engagementLevel',
                        e.target.value as 'high' | 'medium' | 'low' | undefined
                      )
                    }
                    className="w-full h-10 rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-900 px-3.5"
                  >
                    <option value="">All engagement levels</option>
                    <option value="high">High engagement</option>
                    <option value="medium">Medium engagement</option>
                    <option value="low">Low engagement</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h4 className="font-medium mb-3">Schedule</h4>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    checked={formData.sendImmediately}
                    onChange={() => {
                      updateField('sendImmediately', true);
                      updateField('scheduledAt', undefined);
                    }}
                    className="w-4 h-4 border-neutral-200 text-lime focus:ring-lime/20 focus:border-lime"
                  />
                  <div>
                    <div className="font-medium">Send Immediately</div>
                    <div className="text-sm text-neutral-500">
                      Campaign will be sent as soon as you confirm
                    </div>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    checked={!formData.sendImmediately}
                    onChange={() => updateField('sendImmediately', false)}
                    className="w-4 h-4 border-neutral-200 text-lime focus:ring-lime/20 focus:border-lime"
                  />
                  <div className="flex-1">
                    <div className="font-medium mb-2">Schedule for Later</div>
                    {!formData.sendImmediately && (
                      <input
                        type="datetime-local"
                        value={
                          formData.scheduledAt
                            ? new Date(formData.scheduledAt).toISOString().slice(0, 16)
                            : ''
                        }
                        onChange={(e) =>
                          updateField('scheduledAt', new Date(e.target.value).getTime())
                        }
                    className="w-full h-10 rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-900 px-3.5"
                      />
                    )}
                  </div>
                </label>
                {errors.scheduledAt && (
                  <p className="text-xs text-red-600">{errors.scheduledAt}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Review & Send */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">Review & Send</h3>
              <p className="text-neutral-500 mb-6">
                Review your campaign details before sending
              </p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 p-4 bg-neutral-50 rounded-2xl">
                <div>
                  <div className="text-sm text-neutral-500">Campaign Name</div>
                  <div className="font-medium">{formData.name}</div>
                </div>
                <div>
                  <div className="text-sm text-neutral-500">Event</div>
                  <div className="font-medium">
                    {events.find(e => e.id === formData.eventId)?.name || 'N/A'}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-neutral-500">Template</div>
                  <div className="font-medium">
                    {templates.find(t => t.id === formData.templateId)?.name || 'N/A'}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-neutral-500">Schedule</div>
                  <div className="font-medium">
                    {formData.sendImmediately
                      ? 'Send Immediately'
                      : formData.scheduledAt
                      ? new Date(formData.scheduledAt).toLocaleString()
                      : 'N/A'}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-neutral-50 rounded-2xl">
                <div className="text-sm text-neutral-500 mb-1">Subject Line</div>
                <div className="font-medium">{formData.subject}</div>
              </div>

              <div className="p-4 bg-neutral-50 rounded-2xl">
                <div className="text-sm text-neutral-500 mb-1">From</div>
                <div className="font-medium">
                  {formData.fromName} &lt;{formData.fromEmail}&gt;
                </div>
              </div>

              {formData.abTestEnabled && (
                <div className="p-4 bg-lime/10 rounded-2xl border border-lime/20">
                  <div className="flex items-center gap-2 text-lime">
                    <Icon name="sparkles" className="w-4 h-4" />
                    <span className="font-medium">A/B Testing Enabled</span>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200">
              <div className="flex gap-3">
                <Icon name="bell" className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-amber-800">
                  <div className="font-medium mb-1">Before you send</div>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Double-check your subject line for typos</li>
                    <li>Verify the event details are correct</li>
                    <li>Ensure your audience targeting is appropriate</li>
                    <li>Test links in your email template</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t">
          <div>
            {currentStep > 1 && (
              <Button variant="outline" onClick={handleBack}>
                <Icon name="arrow-left" className="w-4 h-4 mr-2" />
                Back
              </Button>
            )}
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
            {currentStep < 4 ? (
              <Button onClick={handleNext}>
                Next
                <Icon name="arrow-right" className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleSubmit}>
                <Icon name="rocket" className="w-4 h-4 mr-2" />
                {formData.sendImmediately ? 'Send Campaign' : 'Schedule Campaign'}
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
