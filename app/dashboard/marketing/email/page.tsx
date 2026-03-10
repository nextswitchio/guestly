'use client';

import { useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { EmailTemplateLibrary } from '@/components/marketing/EmailTemplateLibrary';
import { EmailTemplateBuilder } from '@/components/marketing/EmailTemplateBuilder';
import { EmailCampaignForm } from '@/components/marketing/EmailCampaignForm';
import EmailMetricsPanel from '@/components/marketing/EmailMetricsPanel';

type EmailTab = 'templates' | 'campaigns' | 'metrics';

export default function EmailMarketingPage() {
  const [organizerId] = useState('org_123');
  const [activeTab, setActiveTab] = useState<EmailTab>('templates');
  const [customTemplates, setCustomTemplates] = useState<any[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [showBuilder, setShowBuilder] = useState(false);

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
      // Update existing
      setCustomTemplates(prev => prev.map(t => t.id === template.id ? template : t));
    } else {
      // Add new
      setCustomTemplates(prev => [...prev, { ...template, id: `custom-${Date.now()}`, isCustom: true }]);
    }
    setShowBuilder(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Email Marketing</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Create templates, send campaigns, and track email performance
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex">
            <button
              onClick={() => setActiveTab('templates')}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'templates'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <Icon name="document" className="w-4 h-4" />
              Templates
            </button>
            <button
              onClick={() => setActiveTab('campaigns')}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'campaigns'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <Icon name="megaphone" className="w-4 h-4" />
              Campaigns
            </button>
            <button
              onClick={() => setActiveTab('metrics')}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'metrics'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <Icon name="chart" className="w-4 h-4" />
              Metrics
            </button>
          </div>
        </div>
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
        <EmailCampaignForm organizerId={organizerId} />
      )}

      {activeTab === 'metrics' && (
        <EmailMetricsPanel campaignId="campaign_123" />
      )}
    </div>
  );
}
