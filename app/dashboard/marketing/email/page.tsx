'use client';

import { useState, useEffect } from 'react';
import { Icon } from '@/components/ui/Icon';
import { EmailTemplateLibrary } from '@/components/marketing/EmailTemplateLibrary';
import { EmailTemplateBuilder } from '@/components/marketing/EmailTemplateBuilder';
import { EmailCampaignForm } from '@/components/marketing/EmailCampaignForm';
import EmailMetricsPanel from '@/components/marketing/EmailMetricsPanel';

type EmailTab = 'templates' | 'campaigns' | 'metrics';

export default function EmailMarketingPage() {
  const [organizerId, setOrganizerId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<EmailTab>('templates');
  const [customTemplates, setCustomTemplates] = useState<any[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [showBuilder, setShowBuilder] = useState(false);

  useEffect(() => {
    const cookies = document.cookie.split(";");
    const userIdCookie = cookies.find((c) => c.trim().startsWith("user_id="));
    if (userIdCookie) {
      setOrganizerId(userIdCookie.split("=")[1]);
    }
  }, []);

  const handleSelectTemplate = (template: any) => {
    setSelectedTemplate(template);
    setShowBuilder(true);
  };

  const handleCreateNew = () => {
    setSelectedTemplate(null);
    setShowBuilder(true);
  };

  const handleDeleteTemplate = (templateId: string) => {
    setCustomTemplates(prev => prev.filter(t => t.id !== templateId));
  };

  const handleSaveTemplate = (template: any) => {
    if (template.id) {
      setCustomTemplates(prev => prev.map(t => t.id === template.id ? template : t));
    } else {
      setCustomTemplates(prev => [...prev, { ...template, id: `custom-${Date.now()}`, isCustom: true }]);
    }
    setShowBuilder(false);
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

      {/* Content */}
      {activeTab === 'templates' && (
        <div className="space-y-6">
          {showBuilder ? (
            <EmailTemplateBuilder 
              organizerId={organizerId}
              initialTemplate={selectedTemplate}
              onSave={handleSaveTemplate}
              onCancel={() => setShowBuilder(false)}
            />
          ) : (
            <EmailTemplateLibrary 
              templates={customTemplates}
              onSelectTemplate={handleSelectTemplate}
              onCreateNew={handleCreateNew}
              onDeleteTemplate={handleDeleteTemplate}
            />
          )}
        </div>
      )}

      {activeTab === 'campaigns' && (
        <EmailCampaignForm 
          organizerId={organizerId}
          events={[]}
          templates={[]}
          onSubmit={() => {}}
          onCancel={() => {}}
        />
      )}

      {activeTab === 'metrics' && (
        <EmailMetricsPanel campaignId="campaign_123" />
      )}
    </div>
  );
}
