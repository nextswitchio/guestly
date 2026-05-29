"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { LineChart, BarChart, DonutChart } from '@/components/charts';
import { formatCurrency, formatDate, formatPercentage } from '@/lib/utils';

// Types for Advertising Data
type AdCampaignStatus = "draft" | "active" | "paused" | "completed" | "cancelled";
type AdCampaignType = "display" | "sponsored" | "native" | "video";
type AdBiddingType = "cpm" | "cpc" | "cpa" | "fixed";
type AdTargetingType = "all" | "by_category" | "by_location" | "by_interest" | "by_demographic" | "retargeting";

interface AdCampaign {
  id: string;
  name: string;
  description: string;
  campaign_type: AdCampaignType;
  status: AdCampaignStatus;
  budget: number;
  spent: number;
  daily_budget: number | null;
  bidding_type: AdBiddingType;
  bid_amount: number;
  start_date: string;
  end_date: string;
  impressions: number;
  clicks: number;
  conversions: number;
  ctr: number;
  cpm: number;
  cpc: number;
  roi: number;
  created_at: string;
}

interface AdPerformance {
  label: string;
  impressions: number;
  clicks: number;
  conversions: number;
  spent: number;
  date: string;
}

interface AdAnalytics {
  totalSpent: number;
  totalImpressions: number;
  totalClicks: number;
  totalConversions: number;
  averageCtr: number;
  averageCpc: number;
  averageCpm: number;
  roi: number;
}

interface AdCampaignFormData {
  name: string;
  description: string;
  campaign_type: AdCampaignType;
  budget: number;
  daily_budget: number | null;
  bidding_type: AdBiddingType;
  bid_amount: number;
  start_date: string;
  end_date: string;
  targeting_type: AdTargetingType;
  target_categories: string[];
  target_locations: string[];
  target_interests: string[];
}

const CAMPAIGN_TYPES: AdCampaignType[] = ["display", "sponsored", "native", "video"];
const BIDDING_TYPES: AdBiddingType[] = ["cpm", "cpc", "cpa", "fixed"];
const TARGETING_TYPES: AdTargetingType[] = ["all", "by_category", "by_location", "by_interest", "by_demographic", "retargeting"];

const CAMPAIGN_STATUS_COLORS: Record<AdCampaignStatus, string> = {
  draft: "bg-neutral-100 text-neutral-600",
  active: "bg-green-100 text-green-700",
  paused: "bg-amber-100 text-amber-700",
  completed: "bg-blue-100 text-blue-700",
  cancelled: "bg-red-100 text-red-700",
};

const CAMPAIGN_STATUS_ICONS: Record<AdCampaignStatus, string> = {
  draft: "file-text",
  active: "play-circle",
  paused: "pause-circle",
  completed: "check-circle",
  cancelled: "x-circle",
};

const CAMPAIGN_TYPE_LABELS: Record<AdCampaignType, string> = {
  display: "Display Ads",
  sponsored: "Sponsored Content",
  native: "Native Ads",
  video: "Video Ads",
};

const BIDDING_TYPE_LABELS: Record<AdBiddingType, string> = {
  cpm: "CPM (Cost per 1000 Impressions)",
  cpc: "CPC (Cost per Click)",
  cpa: "CPA (Cost per Acquisition)",
  fixed: "Fixed Price",
};

// Campaign Creation Form Component
function CreateCampaignForm({ 
  onSubmit, 
  onCancel,
  initialData = null
}: { 
  onSubmit: (data: AdCampaignFormData) => void;
  onCancel: () => void;
  initialData?: Partial<AdCampaignFormData> | null;
}) {
  const [formData, setFormData] = useState<AdCampaignFormData>({
    name: "",
    description: "",
    campaign_type: "display",
    budget: 10000,
    daily_budget: null,
    bidding_type: "cpm",
    bid_amount: 500,
    start_date: formatDate(new Date().toISOString(), true),
    end_date: formatDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), true),
    targeting_type: "all",
    target_categories: [],
    target_locations: [],
    target_interests: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({ ...formData, ...initialData });
    }
  }, [initialData]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Campaign name is required";
    if (formData.budget <= 0) newErrors.budget = "Budget must be greater than 0";
    if (formData.bid_amount <= 0) newErrors.bid_amount = "Bid amount must be greater than 0";
    if (new Date(formData.end_date) <= new Date(formData.start_date)) {
      newErrors.end_date = "End date must be after start date";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Campaign Basics */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-neutral-900">Campaign Basics</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Campaign Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full p-3 border rounded-lg ${
                errors.name ? "border-red-500" : "border-neutral-300"
              }`}
              placeholder="My Advertising Campaign"
            />
            {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Campaign Type
            </label>
            <select
              value={formData.campaign_type}
              onChange={(e) => setFormData({ ...formData, campaign_type: e.target.value as AdCampaignType })}
              className="w-full p-3 border border-neutral-300 rounded-lg"
            >
              {CAMPAIGN_TYPES.map((type) => (
                <option key={type} value={type}>{CAMPAIGN_TYPE_LABELS[type]}</option>
              ))}
            </select>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-3 border border-neutral-300 rounded-lg h-24 resize-none"
              placeholder="Describe your campaign goals and target audience..."
            />
          </div>
        </div>
      </div>

      {/* Budget & Bidding */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-neutral-900">Budget & Bidding</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Total Budget (NGN) *
            </label>
            <input
              type="number"
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: parseFloat(e.target.value) || 0 })}
              min={1}
              className={`w-full p-3 border rounded-lg ${
                errors.budget ? "border-red-500" : "border-neutral-300"
              }`}
              placeholder="10000"
            />
            {errors.budget && <p className="text-sm text-red-500 mt-1">{errors.budget}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Daily Budget (NGN)
            </label>
            <input
              type="number"
              value={formData.daily_budget || ""}
              onChange={(e) => setFormData({ 
                ...formData, 
                daily_budget: e.target.value ? parseFloat(e.target.value) : null 
              })}
              min={0}
              className="w-full p-3 border border-neutral-300 rounded-lg"
              placeholder="Optional"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Bidding Type
            </label>
            <select
              value={formData.bidding_type}
              onChange={(e) => setFormData({ ...formData, bidding_type: e.target.value as AdBiddingType })}
              className="w-full p-3 border border-neutral-300 rounded-lg"
            >
              {BIDDING_TYPES.map((type) => (
                <option key={type} value={type}>{BIDDING_TYPE_LABELS[type]}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Bid Amount (NGN) *
            </label>
            <input
              type="number"
              value={formData.bid_amount}
              onChange={(e) => setFormData({ ...formData, bid_amount: parseFloat(e.target.value) || 0 })}
              min={1}
              step={0.01}
              className={`w-full p-3 border rounded-lg ${
                errors.bid_amount ? "border-red-500" : "border-neutral-300"
              }`}
              placeholder="500"
            />
            {errors.bid_amount && <p className="text-sm text-red-500 mt-1">{errors.bid_amount}</p>}
          </div>
        </div>
      </div>

      {/* Schedule */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-neutral-900">Schedule</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Start Date *
            </label>
            <input
              type="datetime-local"
              value={formData.start_date}
              onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
              className="w-full p-3 border border-neutral-300 rounded-lg"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              End Date *
            </label>
            <input
              type="datetime-local"
              value={formData.end_date}
              onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
              className={`w-full p-3 border rounded-lg ${
                errors.end_date ? "border-red-500" : "border-neutral-300"
              }`}
            />
            {errors.end_date && <p className="text-sm text-red-500 mt-1">{errors.end_date}</p>}
          </div>
        </div>
      </div>

      {/* Targeting */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-neutral-900">Targeting</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Targeting Type
            </label>
            <select
              value={formData.targeting_type}
              onChange={(e) => setFormData({ ...formData, targeting_type: e.target.value as AdTargetingType })}
              className="w-full p-3 border border-neutral-300 rounded-lg"
            >
              {TARGETING_TYPES.map((type) => (
                <option key={type} value={type}>{type.replace('_', ' ').toUpperCase()}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Target Categories
            </label>
            <input
              type="text"
              value={formData.target_categories.join(', ')}
              onChange={(e) => setFormData({ 
                ...formData, 
                target_categories: e.target.value.split(',').map(s => s.trim()) 
              })}
              className="w-full p-3 border border-neutral-300 rounded-lg"
              placeholder="music, sports, technology"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Target Locations
            </label>
            <input
              type="text"
              value={formData.target_locations.join(', ')}
              onChange={(e) => setFormData({ 
                ...formData, 
                target_locations: e.target.value.split(',').map(s => s.trim()) 
              })}
              className="w-full p-3 border border-neutral-300 rounded-lg"
              placeholder="Lagos, Abuja, Port Harcourt"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Target Interests
            </label>
            <input
              type="text"
              value={formData.target_interests.join(', ')}
              onChange={(e) => setFormData({ 
                ...formData, 
                target_interests: e.target.value.split(',').map(s => s.trim()) 
              })}
              className="w-full p-3 border border-neutral-300 rounded-lg"
              placeholder="concerts, festivals, workshops"
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4 justify-end pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {initialData ? "Update Campaign" : "Create Campaign"}
        </Button>
      </div>
    </form>
  );
}

// Campaign Card Component
function AdCampaignCard({ 
  campaign, 
  onEdit, 
  onPause, 
  onResume, 
  onDelete,
  onView
}: { 
  campaign: AdCampaign;
  onEdit: (campaign: AdCampaign) => void;
  onPause: (campaign: AdCampaign) => void;
  onResume: (campaign: AdCampaign) => void;
  onDelete: (campaign: AdCampaign) => void;
  onView: (campaign: AdCampaign) => void;
}) {
  const progress = Math.min((campaign.spent / campaign.budget) * 100, 100);
  const ctr = campaign.clicks > 0 && campaign.impressions > 0 
    ? (campaign.clicks / campaign.impressions) * 100 
    : 0;
  const isActive = campaign.status === "active";
  const isPaused = campaign.status === "paused";
  const isCompleted = campaign.status === "completed";

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-neutral-900">{campaign.name}</h3>
            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
              CAMPAIGN_STATUS_COLORS[campaign.status]
            }`}>
              {campaign.status.toUpperCase()}
            </span>
          </div>
          <p className="text-sm text-neutral-500 truncate">{campaign.description}</p>
        </div>
        <Icon name={CAMPAIGN_STATUS_ICONS[campaign.status]} size={20} className="text-neutral-400" />
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-neutral-400">Budget</p>
            <p className="font-semibold text-neutral-900">{formatCurrency(campaign.budget)}</p>
          </div>
          <div>
            <p className="text-xs text-neutral-400">Spent</p>
            <p className="font-semibold text-neutral-900">{formatCurrency(campaign.spent)}</p>
          </div>
          <div>
            <p className="text-xs text-neutral-400">Impressions</p>
            <p className="font-semibold text-neutral-900">{campaign.impressions.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-neutral-400">Clicks</p>
            <p className="font-semibold text-neutral-900">{campaign.clicks.toLocaleString()}</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-neutral-500">CTR</span>
            <span className="font-semibold text-neutral-900">{formatPercentage(ctr)}</span>
          </div>
          <div className="w-full bg-neutral-200 rounded-full h-2">
            <div
              className="bg-primary-500 h-2 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-xs text-neutral-500 text-right">
            {formatPercentage(progress / 100)} of budget used
          </p>
        </div>
      </div>

      <div className="flex gap-2 mt-4 pt-4 border-t border-neutral-100">
        <Button size="sm" variant="secondary" onClick={() => onView(campaign)}>
          <Icon name="eye" size={14} /> View
        </Button>
        {campaign.status === "draft" && (
          <Button size="sm" onClick={() => onEdit(campaign)}>
            <Icon name="edit-3" size={14} /> Edit
          </Button>
        )}
        {isActive && (
          <Button size="sm" variant="amber" onClick={() => onPause(campaign)}>
            <Icon name="pause" size={14} /> Pause
          </Button>
        )}
        {isPaused && (
          <Button size="sm" onClick={() => onResume(campaign)}>
            <Icon name="play" size={14} /> Resume
          </Button>
        )}
        {(!isActive && !isPaused && !isCompleted) && (
          <Button size="sm" variant="red" onClick={() => onDelete(campaign)}>
            <Icon name="trash-2" size={14} /> Delete
          </Button>
        )}
      </div>
    </Card>
  );
}

// Campaign Details Modal
function CampaignDetailsModal({ 
  campaign, 
  performance,
  analytics,
  onClose
}: { 
  campaign: AdCampaign;
  performance: AdPerformance[];
  analytics: AdAnalytics;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-neutral-900">Campaign Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <Icon name="x" size={24} />
          </button>
        </div>

        {/* Campaign Overview */}
        <div className="grid gap-6 lg:grid-cols-3 mb-8">
          <div className="lg:col-span-2">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">{campaign.name}</h3>
            <p className="text-neutral-500 mb-4">{campaign.description}</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-neutral-50 rounded-xl">
                <p className="text-sm text-neutral-400">Status</p>
                <p className={`font-semibold capitalized ${
                  CAMPAIGN_STATUS_COLORS[campaign.status]
                }`}>
                  {campaign.status}
                </p>
              </div>
              <div className="p-4 bg-neutral-50 rounded-xl">
                <p className="text-sm text-neutral-400">Type</p>
                <p className="font-semibold text-neutral-900">
                  {CAMPAIGN_TYPE_LABELS[campaign.campaign_type]}
                </p>
              </div>
              <div className="p-4 bg-neutral-50 rounded-xl">
                <p className="text-sm text-neutral-400">Bidding</p>
                <p className="font-semibold text-neutral-900">
                  {BIDDING_TYPE_LABELS[campaign.bidding_type]}
                </p>
              </div>
              <div className="p-4 bg-neutral-50 rounded-xl">
                <p className="text-sm text-neutral-400">Bid Amount</p>
                <p className="font-semibold text-neutral-900">
                  {formatCurrency(campaign.bid_amount)}
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-neutral-50 rounded-xl">
            <h4 className="font-semibold text-neutral-900 mb-4">Budget</h4>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-neutral-500">Total</span>
                <span className="font-semibold text-neutral-900">{formatCurrency(campaign.budget)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-neutral-500">Spent</span>
                <span className="font-semibold text-neutral-900">{formatCurrency(campaign.spent)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-neutral-500">Remaining</span>
                <span className="font-semibold text-green-600">
                  {formatCurrency(campaign.budget - campaign.spent)}
                </span>
              </div>
              <div className="w-full bg-neutral-200 rounded-full h-2">
                <div
                  className="bg-primary-500 h-2 rounded-full"
                  style={{ width: `${Math.min((campaign.spent / campaign.budget) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Charts */}
        <div className="grid gap-6 lg:grid-cols-2 mb-8">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Impressions & Clicks</h3>
            <LineChart
              data={performance.map((p) => ({
                label: p.label,
                value: p.impressions,
                date: p.date,
                name: "Impressions",
              }))}
              categories={["Impressions"]}
              colors={["var(--color-primary-500)"]}
              className="h-48"
            />
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Spend Over Time</h3>
            <LineChart
              data={performance.map((p) => ({
                label: p.label,
                value: p.spent,
                date: p.date,
                name: "Spend",
              }))}
              categories={["Spend"]}
              colors={["var(--color-green-500)"]}
              className="h-48"
            />
          </Card>
        </div>

        {/* Analytics Summary */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Performance Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            <div className="p-4 bg-neutral-50 rounded-xl text-center">
              <p className="text-2xl font-bold text-neutral-900">{analytics.totalImpressions.toLocaleString()}</p>
              <p className="text-sm text-neutral-500">Impressions</p>
            </div>
            <div className="p-4 bg-neutral-50 rounded-xl text-center">
              <p className="text-2xl font-bold text-neutral-900">{analytics.totalClicks.toLocaleString()}</p>
              <p className="text-sm text-neutral-500">Clicks</p>
            </div>
            <div className="p-4 bg-neutral-50 rounded-xl text-center">
              <p className="text-2xl font-bold text-neutral-900">{analytics.totalConversions.toLocaleString()}</p>
              <p className="text-sm text-neutral-500">Conversions</p>
            </div>
            <div className="p-4 bg-neutral-50 rounded-xl text-center">
              <p className="text-2xl font-bold text-neutral-900">{formatPercentage(analytics.averageCtr / 100)}</p>
              <p className="text-sm text-neutral-500">Avg CTR</p>
            </div>
            <div className="p-4 bg-neutral-50 rounded-xl text-center">
              <p className="text-2xl font-bold text-neutral-900">{formatCurrency(analytics.averageCpc)}</p>
              <p className="text-sm text-neutral-500">Avg CPC</p>
            </div>
            <div className="p-4 bg-neutral-50 rounded-xl text-center">
              <p className="text-2xl font-bold text-neutral-900">{formatCurrency(analytics.averageCpm)}</p>
              <p className="text-sm text-neutral-500">Avg CPM</p>
            </div>
            <div className="p-4 bg-lime rounded-xl text-center">
              <p className="text-2xl font-bold text-dark">{formatPercentage(analytics.roi / 100)}</p>
              <p className="text-sm text-dark/60">ROI</p>
            </div>
          </div>
        </Card>

        <div className="flex justify-end pt-4">
          <Button onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function AdvertisingDashboardPage() {
  const [campaigns, setCampaigns] = useState<AdCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<AdAnalytics | null>(null);
  const [performance, setPerformance] = useState<AdPerformance[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showDetails, setShowDetails] = useState<AdCampaign | null>(null);
  const [selectedCampaign, setSelectedCampaign] = useState<AdCampaign | null>(null);
  const [activeTab, setActiveTab] = useState("campaigns");

  const tabs = [
    { id: "campaigns", label: "My Campaigns", icon: "layers" },
    { id: "analytics", label: "Analytics", icon: "bar-chart-3" },
    { id: "reports", label: "Reports", icon: "file-text" },
  ];

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // Fetch campaigns
        const campaignsRes = await fetch("/api/ads/my-campaigns");
        if (campaignsRes.ok) {
          const data = await campaignsRes.json();
          setCampaigns(data.campaigns || []);
        }

        // Fetch analytics
        const analyticsRes = await fetch("/api/ads/analytics");
        if (analyticsRes.ok) {
          const data = await analyticsRes.json();
          setAnalytics(data.analytics);
        }

        // Fetch performance data
        const performanceRes = await fetch("/api/ads/performance");
        if (performanceRes.ok) {
          const data = await performanceRes.json();
          setPerformance(data.performance || []);
        }
      } catch (error) {
        console.error("Failed to fetch advertising data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleCreateCampaign = async (data: AdCampaignFormData) => {
    try {
      const response = await fetch("/api/ads/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        setShowCreateForm(false);
        // Refresh campaigns
      }
    } catch (error) {
      console.error("Failed to create campaign:", error);
    }
  };

  const handleUpdateCampaign = async (campaign: AdCampaign, data: AdCampaignFormData) => {
    try {
      const response = await fetch(`/api/ads/campaigns/${campaign.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        setSelectedCampaign(null);
        // Refresh campaigns
      }
    } catch (error) {
      console.error("Failed to update campaign:", error);
    }
  };

  const handleDeleteCampaign = async (campaign: AdCampaign) => {
    if (!confirm(`Are you sure you want to delete "${campaign.name}"?`)) return;
    try {
      const response = await fetch(`/api/ads/campaigns/${campaign.id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        // Refresh campaigns
      }
    } catch (error) {
      console.error("Failed to delete campaign:", error);
    }
  };

  const handlePauseCampaign = async (campaign: AdCampaign) => {
    try {
      const response = await fetch(`/api/ads/campaigns/${campaign.id}/pause`, {
        method: "POST",
      });
      if (response.ok) {
        // Refresh campaigns
      }
    } catch (error) {
      console.error("Failed to pause campaign:", error);
    }
  };

  const handleResumeCampaign = async (campaign: AdCampaign) => {
    try {
      const response = await fetch(`/api/ads/campaigns/${campaign.id}/resume`, {
        method: "POST",
      });
      if (response.ok) {
        // Refresh campaigns
      }
    } catch (error) {
      console.error("Failed to resume campaign:", error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-neutral-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-neutral-200 rounded w-1/2"></div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-neutral-200 rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">Advertising</h1>
        <p className="text-slate-500 mt-1">Create and manage ad campaigns to promote your events</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-slate-900 text-white"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            <Icon name={tab.icon} size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Campaigns Tab */}
      {activeTab === "campaigns" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-neutral-900">My Campaigns</h2>
            <Button onClick={() => setShowCreateForm(true)}>
              <Icon name="plus" size={16} />
              Create Campaign
            </Button>
          </div>

          {campaigns.length === 0 ? (
            <div className="text-center py-12">
              <Icon name="megaphone" size={48} className="text-neutral-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-neutral-900">No Campaigns Yet</h3>
              <p className="text-neutral-500 mt-2">Start your first advertising campaign to reach more attendees</p>
              <Button onClick={() => setShowCreateForm(true)} className="mt-6">
                <Icon name="plus" size={16} />
                Create First Campaign
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {campaigns.map((campaign) => (
                <AdCampaignCard
                  key={campaign.id}
                  campaign={campaign}
                  onEdit={(c) => {
                    setSelectedCampaign(c);
                    setShowCreateForm(true);
                  }}
                  onPause={handlePauseCampaign}
                  onResume={handleResumeCampaign}
                  onDelete={handleDeleteCampaign}
                  onView={(c) => {
                    setShowDetails(c);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === "analytics" && (
        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-neutral-900">Advertising Analytics</h2>

          {analytics ? (
            <div className="grid gap-6 lg:grid-cols-4">
              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary-100 rounded-xl">
                    <Icon name="eye" size={24} className="text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500">Total Impressions</p>
                    <p className="text-2xl font-bold text-neutral-900">{analytics.totalImpressions.toLocaleString()}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 rounded-xl">
                    <Icon name="mouse-pointer-click" size={24} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500">Total Clicks</p>
                    <p className="text-2xl font-bold text-neutral-900">{analytics.totalClicks.toLocaleString()}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <Icon name="target" size={24} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500">Total Conversions</p>
                    <p className="text-2xl font-bold text-neutral-900">{analytics.totalConversions.toLocaleString()}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-amber-100 rounded-xl">
                    <Icon name="dollar-sign" size={24} className="text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500">Total Spent</p>
                    <p className="text-2xl font-bold text-neutral-900">{formatCurrency(analytics.totalSpent)}</p>
                  </div>
                </div>
              </Card>
            </div>
          ) : (
            <p className="text-center text-neutral-500 py-8">
              No analytics data available yet. Create and run a campaign to see analytics.
            </p>
          )}

          {/* Performance Charts */}
          {performance.length > 0 && (
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">Performance Over Time</h3>
                <LineChart
                  data={performance.map((p) => ({
                    label: p.label,
                    value: p.impressions,
                    date: p.date,
                    name: "Impressions",
                  }))}
                  categories={["Impressions"]}
                  colors={["var(--color-primary-500)"]}
                  className="h-64"
                />
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">Click-Through Rate</h3>
                <BarChart
                  data={performance.map((p) => ({
                    label: p.label,
                    value: p.clicks > 0 && p.impressions > 0 ? (p.clicks / p.impressions) * 100 : 0,
                    date: p.date,
                    name: "CTR %",
                  }))}
                  categories={["CTR %"]}
                  colors={["var(--color-green-500)"]}
                  className="h-64"
                />
              </Card>
            </div>
          )}
        </div>
      )}

      {/* Reports Tab */}
      {activeTab === "reports" && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-neutral-900">Reports</h2>
          
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Campaign Performance Report</h3>
              <p className="text-neutral-500 mb-4">Generate a detailed report of all your advertising campaigns</p>
              <Button className="w-full">
                <Icon name="download" size={16} />
                Download Report
              </Button>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Custom Report</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Report Type</label>
                  <select className="w-full p-2 border border-neutral-300 rounded-lg">
                    <option>Summary</option>
                    <option>Detailed</option>
                    <option>Financial</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Start Date</label>
                    <input type="date" className="w-full p-2 border border-neutral-300 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">End Date</label>
                    <input type="date" className="w-full p-2 border border-neutral-300 rounded-lg" />
                  </div>
                </div>
                <Button className="w-full">
                  <Icon name="file-text" size={16} />
                  Generate Custom Report
                </Button>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Create Campaign Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-neutral-900">
                {selectedCampaign ? "Edit Campaign" : "Create New Campaign"}
              </h2>
              <button
                onClick={() => {
                  setShowCreateForm(false);
                  setSelectedCampaign(null);
                }}
                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                <Icon name="x" size={24} />
              </button>
            </div>
            <CreateCampaignForm
              onSubmit={selectedCampaign ? 
                (data) => handleUpdateCampaign(selectedCampaign, data) : 
                handleCreateCampaign
              }
              onCancel={() => {
                setShowCreateForm(false);
                setSelectedCampaign(null);
              }}
              initialData={selectedCampaign ? {
                name: selectedCampaign.name,
                description: selectedCampaign.description,
                campaign_type: selectedCampaign.campaign_type,
                budget: selectedCampaign.budget,
                daily_budget: selectedCampaign.daily_budget,
                bidding_type: selectedCampaign.bidding_type,
                bid_amount: selectedCampaign.bid_amount,
                start_date: selectedCampaign.start_date,
                end_date: selectedCampaign.end_date,
              } : null}
            />
          </div>
        </div>
      )}

      {/* Campaign Details Modal */}
      {showDetails && (
        <CampaignDetailsModal
          campaign={showDetails}
          performance={performance}
          analytics={analytics || {
            totalSpent: 0,
            totalImpressions: 0,
            totalClicks: 0,
            totalConversions: 0,
            averageCtr: 0,
            averageCpc: 0,
            averageCpm: 0,
            roi: 0,
          }}
          onClose={() => setShowDetails(null)}
        />
      )}
    </div>
  );
}
