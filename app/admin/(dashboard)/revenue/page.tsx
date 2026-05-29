"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { LineChart, BarChart, PieChart, DonutChart } from '@/components/charts';
import { formatCurrency, formatDate, formatPercentage } from '@/lib/utils';
import DateRangeSelector from '@/components/ui/DateRangeSelector';

// Types for Platform Revenue Data
type Period = "day" | "week" | "month" | "year";
type TransactionType = "TICKET_SALE" | "MERCH_SALE" | "VENDOR_PAYMENT" | "AD_CAMPAIGN" | "FEATURED_PLACEMENT" | "VERIFICATION" | "API_ACCESS" | "SUBSCRIPTION" | "WALLET_DEPOSIT" | "WALLET_WITHDRAWAL";

interface RevenueStream {
  type: TransactionType;
  displayName: string;
  total: number;
  periodTotal: number;
  growth: number;
  icon: string;
  color: string;
}

interface RevenueSummary {
  totalRevenue: number;
  periodRevenue: number;
  netRevenue: number;
  totalCommission: number;
  periodCommission: number;
  totalFees: number;
  periodFees: number;
  totalTransactions: number;
  periodTransactions: number;
  pendingSettlements: number;
  pendingAmount: number;
}

interface RevenueTrend {
  label: string;
  value: number;
  date: string;
}

interface FeeConfiguration {
  id: string;
  transactionType: TransactionType;
  feeType: "percentage" | "fixed";
  feeValue: number;
  isActive: boolean;
  description: string;
  totalCollected: number;
  periodCollected: number;
}

interface PlatformRevenueData {
  period: {
    key: Period;
    label: string;
    startDate: string;
    endDate: string;
    generatedAt: string;
  };
  summary: RevenueSummary;
  streams: RevenueStream[];
  trends: {
    total: RevenueTrend[];
    byStream: Record<TransactionType, RevenueTrend[]>;
    byDay: RevenueTrend[];
  };
  feeConfigurations: FeeConfiguration[];
  topEarners: {
    organizers: Array<{ id: string; name: string; revenue: number; commission: number }>;
    events: Array<{ id: string; title: string; revenue: number; commission: number }>;
    vendors: Array<{ id: string; name: string; revenue: number; fee: number }>;
  };
  settlements: {
    pending: Array<{ id: string; amount: number; date: string; user: string }>;
    completed: Array<{ id: string; amount: number; date: string; user: string }>;
    totalPending: number;
    totalCompleted: number;
  };
}

const REVENUE_COLORS: Record<TransactionType, string> = {
  TICKET_SALE: "var(--color-primary-500)",
  MERCH_SALE: "var(--color-teal-500)",
  VENDOR_PAYMENT: "var(--color-amber-500)",
  AD_CAMPAIGN: "var(--color-purple-500)",
  FEATURED_PLACEMENT: "var(--color-lime-500)",
  VERIFICATION: "var(--color-orange-500)",
  API_ACCESS: "var(--color-cyan-500)",
  SUBSCRIPTION: "var(--color-indigo-500)",
  WALLET_DEPOSIT: "var(--color-rose-500)",
  WALLET_WITHDRAWAL: "var(--color-gray-500)",
};

const REVENUE_ICONS: Record<TransactionType, string> = {
  TICKET_SALE: "ticket",
  MERCH_SALE: "shopping-bag",
  VENDOR_PAYMENT: "users",
  AD_CAMPAIGN: "megaphone",
  FEATURED_PLACEMENT: "star",
  VERIFICATION: "shield-check",
  API_ACCESS: "code",
  SUBSCRIPTION: "repeat",
  WALLET_DEPOSIT: "credit-card",
  WALLET_WITHDRAWAL: "credit-card",
};

const STREAM_DISPLAY_NAMES: Record<TransactionType, string> = {
  TICKET_SALE: "Ticket Sales",
  MERCH_SALE: "Merchandise",
  VENDOR_PAYMENT: "Vendor Payments",
  AD_CAMPAIGN: "Advertising",
  FEATURED_PLACEMENT: "Featured Placement",
  VERIFICATION: "Verification",
  API_ACCESS: "API Access",
  SUBSCRIPTION: "Subscriptions",
  WALLET_DEPOSIT: "Wallet Deposits",
  WALLET_WITHDRAWAL: "Wallet Withdrawals",
};

// Fee Configuration Form Component
function FeeConfigurationForm({ 
  config, 
  onSave, 
  onCancel 
}: { 
  config: Partial<FeeConfiguration> & { transactionType: TransactionType };
  onSave: (data: Partial<FeeConfiguration>) => void;
  onCancel: () => void;
}) {
  const [feeType, setFeeType] = useState<"percentage" | "fixed">(config.feeType || "percentage");
  const [feeValue, setFeeValue] = useState<number>(config.feeValue || 0);
  const [isActive, setIsActive] = useState<boolean>(config.isActive ?? true);
  const [description, setDescription] = useState<string>(config.description || "");

  return (
    <div className="space-y-4 p-4 border border-neutral-200 rounded-xl bg-white">
      <h3 className="font-semibold text-neutral-900">
        Configure {STREAM_DISPLAY_NAMES[config.transactionType]} Fee
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">Fee Type</label>
          <select
            value={feeType}
            onChange={(e) => setFeeType(e.target.value as "percentage" | "fixed")}
            className="w-full p-2 border border-neutral-300 rounded-lg"
          >
            <option value="percentage">Percentage (%)</option>
            <option value="fixed">Fixed Amount</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Fee Value {feeType === "percentage" ? "(%)" : "(NGN)"}
          </label>
          <input
            type="number"
            value={feeValue}
            onChange={(e) => setFeeValue(parseFloat(e.target.value) || 0)}
            min={0}
            step={feeType === "percentage" ? 0.1 : 1}
            className="w-full p-2 border border-neutral-300 rounded-lg"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border border-neutral-300 rounded-lg"
          />
        </div>
        
        <div className="flex items-center">
          <label className="block text-sm font-medium text-neutral-700 mb-1">Active</label>
          <button
            onClick={() => setIsActive(!isActive)}
            className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors ${
              isActive ? "bg-green-500 justify-end" : "bg-neutral-300"
            }`}
          >
            <span className="w-4 h-4 bg-white rounded-full"></span>
          </button>
        </div>
      </div>
      
      <div className="flex gap-2 justify-end">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={() => onSave({ feeType, feeValue, isActive, description })}>
          Save Configuration
        </Button>
      </div>
    </div>
  );
}

export default function PlatformRevenueDashboardPage() {
  const [data, setData] = useState<PlatformRevenueData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<Period>("month");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [activeTab, setActiveTab] = useState("overview");
  const [editingConfig, setEditingConfig] = useState<Partial<FeeConfiguration> & { transactionType: TransactionType } | null>(null);

  const tabs = [
    { id: "overview", label: "Overview", icon: "home" },
    { id: "streams", label: "Revenue Streams", icon: "bar-chart-3" },
    { id: "fees", label: "Fee Configuration", icon: "settings" },
    { id: "settlements", label: "Settlements", icon: "dollar-sign" },
    { id: "reports", label: "Reports", icon: "file-text" },
  ];

  useEffect(() => {
    async function fetchRevenueData() {
      setLoading(true);
      try {
        // Fetch platform revenue data
        const response = await fetch(`/api/admin/platform/revenue?period=${period}`);
        if (response.ok) {
          const json = await response.json();
          setData(json);
        }
      } catch (error) {
        console.error("Failed to fetch revenue data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchRevenueData();
  }, [period]);

  const handleEditFee = (config: FeeConfiguration) => {
    setEditingConfig({
      ...config,
      transactionType: config.transactionType,
    });
  };

  const handleSaveFee = async (config: FeeConfiguration) => {
    try {
      const response = await fetch(`/api/admin/platform/fees/${config.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      if (response.ok) {
        // Refresh data
        setEditingConfig(null);
      }
    } catch (error) {
      console.error("Failed to save fee configuration:", error);
    }
  };

  const handleSettle = async (settlementId: string) => {
    try {
      const response = await fetch(`/api/admin/platform/settlements/${settlementId}/settle`, {
        method: "POST",
      });
      if (response.ok) {
        // Refresh data
      }
    } catch (error) {
      console.error("Failed to process settlement:", error);
    }
  };

  // Calculate growth percentages
  const getGrowthPercentage = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-neutral-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-neutral-200 rounded w-1/2"></div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-neutral-200 rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <Icon name="alert-circle" size={48} className="text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-neutral-900">Error Loading Data</h3>
        <p className="text-neutral-500 mt-2">Failed to load platform revenue data</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">Platform Revenue</h1>
        <p className="text-slate-500 mt-1">Comprehensive revenue tracking and management</p>
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

      {/* Date Range Selector */}
      <div className="flex justify-end">
        <DateRangeSelector
          value={period}
          onChange={(p) => setPeriod(p as Period)}
        />
      </div>

      {/* Content based on active tab */}
      {activeTab === "overview" && (
        <div className="space-y-8">
          {/* Key Metrics */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-xl">
                  <Icon name="dollar-sign" size={24} className="text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-neutral-500">Total Revenue</p>
                  <p className="text-2xl font-bold text-neutral-900">{formatCurrency(data.summary.totalRevenue)}</p>
                  <p className="text-sm text-green-600">
                    +{formatCurrency(data.summary.periodRevenue)} this period
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Icon name="trending-up" size={24} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-neutral-500">Net Revenue</p>
                  <p className="text-2xl font-bold text-neutral-900">{formatCurrency(data.summary.netRevenue)}</p>
                  <p className="text-sm text-blue-600">
                    After all deductions
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <Icon name="percent" size={24} className="text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-neutral-500">Total Commission</p>
                  <p className="text-2xl font-bold text-neutral-900">{formatCurrency(data.summary.totalCommission)}</p>
                  <p className="text-sm text-purple-600">
                    +{formatCurrency(data.summary.periodCommission)} this period
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-amber-100 rounded-xl">
                  <Icon name="credit-card" size={24} className="text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-neutral-500">Pending Settlements</p>
                  <p className="text-2xl font-bold text-neutral-900">{formatCurrency(data.summary.pendingAmount)}</p>
                  <p className="text-sm text-amber-600">
                    {data.summary.pendingSettlements} settlements
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Revenue Trend Chart */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-neutral-900">Revenue Trend</h2>
              <button className="text-sm text-neutral-500 hover:text-neutral-700">
                View Details
              </button>
            </div>
            <LineChart
              data={data.trends.total.map((t) => ({
                label: t.label,
                value: t.value,
                date: t.date,
              }))}
              categories={["Revenue"]}
              colors={["var(--color-primary-500)"]}
              className="h-64"
            />
          </Card>

          {/* Revenue by Stream */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">Revenue by Stream</h2>
              <DonutChart
                data={data.streams.map((s) => ({
                  label: s.displayName,
                  value: s.total,
                  color: s.color,
                }))}
                className="h-64"
              />
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">This Period</h2>
              <BarChart
                data={data.streams.map((s) => ({
                  label: s.displayName,
                  value: s.periodTotal,
                  color: s.color,
                }))}
                categories={["Amount"]}
                className="h-64"
              />
            </Card>
          </div>

          {/* Top Earners */}
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">Top Organizers</h2>
              <div className="space-y-4">
                {data.topEarners.organizers.slice(0, 5).map((organizer, index) => (
                  <div key={organizer.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-neutral-400">#{index + 1}</span>
                      <span className="font-medium text-neutral-900">{organizer.name}</span>
                    </div>
                    <span className="font-semibold text-neutral-900">{formatCurrency(organizer.revenue)}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">Top Events</h2>
              <div className="space-y-4">
                {data.topEarners.events.slice(0, 5).map((event, index) => (
                  <div key={event.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-neutral-400">#{index + 1}</span>
                      <span className="font-medium text-neutral-900 truncate max-w-[150px]">
                        {event.title}
                      </span>
                    </div>
                    <span className="font-semibold text-neutral-900">{formatCurrency(event.revenue)}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">Top Vendors</h2>
              <div className="space-y-4">
                {data.topEarners.vendors.slice(0, 5).map((vendor, index) => (
                  <div key={vendor.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-neutral-400">#{index + 1}</span>
                      <span className="font-medium text-neutral-900">{vendor.name}</span>
                    </div>
                    <span className="font-semibold text-neutral-900">{formatCurrency(vendor.revenue)}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {activeTab === "streams" && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-neutral-900">Revenue Streams</h2>
          <div className="grid gap-6 lg:grid-cols-2">
            {data.streams.map((stream) => (
              <Card key={stream.type} className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl`} style={{ backgroundColor: `${stream.color}20` }}>
                    <Icon name={stream.icon as any} size={24} style={{ color: stream.color }} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-neutral-900">{stream.displayName}</h3>
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-neutral-500">Total Revenue</span>
                        <span className="font-semibold text-neutral-900">{formatCurrency(stream.total)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-neutral-500">This Period</span>
                        <span className="font-semibold text-green-600">{formatCurrency(stream.periodTotal)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-neutral-500">Growth</span>
                        <span className={`font-semibold ${stream.growth >= 0 ? "text-green-600" : "text-red-600"}`}>
                          {formatPercentage(stream.growth / 100)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab("reports")}
                  className="mt-4 w-full py-2 border border-neutral-200 rounded-lg text-sm font-medium hover:bg-neutral-50 transition-colors"
                >
                  View Detailed Report
                </button>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === "fees" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-neutral-900">Fee Configurations</h2>
            <Button>
              <Icon name="plus" size={16} />
              Add New Fee
            </Button>
          </div>
          
          <div className="grid gap-4">
            {data.feeConfigurations.map((config) => (
              <div key={config.id} className="p-4 border border-neutral-200 rounded-xl bg-white">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-neutral-900">{STREAM_DISPLAY_NAMES[config.transactionType]}</h3>
                    <p className="text-sm text-neutral-500 mt-1">{config.description}</p>
                    <div className="mt-3 flex gap-6">
                      <div>
                        <p className="text-xs text-neutral-400">Fee Type</p>
                        <p className="font-medium text-neutral-900 capitalized">
                          {config.feeType} {config.feeType === "percentage" && "%"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-neutral-400">Fee Value</p>
                        <p className="font-medium text-neutral-900">
                          {config.feeType === "percentage" ? `${config.feeValue}%` : `${formatCurrency(config.feeValue)}`}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-neutral-400">Status</p>
                        <p className={`font-medium ${config.isActive ? "text-green-600" : "text-red-600"}`}>
                          {config.isActive ? "Active" : "Inactive"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-neutral-400">Period Revenue</p>
                        <p className="font-medium text-neutral-900">{formatCurrency(config.periodCollected)}</p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleEditFee(config as any)}
                    className="p-2 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
                  >
                    <Icon name="edit-3" size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {editingConfig && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-neutral-900">Edit Fee Configuration</h2>
                  <button
                    onClick={() => setEditingConfig(null)}
                    className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                  >
                    <Icon name="x" size={20} />
                  </button>
                </div>
                <FeeConfigurationForm
                  config={editingConfig}
                  onSave={(data) => handleSaveFee({ ...editingConfig, ...data } as any)}
                  onCancel={() => setEditingConfig(null)}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "settlements" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-neutral-900">Settlements</h2>
            <div className="flex gap-2">
              <Button variant="secondary">
                <Icon name="download" size={16} />
                Export
              </Button>
              <Button onClick={() => {}}>
                <Icon name="refresh-cw" size={16} />
                Process All
              </Button>
            </div>
          </div>
          
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Pending Settlements</h3>
              <p className="text-3xl font-bold text-neutral-900 mb-4">
                {formatCurrency(data.settlements.totalPending)}
              </p>
              <p className="text-sm text-neutral-500">{data.settlements.pending.length} settlements</p>
              
              <div className="mt-6 space-y-4">
                {data.settlements.pending.slice(0, 5).map((settlement) => (
                  <div key={settlement.id} className="flex items-center justify-between p-3 border border-neutral-200 rounded-lg">
                    <div>
                      <p className="font-medium text-neutral-900">{settlement.user}</p>
                      <p className="text-sm text-neutral-500">{settlement.date}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-semibold text-neutral-900">{formatCurrency(settlement.amount)}</span>
                      <Button size="sm" onClick={() => handleSettle(settlement.id)}>
                        Process
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Completed Settlements</h3>
              <p className="text-3xl font-bold text-neutral-900 mb-4">
                {formatCurrency(data.settlements.totalCompleted)}
              </p>
              <p className="text-sm text-neutral-500">{data.settlements.completed.length} settlements</p>
              
              <div className="mt-6 space-y-4">
                {data.settlements.completed.slice(0, 5).map((settlement) => (
                  <div key={settlement.id} className="flex items-center justify-between p-3 border border-neutral-200 rounded-lg">
                    <div>
                      <p className="font-medium text-neutral-900">{settlement.user}</p>
                      <p className="text-sm text-neutral-500">{settlement.date}</p>
                    </div>
                    <span className="font-semibold text-green-600">{formatCurrency(settlement.amount)}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {activeTab === "reports" && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-neutral-900">Reports & Analytics</h2>
          
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Generate Custom Report</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Report Type</label>
                  <select className="w-full p-2 border border-neutral-300 rounded-lg">
                    <option>Revenue Summary</option>
                    <option>Commission Report</option>
                    <option>Fee Analysis</option>
                    <option>User Monetization</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Date Range</label>
                  <DateRangeSelector value={period} onChange={(p) => setPeriod(p as Period)} />
                </div>
                <Button className="w-full">
                  <Icon name="file-text" size={16} />
                  Generate Report
                </Button>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Quick Stats</h3>
              <div className="grid gap-4">
                <div className="flex justify-between">
                  <span className="text-sm text-neutral-500">Average Commission Rate</span>
                  <span className="font-semibold text-neutral-900">
                    {formatPercentage((data.summary.totalCommission / data.summary.totalRevenue) * 100)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-neutral-500">Average Transaction Value</span>
                  <span className="font-semibold text-neutral-900">
                    {formatCurrency(data.summary.totalRevenue / (data.summary.totalTransactions || 1))}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-neutral-500">Fee to Revenue Ratio</span>
                  <span className="font-semibold text-neutral-900">
                    {formatPercentage((data.summary.totalFees / data.summary.totalRevenue) * 100)}
                  </span>
                </div>
              </div>
            </Card>
          </div>

          {/* Export Options */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Export Data</h3>
            <div className="flex flex-wrap gap-4">
              {["CSV", "Excel", "PDF", "JSON"].map((format) => (
                <button
                  key={format}
                  className="px-4 py-2 border border-neutral-200 rounded-lg text-sm font-medium hover:bg-neutral-50 transition-colors"
                >
                  Export as {format}
                </button>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
