"use client";
import React, { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import CampaignDashboard from "@/components/marketing/CampaignDashboard";
import PromoCodeManager from "@/components/marketing/PromoCodeManager";
import ReferralDashboard from "@/components/marketing/ReferralDashboard";
import AttributionDashboard from "@/components/marketing/analytics/AttributionDashboard";
import { SocialMediaConnector } from "@/components/marketing/SocialMediaConnector";
import { EmailTemplateLibrary } from "@/components/marketing/EmailTemplateLibrary";
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
  const [organizerId] = useState('org_123'); // In real app, get from auth

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: 'chart' as const },
    { id: 'campaigns' as const, label: 'Campaigns', icon: 'megaphone' as const },
    { id: 'promo-codes' as const, label: 'Promo Codes', icon: 'ticket' as const },
    { id: 'referrals' as const, label: 'Referrals', icon: 'users' as const },
    { id: 'analytics' as const, label: 'Analytics', icon: 'trending-up' as const },
    { id: 'social' as const, label: 'Social Media', icon: 'sparkles' as const },
    { id: 'email' as const, label: 'Email', icon: 'bell' as const },
    { id: 'sms-whatsapp' as const, label: 'SMS/WhatsApp', icon: 'bell' as const },
    { id: 'push' as const, label: 'Push Notifications', icon: 'bell' as const },
    { id: 'ads' as const, label: 'Paid Ads', icon: 'target' as const },
    { id: 'influencers' as const, label: 'Influencers', icon: 'star' as const },
    { id: 'content' as const, label: 'Content', icon: 'document' as const },
    { id: 'ab-testing' as const, label: 'A/B Testing', icon: 'lightbulb' as const },
    { id: 'seo' as const, label: 'SEO', icon: 'search' as const },
    { id: 'calendar' as const, label: 'Calendar', icon: 'calendar' as const },
    { id: 'retargeting' as const, label: 'Retargeting', icon: 'target' as const },
    { id: 'viral-loops' as const, label: 'Viral Loops', icon: 'rocket' as const },
  ];

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
        return <EmailTemplateLibrary templates={[]} onSelectTemplate={() => {}} onCreateNew={() => {}} />;
      case 'sms-whatsapp':
        return <SMSCampaignForm eventId="" />;
      case 'push':
        return <PushNotificationForm eventId="" />;
      case 'ads':
        return <AdCampaignBuilder organizerId={organizerId} />;
      case 'influencers':
        return (
          <div className="space-y-6">
            <InfluencerDiscovery 
              organizerId={organizerId}
              onInvite={() => {}} 
            />
            <InfluencerCollaboration organizerId={organizerId} />
          </div>
        );
      case 'content':
        return <BlogPostEditor 
          organizerId={organizerId}
          onSave={() => {}} 
          onCancel={() => {}} 
        />;
      case 'ab-testing':
        return <ABTestBuilder campaignId="" onCreateTest={async () => {}} />;
      case 'seo':
        return <SEOChecklist eventId="event_123" />;
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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Marketing & Promotion</h1>
        <p className="mt-1 text-sm text-[var(--foreground-muted)]">
          Comprehensive marketing tools to grow your events across all channels
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:border-gray-300'
                }`}
              >
                <Icon name={tab.icon} className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div>{renderContent()}</div>
    </div>
  );
}

// Marketing Overview Component
function MarketingOverview({ organizerId }: { organizerId: string }) {
  const features = [
    {
      title: 'Multi-Channel Campaigns',
      description: 'Coordinate marketing across email, SMS, WhatsApp, push, and social media',
      icon: 'megaphone' as const,
      color: 'bg-primary-100 text-primary-600',
      stats: { active: 5, total: 12 },
    },
    {
      title: 'Promo Codes',
      description: 'Create discount codes and track redemptions',
      icon: 'ticket' as const,
      color: 'bg-success-100 text-success-600',
      stats: { active: 8, redeemed: 234 },
    },
    {
      title: 'Referral Program',
      description: 'Viral growth through attendee referrals',
      icon: 'users' as const,
      color: 'bg-blue-100 text-blue-600',
      stats: { referrals: 156, conversions: 89 },
    },
    {
      title: 'Attribution & ROI',
      description: 'Track conversions and measure campaign performance',
      icon: 'trending-up' as const,
      color: 'bg-purple-100 text-purple-600',
      stats: { roi: '245%', cac: '$12.50' },
    },
    {
      title: 'Social Media',
      description: 'Auto-post to Facebook, Instagram, Twitter, LinkedIn, TikTok',
      icon: 'sparkles' as const,
      color: 'bg-pink-100 text-pink-600',
      stats: { connected: 3, posts: 45 },
    },
    {
      title: 'Email Marketing',
      description: 'Templates, campaigns, and drip sequences',
      icon: 'bell' as const,
      color: 'bg-orange-100 text-orange-600',
      stats: { sent: '12.5K', openRate: '32%' },
    },
    {
      title: 'Paid Advertising',
      description: 'Facebook, Google, and TikTok ad campaigns',
      icon: 'target' as const,
      color: 'bg-red-100 text-red-600',
      stats: { spend: '$2,450', roas: '3.2x' },
    },
    {
      title: 'Influencer Collaboration',
      description: 'Partner with influencers and track performance',
      icon: 'star' as const,
      color: 'bg-yellow-100 text-yellow-600',
      stats: { active: 4, reach: '125K' },
    },
    {
      title: 'Content Marketing',
      description: 'Blog posts and content distribution',
      icon: 'document' as const,
      color: 'bg-indigo-100 text-indigo-600',
      stats: { posts: 23, views: '8.9K' },
    },
    {
      title: 'A/B Testing',
      description: 'Test and optimize marketing variations',
      icon: 'lightbulb' as const,
      color: 'bg-teal-100 text-teal-600',
      stats: { tests: 7, winners: 5 },
    },
    {
      title: 'SEO Optimization',
      description: 'Automatic SEO metadata and sitemaps',
      icon: 'search' as const,
      color: 'bg-green-100 text-green-600',
      stats: { score: 92, indexed: 156 },
    },
    {
      title: 'Retargeting',
      description: 'Re-engage visitors with targeted ads',
      icon: 'target' as const,
      color: 'bg-cyan-100 text-cyan-600',
      stats: { audiences: 5, size: '12K' },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Campaigns</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">24</p>
            </div>
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <Icon name="megaphone" className="w-6 h-6 text-primary-600" />
            </div>
          </div>
          <p className="text-xs text-success-600 mt-2">↑ 12% from last month</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Reach</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">156K</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Icon name="users" className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-xs text-success-600 mt-2">↑ 28% from last month</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Conversions</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">1,234</p>
            </div>
            <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
              <Icon name="trending-up" className="w-6 h-6 text-success-600" />
            </div>
          </div>
          <p className="text-xs text-success-600 mt-2">↑ 18% from last month</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Average ROI</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">245%</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Icon name="rocket" className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-xs text-success-600 mt-2">↑ 34% from last month</p>
        </div>
      </div>

      {/* Feature Grid */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Marketing Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${feature.color}`}>
                  <Icon name={feature.icon} className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                    {feature.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
                    {Object.entries(feature.stats).map(([key, value]) => (
                      <span key={key}>
                        <span className="font-medium text-gray-900 dark:text-white">{value}</span>{' '}
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
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg shadow p-6 text-white">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-white/10 hover:bg-white/20 rounded-lg p-4 text-left transition-colors">
            <Icon name="plus" className="w-5 h-5 mb-2" />
            <div className="font-medium">Create Campaign</div>
            <div className="text-xs text-white/80 mt-1">Launch a new marketing campaign</div>
          </button>
          <button className="bg-white/10 hover:bg-white/20 rounded-lg p-4 text-left transition-colors">
            <Icon name="ticket" className="w-5 h-5 mb-2" />
            <div className="font-medium">New Promo Code</div>
            <div className="text-xs text-white/80 mt-1">Create a discount code</div>
          </button>
          <button className="bg-white/10 hover:bg-white/20 rounded-lg p-4 text-left transition-colors">
            <Icon name="chart" className="w-5 h-5 mb-2" />
            <div className="font-medium">View Analytics</div>
            <div className="text-xs text-white/80 mt-1">Check campaign performance</div>
          </button>
        </div>
      </div>
    </div>
  );
}
