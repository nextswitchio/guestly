"use client";
import React, { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import CampaignDashboard from "@/components/marketing/CampaignDashboard";
import PromoCodeManager from "@/components/marketing/PromoCodeManager";
import ReferralDashboard from "@/components/marketing/ReferralDashboard";
import AttributionDashboard from "@/components/marketing/analytics/AttributionDashboard";
import { SocialMediaConnector } from "@/components/marketing/SocialMediaConnector";
import { EmailTemplateLibrary } from "@/components/marketing/EmailTemplateLibrary";
import { EmailTemplateBuilder } from "@/components/marketing/EmailTemplateBuilder";
import type { EmailTemplate } from "@/components/marketing/EmailTemplateLibrary";
import { InfluencerDiscovery } from "@/components/marketing/InfluencerDiscovery";
import { InfluencerCollaboration } from "@/components/marketing/InfluencerCollaboration";
import { BlogPostEditor } from "@/components/marketing/BlogPostEditor";
import { ABTestBuilder } from "@/components/marketing/ABTestBuilder";
import { SEOChecklist } from "@/components/marketing/SEOChecklist";
import AdCampaignBuilder from "@/components/marketing/AdCampaignBuilder";
import { SMSCampaignForm } from "@/components/marketing/SMSCampaignForm";
import { PushNotificationForm } from "@/components/marketing/PushNotificationForm";
import CampaignCalendar from "@/components/marketing/CampaignCalendar";
import RetargetingAudienceBuilder from "@/components/marketing/RetargetingAudienceBuilder";
import ViralLoopProgress from "@/components/marketing/ViralLoopProgress";
import ReferralLeaderboard from "@/components/marketing/ReferralLeaderboard";

type MarketingTab = 
  | 'overview'
  | 'campaigns'
  | 'promo-codes'
  | 'referrals'
  | 'analytics'
  | 'social'
  | 'email'
  | 'sms-whatsapp'
  | 'push'
  | 'ads'
  | 'influencers'
  | 'content'
  | 'ab-testing'
  | 'seo'
  | 'calendar'
  | 'retargeting'
  | 'viral-loops';

export default function MarketingPage() {
  const [activeTab, setActiveTab] = useState<MarketingTab>('overview');
  const [organizerId] = useState('org_123');
  const [selectedEventId, setSelectedEventId] = useState('event_123');

  const [customTemplates, setCustomTemplates] = useState<EmailTemplate[]>([]);
  const [showEmailBuilder, setShowEmailBuilder] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);

  const mockEvents = [
    { id: 'event_123', name: 'Summer Music Festival 2024' },
    { id: 'event_456', name: 'Tech Conference Lagos' },
    { id: 'event_789', name: 'Food & Wine Expo' },
  ];

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: 'chart' as const },
    { id: 'campaigns' as const, label: 'Campaigns', icon: 'megaphone' as const },
    { id: 'promo-codes' as const, label: 'Promo Codes', icon: 'ticket' as const },
    { id: 'referrals' as const, label: 'Referrals', icon: 'users' as const },
    { id: 'analytics' as const, label: 'Analytics', icon: 'trending-up' as const },
    { id: 'social' as const, label: 'Social Media', icon: 'sparkles' as const },
    { id: 'email' as const, label: 'Email', icon: 'bell' as const },
    { id: 'sms-whatsapp' as const, label: 'SMS/WhatsApp', icon: 'bell' as const },
    { id: 'push' as const, label: 'Push', icon: 'bell' as const },
    { id: 'ads' as const, label: 'Paid Ads', icon: 'target' as const },
    { id: 'influencers' as const, label: 'Influencers', icon: 'star' as const },
    { id: 'content' as const, label: 'Content', icon: 'document' as const },
    { id: 'ab-testing' as const, label: 'A/B Testing', icon: 'lightbulb' as const },
    { id: 'seo' as const, label: 'SEO', icon: 'search' as const },
    { id: 'calendar' as const, label: 'Calendar', icon: 'calendar' as const },
    { id: 'retargeting' as const, label: 'Retargeting', icon: 'target' as const },
    { id: 'viral-loops' as const, label: 'Viral Loops', icon: 'rocket' as const },
  ];

  const handleSaveEmailTemplate = (template: { name: string; subject: string; blocks: any[] }) => {
    const newTemplate: EmailTemplate = {
      id: `custom-${Date.now()}`,
      name: template.name,
      subject: template.subject,
      category: 'announcement',
      thumbnail: '',
      description: 'Custom template',
      blocks: template.blocks,
      createdAt: Date.now(),
      isCustom: true,
    };
    if (editingTemplate) {
      setCustomTemplates((prev) =>
        prev.map((t) => (t.id === editingTemplate.id ? { ...newTemplate, id: editingTemplate.id } : t))
      );
    } else {
      setCustomTemplates((prev) => [...prev, newTemplate]);
    }
    setShowEmailBuilder(false);
    setEditingTemplate(null);
  };

  const handleSelectEmailTemplate = (template: EmailTemplate) => {
    setEditingTemplate(template);
    setShowEmailBuilder(true);
  };

  const handleDeleteEmailTemplate = (templateId: string) => {
    setCustomTemplates((prev) => prev.filter((t) => t.id !== templateId));
  };

  const handleCreateEmailTemplate = () => {
    setEditingTemplate(null);
    setShowEmailBuilder(true);
  };

  const handleCancelEmailBuilder = () => {
    setShowEmailBuilder(false);
    setEditingTemplate(null);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <MarketingOverview organizerId={organizerId} />;
      case 'campaigns':
        return <CampaignDashboard organizerId={organizerId} />;
      case 'promo-codes':
        return <PromoCodeManager organizerId={organizerId} />;
      case 'referrals':
        return <ReferralDashboard userId={organizerId} />;
      case 'analytics':
        return <AttributionDashboard organizerId={organizerId} />;
      case 'social':
        return <SocialMediaConnector organizerId={organizerId} />;
      case 'email':
        if (showEmailBuilder) {
          return (
            <div className="space-y-4">
              <button
                onClick={handleCancelEmailBuilder}
                className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors"
              >
                <Icon name="arrow-left" size={16} />
                Back to Templates
              </button>
              <EmailTemplateBuilder
                organizerId={organizerId}
                initialTemplate={editingTemplate ? { name: editingTemplate.name, subject: editingTemplate.subject, blocks: editingTemplate.blocks } : undefined}
                onSave={handleSaveEmailTemplate}
                onCancel={handleCancelEmailBuilder}
              />
            </div>
          );
        }
        return (
          <EmailTemplateLibrary
            templates={customTemplates}
            onSelectTemplate={handleSelectEmailTemplate}
            onCreateNew={handleCreateEmailTemplate}
            onDeleteTemplate={handleDeleteEmailTemplate}
          />
        );
      case 'sms-whatsapp':
        return <SMSCampaignForm eventId="" />;
      case 'push':
        return <PushNotificationForm eventId="" />;
      case 'ads':
        return <AdCampaignBuilder organizerId={organizerId} />;
      case 'influencers':
        return (
          <div className="space-y-6">
            <InfluencerDiscovery organizerId={organizerId} onInvite={() => {}} />
            <InfluencerCollaboration organizerId={organizerId} />
          </div>
        );
      case 'content':
        return <BlogPostEditor organizerId={organizerId} onSave={() => {}} onCancel={() => {}} />;
      case 'ab-testing':
        return <ABTestBuilder campaignId="" onCreateTest={async () => {}} />;
      case 'seo':
        return (
          <div className="space-y-6">
            {/* Event Selector */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime/10">
                  <Icon name="search" size={18} className="text-lime" />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium text-neutral-500 mb-1">Analyze Event</label>
                  <select
                    value={selectedEventId}
                    onChange={(e) => setSelectedEventId(e.target.value)}
                    className="w-full h-10 rounded-xl border border-neutral-200 bg-neutral-50 px-3 text-sm text-neutral-900 focus:border-lime focus:bg-white focus:outline-none focus:ring-2 focus:ring-lime/20 transition-all"
                  >
                    {mockEvents.map((event) => (
                      <option key={event.id} value={event.id}>{event.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <SEOChecklist eventId={selectedEventId} eventName={mockEvents.find(e => e.id === selectedEventId)?.name} />
          </div>
        );
      case 'calendar':
        return <CampaignCalendar campaigns={[]} onUpdate={() => {}} />;
      case 'retargeting':
        return <RetargetingAudienceBuilder onSave={() => {}} />;
      case 'viral-loops':
        return (
          <div className="space-y-6">
            <ViralLoopProgress userId={organizerId} eventId="event_123" />
            <ReferralLeaderboard eventId="event_123" />
          </div>
        );
      default:
        return <CampaignDashboard organizerId={organizerId} />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Marketing & Promotion</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Comprehensive marketing tools to grow your events across all channels
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex overflow-x-auto gap-1 pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
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
      <div>{renderContent()}</div>
    </div>
  );
}

// Marketing Overview Component
function MarketingOverview({ organizerId }: { organizerId: string }) {
  const features = [
    { title: 'Multi-Channel Campaigns', description: 'Coordinate marketing across email, SMS, WhatsApp, push, and social media', icon: 'megaphone' as const, color: 'bg-lime/10 text-lime', stats: { active: 5, total: 12 } },
    { title: 'Promo Codes', description: 'Create discount codes and track redemptions', icon: 'ticket' as const, color: 'bg-green-100 text-green-600', stats: { active: 8, redeemed: 234 } },
    { title: 'Referral Program', description: 'Viral growth through attendee referrals', icon: 'users' as const, color: 'bg-blue-100 text-blue-600', stats: { referrals: 156, conversions: 89 } },
    { title: 'Attribution & ROI', description: 'Track conversions and measure campaign performance', icon: 'trending-up' as const, color: 'bg-purple-100 text-purple-600', stats: { roi: '245%', cac: '$12.50' } },
    { title: 'Social Media', description: 'Auto-post to Facebook, Instagram, Twitter, LinkedIn, TikTok', icon: 'sparkles' as const, color: 'bg-pink-100 text-pink-600', stats: { connected: 3, posts: 45 } },
    { title: 'Email Marketing', description: 'Templates, campaigns, and drip sequences', icon: 'bell' as const, color: 'bg-orange-100 text-orange-600', stats: { sent: '12.5K', openRate: '32%' } },
    { title: 'Paid Advertising', description: 'Facebook, Google, and TikTok ad campaigns', icon: 'target' as const, color: 'bg-red-100 text-red-600', stats: { spend: '$2,450', roas: '3.2x' } },
    { title: 'Influencer Collaboration', description: 'Partner with influencers and track performance', icon: 'star' as const, color: 'bg-yellow-100 text-yellow-600', stats: { active: 4, reach: '125K' } },
    { title: 'Content Marketing', description: 'Blog posts and content distribution', icon: 'document' as const, color: 'bg-indigo-100 text-indigo-600', stats: { posts: 23, views: '8.9K' } },
    { title: 'A/B Testing', description: 'Test and optimize marketing variations', icon: 'lightbulb' as const, color: 'bg-teal-100 text-teal-600', stats: { tests: 7, winners: 5 } },
    { title: 'SEO Optimization', description: 'Automatic SEO metadata and sitemaps', icon: 'search' as const, color: 'bg-green-100 text-green-600', stats: { score: 92, indexed: 156 } },
    { title: 'Retargeting', description: 'Re-engage visitors with targeted ads', icon: 'target' as const, color: 'bg-cyan-100 text-cyan-600', stats: { audiences: 5, size: '12K' } },
  ];

  return (
    <div className="space-y-8">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Campaigns', value: '24', change: '↑ 12%', icon: 'megaphone', bg: 'bg-lime/10', color: 'text-lime' },
          { label: 'Total Reach', value: '156K', change: '↑ 28%', icon: 'users', bg: 'bg-blue-100', color: 'text-blue-600' },
          { label: 'Conversions', value: '1,234', change: '↑ 18%', icon: 'trending-up', bg: 'bg-green-100', color: 'text-green-600' },
          { label: 'Average ROI', value: '245%', change: '↑ 34%', icon: 'rocket', bg: 'bg-purple-100', color: 'text-purple-600' },
        ].map((stat, i) => (
          <div key={i} className="rounded-2xl border border-neutral-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-500">{stat.label}</p>
                <p className="text-2xl font-bold text-neutral-900 mt-1">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg}`}>
                <Icon name={stat.icon as any} size={24} className={stat.color} />
              </div>
            </div>
            <p className="text-xs text-green-600 mt-2 font-medium">{stat.change} from last month</p>
          </div>
        ))}
      </div>

      {/* Feature Grid */}
      <div>
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">
          Marketing Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="rounded-2xl border border-neutral-200 bg-white p-6 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${feature.color}`}>
                  <Icon name={feature.icon} size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-neutral-900 mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-neutral-500 mb-3">
                    {feature.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-neutral-500">
                    {Object.entries(feature.stats).map(([key, value]) => (
                      <span key={key}>
                        <span className="font-medium text-neutral-900">{value}</span>{' '}
                        {key}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-2xl bg-lime p-6">
        <h2 className="text-lg font-semibold text-dark mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-dark/10 hover:bg-dark/20 rounded-xl p-4 text-left transition-colors">
            <Icon name="plus" size={20} className="text-dark mb-2" />
            <div className="font-medium text-dark">Create Campaign</div>
            <div className="text-xs text-dark/70 mt-1">Launch a new marketing campaign</div>
          </button>
          <button className="bg-dark/10 hover:bg-dark/20 rounded-xl p-4 text-left transition-colors">
            <Icon name="ticket" size={20} className="text-dark mb-2" />
            <div className="font-medium text-dark">New Promo Code</div>
            <div className="text-xs text-dark/70 mt-1">Create a discount code</div>
          </button>
          <button className="bg-dark/10 hover:bg-dark/20 rounded-xl p-4 text-left transition-colors">
            <Icon name="chart" size={20} className="text-dark mb-2" />
            <div className="font-medium text-dark">View Analytics</div>
            <div className="text-xs text-dark/70 mt-1">Check campaign performance</div>
          </button>
        </div>
      </div>
    </div>
  );
}
