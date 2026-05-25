"use client";
import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import CampaignDashboard from "@/components/marketing/CampaignDashboard";
import PromoCodeManager from "@/components/marketing/PromoCodeManager";
import ReferralDashboard from "@/components/marketing/ReferralDashboard";
import AttributionDashboard from "@/components/marketing/analytics/AttributionDashboard";
import { SocialMediaConnector } from "@/components/marketing/SocialMediaConnector";
import { EmailTemplateLibrary } from "@/components/marketing/EmailTemplateLibrary";
import { EmailTemplateBuilder } from "@/components/marketing/EmailTemplateBuilder";
import type { EmailTemplate } from "@/components/marketing/EmailTemplateLibrary";
import type { Campaign } from "@/lib/marketing";
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

function MarketingPageInner() {
  const searchParams = useSearchParams();
  const urlEventId = searchParams.get("eventId") || "";
  const [activeTab, setActiveTab] = useState<MarketingTab>('overview');
  const [organizerId, setOrganizerId] = useState('');
  const [myEvents, setMyEvents] = useState<Array<{ id: string; name: string }>>([]);
  const [selectedEventId, setSelectedEventId] = useState(urlEventId);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  const [customTemplates, setCustomTemplates] = useState<EmailTemplate[]>([]);
  const [showEmailBuilder, setShowEmailBuilder] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);

  const urlEventIdRef = React.useRef(urlEventId);
  urlEventIdRef.current = urlEventId;

  React.useEffect(() => {
    if (!organizerId) return;
    fetch(`/api/campaigns?organizerId=${organizerId}`).then(r => r.json()).then(d => {
      if (d.campaigns) setCampaigns(d.campaigns);
    }).catch(() => {});
  }, [organizerId]);

  React.useEffect(() => {
    fetch("/api/auth/me").then(r => r.json()).then(d => {
      if (d.ok && d.user?.id) setOrganizerId(d.user.id);
    }).catch(() => {});
    fetch("/api/events/my?page_size=50").then(r => r.json()).then(d => {
      const events = Array.isArray(d.events) ? d.events.map((e: any) => ({ id: e.id, name: e.title })) : [];
      setMyEvents(events);
      const urlId = urlEventIdRef.current;
      if (urlId && events.some((e: { id: string }) => e.id === urlId)) {
        setSelectedEventId(urlId);
      } else if (events.length > 0 && !selectedEventId) {
        setSelectedEventId(events[0].id);
      }
    }).catch(() => {});
  }, []);

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

  const handleSaveEmailTemplate = (template: EmailTemplate) => {
    const newTemplate: EmailTemplate = {
      ...template,
      id: editingTemplate?.id || template.id || `custom-${Date.now()}`,
      description: template.description || 'Custom template',
      createdAt: editingTemplate?.createdAt || template.createdAt || Date.now(),
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
        return <PromoCodeManager organizerId={organizerId} eventId={selectedEventId || undefined} />;
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
              <Button
                onClick={handleCancelEmailBuilder}
                variant="outline"
              >
                <Icon name="arrow-left" size={16} />
                Back to Templates
              </Button>
              <EmailTemplateBuilder
                organizerId={organizerId}
                initialTemplate={editingTemplate || undefined}
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
        return <SMSCampaignForm eventId={selectedEventId} onCancel={() => setActiveTab('overview')} />;
      case 'push':
        return <PushNotificationForm eventId={selectedEventId} onCancel={() => setActiveTab('overview')} />;
      case 'ads':
        return <AdCampaignBuilder organizerId={organizerId} eventId={selectedEventId || undefined} />;
      case 'influencers':
        return (
          <div className="space-y-6">
            <InfluencerDiscovery
              organizerId={organizerId}
              onInvite={(influencerId) => {
                fetch('/api/influencers/invite', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ organizerId, influencerId, eventId: selectedEventId }),
                }).catch(() => {});
              }}
            />
            <InfluencerCollaboration organizerId={organizerId} />
          </div>
        );
      case 'content':
        return <BlogPostEditor organizerId={organizerId} eventId={selectedEventId || undefined} onSave={() => setActiveTab('overview')} onCancel={() => setActiveTab('overview')} />;
      case 'ab-testing':
        if (campaigns.length === 0) {
          return (
            <div className="rounded-2xl border border-neutral-200 bg-white p-12 text-center">
              <Icon name="lightbulb" className="w-16 h-16 mx-auto text-neutral-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Campaigns Yet</h3>
              <p className="text-neutral-500 mb-4">Create a campaign first to start A/B testing</p>
              <Button href="/dashboard/marketing/campaigns/new">Create Campaign</Button>
            </div>
          );
        }
        return (
          <ABTestBuilder
            campaignId={campaigns[0].id}
            onCreateTest={async (data) => {
              const res = await fetch('/api/ab-tests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
              });
              if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || 'Failed to create test');
              }
            }}
          />
        );
      case 'seo':
        return (
          <div className="space-y-6">
            <SEOChecklist eventId={selectedEventId} eventName={myEvents.find(e => e.id === selectedEventId)?.name} />
          </div>
        );
      case 'calendar':
        return <CampaignCalendar organizerId={organizerId} onUpdate={() => {}} />;
      case 'retargeting':
        return (
          <RetargetingAudienceBuilder
            onSave={(audience) => {
              fetch('/api/campaigns', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  name: audience.name,
                  type: 'retargeting',
                  organizerId,
                  status: 'active',
                }),
              }).catch(() => {});
            }}
            onCancel={() => setActiveTab('overview')}
          />
        );
      case 'viral-loops':
        return (
          <div className="space-y-6">
            <ViralLoopProgress userId={organizerId} eventId={selectedEventId} />
            <ReferralLeaderboard eventId={selectedEventId} />
          </div>
        );
      default:
        return <CampaignDashboard organizerId={organizerId} />;
    }
  };

  const currentEventName = myEvents.find(e => e.id === selectedEventId)?.name;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Marketing & Promotion</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Comprehensive marketing tools to grow your events across all channels
        </p>
      </div>

      {/* Event Selector */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime/10">
            <Icon name="calendar" size={18} className="text-lime" />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-medium text-neutral-500 mb-1">Event</label>
            <select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="w-full h-10 rounded-xl border border-neutral-200 bg-neutral-50 px-3 text-sm text-neutral-900 focus:border-lime focus:bg-white focus:outline-none focus:ring-2 focus:ring-lime/20 transition-all"
            >
              {myEvents.length === 0 && <option value="">No events yet</option>}
              {myEvents.map((event) => (
                <option key={event.id} value={event.id}>{event.name}</option>
              ))}
            </select>
          </div>
          {currentEventName && (
            <div className="hidden sm:block text-right">
              <p className="text-xs text-neutral-500">Selected Event</p>
              <p className="text-sm font-semibold text-neutral-900">{currentEventName}</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex overflow-x-auto gap-1 pb-2">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            variant={activeTab === tab.id ? 'primary' : 'outline'}
          >
            <Icon name={tab.icon} size={16} />
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Content */}
      <div>{renderContent()}</div>
    </div>
  );
}

export default function MarketingPage() {
  return (
    <Suspense fallback={<div className="p-8 text-sm text-neutral-500">Loading marketing tools...</div>}>
      <MarketingPageInner />
    </Suspense>
  );
}

// Marketing Overview Component
function MarketingOverview({ organizerId }: { organizerId: string }) {
  const [stats, setStats] = useState({ campaigns: 0, promoCodes: 0, referrals: 0 });

  React.useEffect(() => {
    Promise.all([
      fetch(`/api/campaigns?organizerId=${organizerId}`).then(r => r.json()).catch(() => null),
      fetch(`/api/promo-codes?organizerId=${organizerId}`).then(r => r.json()).catch(() => null),
      fetch(`/api/referrals/stats`).then(r => r.json()).catch(() => null),
    ]).then(([campaigns, promos, referrals]) => {
      setStats({
        campaigns: campaigns?.total ?? campaigns?.campaigns?.length ?? 0,
        promoCodes: promos?.total ?? promos?.promoCodes?.length ?? 0,
        referrals: referrals?.totalReferrals ?? 0,
      });
    });
  }, [organizerId]);

  const features = [
    { title: 'Multi-Channel Campaigns', description: 'Coordinate marketing across email, SMS, WhatsApp, push, and social media', icon: 'megaphone' as const, color: 'bg-lime/10 text-lime', stat: `${stats.campaigns} active` },
    { title: 'Promo Codes', description: 'Create discount codes and track redemptions', icon: 'ticket' as const, color: 'bg-green-100 text-green-600', stat: `${stats.promoCodes} codes` },
    { title: 'Referral Program', description: 'Viral growth through attendee referrals', icon: 'users' as const, color: 'bg-blue-100 text-blue-600', stat: `${stats.referrals} referrals` },
    { title: 'Attribution & ROI', description: 'Track conversions and measure campaign performance', icon: 'trending-up' as const, color: 'bg-purple-100 text-purple-600', stat: 'View analytics' },
    { title: 'Social Media', description: 'Auto-post to Facebook, Instagram, Twitter, LinkedIn, TikTok', icon: 'sparkles' as const, color: 'bg-pink-100 text-pink-600', stat: 'Connect accounts' },
    { title: 'Email Marketing', description: 'Templates, campaigns, and drip sequences', icon: 'bell' as const, color: 'bg-orange-100 text-orange-600', stat: 'Create template' },
    { title: 'Paid Advertising', description: 'Facebook, Google, and TikTok ad campaigns', icon: 'target' as const, color: 'bg-red-100 text-red-600', stat: 'Create ad' },
    { title: 'Influencer Collaboration', description: 'Partner with influencers and track performance', icon: 'star' as const, color: 'bg-yellow-100 text-yellow-600', stat: 'Find influencers' },
    { title: 'Content Marketing', description: 'Blog posts and content distribution', icon: 'document' as const, color: 'bg-indigo-100 text-indigo-600', stat: 'Write post' },
    { title: 'A/B Testing', description: 'Test and optimize marketing variations', icon: 'lightbulb' as const, color: 'bg-teal-100 text-teal-600', stat: 'Create test' },
    { title: 'SEO Optimization', description: 'Automatic SEO metadata and sitemaps', icon: 'search' as const, color: 'bg-green-100 text-green-600', stat: 'Check score' },
    { title: 'Retargeting', description: 'Re-engage visitors with targeted ads', icon: 'target' as const, color: 'bg-cyan-100 text-cyan-600', stat: 'Build audience' },
  ];

  return (
    <div className="space-y-8">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Campaigns', value: stats.campaigns.toString(), icon: 'megaphone', bg: 'bg-lime/10', color: 'text-lime' },
          { label: 'Promo Codes', value: stats.promoCodes.toString(), icon: 'ticket', bg: 'bg-blue-100', color: 'text-blue-600' },
          { label: 'Referrals', value: stats.referrals.toString(), icon: 'users', bg: 'bg-green-100', color: 'text-green-600' },
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
          </div>
        ))}
      </div>

      {/* Feature Grid */}
      <div>
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Marketing Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, index) => (
            <div key={index} className="rounded-2xl border border-neutral-200 bg-white p-6 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${feature.color}`}>
                  <Icon name={feature.icon} size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-neutral-900 mb-1">{feature.title}</h3>
                  <p className="text-xs text-neutral-500 mb-3">{feature.description}</p>
                  <span className="text-xs font-medium text-neutral-400">{feature.stat}</span>
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
