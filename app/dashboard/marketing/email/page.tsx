'use client';

import { useState, useEffect } from 'react';
import { Icon } from '@/components/ui/Icon';
import Button from '@/components/ui/Button';
import { EmailTemplateLibrary } from '@/components/marketing/EmailTemplateLibrary';
import { EmailTemplateBuilder } from '@/components/marketing/EmailTemplateBuilder';
import { EmailCampaignComposer } from '@/components/marketing/EmailCampaignComposer';
import EmailMetricsPanel from '@/components/marketing/EmailMetricsPanel';
import type { EmailTemplate } from '@/components/marketing/EmailTemplateLibrary';
import type { CampaignSendData } from '@/components/marketing/EmailCampaignComposer';

type EmailTab = 'templates' | 'campaigns' | 'metrics';
type ComposerMode = 'none' | 'builder' | 'composer';

export default function EmailMarketingPage() {
  const [organizerId, setOrganizerId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<EmailTab>('templates');
  const [customTemplates, setCustomTemplates] = useState<EmailTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [composerMode, setComposerMode] = useState<ComposerMode>('none');
  const [sentCampaigns, setSentCampaigns] = useState<CampaignSendData[]>([]);

  useEffect(() => {
    const cookies = document.cookie.split(";");
    const userIdCookie = cookies.find((c) => c.trim().startsWith("user_id="));
    if (userIdCookie) {
      setOrganizerId(userIdCookie.split("=")[1]);
    }
  }, []);

  const handleSelectTemplate = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setComposerMode('composer');
  };

  const handleCreateNew = () => {
    setSelectedTemplate(null);
    setComposerMode('builder');
  };

  const handleDeleteTemplate = (templateId: string) => {
    setCustomTemplates(prev => prev.filter(t => t.id !== templateId));
  };

  const handleSaveTemplate = (template: EmailTemplate) => {
    if (template.id) {
      setCustomTemplates(prev => prev.map(t => t.id === template.id ? template : t));
    } else {
      setCustomTemplates(prev => [...prev, { ...template, id: `custom-${Date.now()}`, isCustom: true }]);
    }
    setComposerMode('none');
    setSelectedTemplate(null);
  };

  const handleSendCampaign = (data: CampaignSendData) => {
    setSentCampaigns(prev => [...prev, data]);
    setComposerMode('none');
    setSelectedTemplate(null);
    setActiveTab('campaigns');
  };

  const handleBackFromComposer = () => {
    setComposerMode('none');
    setSelectedTemplate(null);
  };

  if (!organizerId) {
    return <div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2 border-lime border-t-lime" /></div>;
  }

  const tabs = [
    { id: 'templates' as const, label: 'Templates', icon: 'document' as const },
    { id: 'campaigns' as const, label: 'Campaigns', icon: 'megaphone' as const },
    { id: 'metrics' as const, label: 'Metrics', icon: 'chart' as const },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Email Marketing</h1>
        <p className="text-neutral-500 mt-1">
          Create templates, send campaigns, and track email performance
        </p>
      </div>

      {/* Tabs */}
      {composerMode === 'none' && (
        <div className="flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-lime text-dark'
                  : 'text-neutral-500 hover:bg-neutral-100'
              }`}
            >
              <Icon name={tab.icon} size={16} />
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Content */}
      {activeTab === 'templates' && composerMode === 'none' && (
        <div className="space-y-6">
          <EmailTemplateLibrary 
            templates={customTemplates}
            onSelectTemplate={handleSelectTemplate}
            onCreateNew={handleCreateNew}
            onDeleteTemplate={handleDeleteTemplate}
          />
        </div>
      )}

      {activeTab === 'templates' && composerMode === 'builder' && (
        <EmailTemplateBuilder 
          organizerId={organizerId}
          initialTemplate={selectedTemplate || undefined}
          onSave={handleSaveTemplate}
          onCancel={handleBackFromComposer}
        />
      )}

      {activeTab === 'templates' && composerMode === 'composer' && selectedTemplate && (
        <EmailCampaignComposer
          organizerId={organizerId}
          template={selectedTemplate}
          onBack={handleBackFromComposer}
          onSend={handleSendCampaign}
        />
      )}

      {activeTab === 'campaigns' && (
        <div className="space-y-6">
          {sentCampaigns.length === 0 ? (
            <div className="text-center py-16">
              <Icon name="megaphone" className="w-16 h-16 mx-auto mb-4 text-neutral-300" />
              <h3 className="text-lg font-semibold text-neutral-900">No campaigns yet</h3>
              <p className="text-neutral-500 mt-1 mb-4">Create your first email campaign from the Templates tab</p>
              <Button onClick={() => setActiveTab('templates')} variant="outline">
                Browse Templates
              </Button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-neutral-900">Sent Campaigns</h2>
                <Button onClick={() => setActiveTab('templates')}>
                  <Icon name="plus" className="w-4 h-4 mr-2" />
                  New Campaign
                </Button>
              </div>
              <div className="space-y-3">
                {sentCampaigns.map((campaign, i) => (
                  <div key={i} className="p-4 rounded-xl border border-neutral-200 bg-white flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-neutral-900">{campaign.subject}</p>
                      <p className="text-sm text-neutral-500">
                        {campaign.estimatedRecipients} recipients
                        {campaign.sendImmediately ? ' • Sent immediately' : ` • Scheduled for ${new Date(campaign.scheduledAt!).toLocaleString()}`}
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                      Sent
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {activeTab === 'metrics' && (
        <EmailMetricsPanel campaignId="campaign_123" />
      )}
    </div>
  );
}
