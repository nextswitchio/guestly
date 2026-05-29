"use client";

import React, { useState, useEffect } from "react";
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { LineChart, BarChart, PieChart, DonutChart } from '@/components/charts';
import { formatCurrency, formatDate, formatNumber, formatPercentage } from '@/lib/utils';

// Types for Monitoring Data
type Period = "24h" | "7d" | "30d" | "90d";
type StatusType = "healthy" | "degraded" | "unhealthy" | "unknown";

interface SystemHealth {
  status: StatusType;
  timestamp: string;
  services: Record<string, any>;
  database: {
    status: StatusType;
    response_time: number;
    error?: string;
  };
}

interface PerformanceMetrics {
  period: string;
  start_time: string;
  end_time: string;
  users: {
    new: number;
    active: number;
    total: number;
  };
  orders: {
    new: number;
    paid: number;
    total: number;
  };
  revenue: {
    total: number;
    platform_fees: number;
    net_revenue: number;
  };
  events: {
    new: number;
    active: number;
    total: number;
  };
}

interface RevenueAnalytics {
  period: string;
  start_time: string;
  end_time: string;
  total_revenue: number;
  total_transactions: number;
  by_transaction_type?: Array<{
    transaction_type: string;
    count: number;
    total: number;
    average: number;
  }>;
  time_series?: Array<{
    date: string;
    count: number;
    total: number;
  }>;
}

interface UserActivity {
  period: string;
  start_time: string;
  end_time: string;
  active_users: number;
  new_users: number;
  total_users: number;
  users_by_role: Record<string, number>;
  sessions: number;
  average_session_duration: number;
}

interface Anomaly {
  type: string;
  severity: "low" | "medium" | "high";
  count: number;
  message: string;
  timestamp: string;
}

interface MonitoringReport {
  generated_at: string;
  period: string;
  health: SystemHealth;
  performance: PerformanceMetrics;
  revenue: RevenueAnalytics;
  activity: UserActivity;
  anomalies: Anomaly[];
  summary: {
    status: string;
    total_revenue: number;
    active_users: number;
    new_users: number;
    anomaly_count: number;
  };
}

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: string;
  color?: string;
  trend?: number;
  trendType?: 'up' | 'down' | 'neutral';
  subtitle?: string;
}

function MetricCard({ title, value, icon, color = 'neutral', trend, trendType = 'neutral', subtitle }: MetricCardProps) {
  const trendIcon = trendType === 'up' ? 'trending-up' : trendType === 'down' ? 'trending-down' : 'minus';
  const trendColor = trendType === 'up' ? 'text-green-600' : trendType === 'down' ? 'text-red-600' : 'text-neutral-500';
  
  return (
    <Card className="p-6">
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
          color === 'primary' ? 'bg-lime/10' :
          color === 'success' ? 'bg-green-50' :
          color === 'warning' ? 'bg-amber-50' :
          color === 'danger' ? 'bg-red-50' :
          'bg-neutral-50'
        }`}>
          <Icon name={icon} className={`w-6 h-6 ${
            color === 'primary' ? 'text-lime' :
            color === 'success' ? 'text-green-600' :
            color === 'warning' ? 'text-amber-600' :
            color === 'danger' ? 'text-red-600' :
            'text-neutral-600'
          }`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-neutral-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-neutral-900">{value}</p>
          {subtitle && <p className="text-xs text-neutral-400 mt-1">{subtitle}</p>}
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-sm ${trendColor}`}>
            <Icon name={trendIcon} className="w-4 h-4" />
            <span>{formatPercentage(trend, 1)}</span>
          </div>
        )}
      </div>
    </Card>
  );
}

function StatusBadge({ status }: { status: StatusType }) {
  const styles = {
    healthy: 'bg-green-100 text-green-700',
    degraded: 'bg-amber-100 text-amber-700',
    unhealthy: 'bg-red-100 text-red-700',
    unknown: 'bg-neutral-100 text-neutral-700',
  };
  const icons = {
    healthy: 'check-circle',
    degraded: 'alert-triangle',
    unhealthy: 'x-circle',
    unknown: 'question-circle',
  };
  
  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${styles[status]}`}>
      <Icon name={icons[status] as any} className="w-4 h-4" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function ServiceHealthCard({ name, status, details }: { name: string; status: StatusType; details?: any }) {
  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-neutral-900">{name}</h3>
        <StatusBadge status={status} />
      </div>
      {details && (
        <div className="text-sm text-neutral-500">
          {Object.entries(details).map(([key, value]) => (
            <div key={key} className="flex justify-between">
              <span>{key}:</span>
              <span>{typeof value === 'number' ? formatNumber(value) : String(value)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AnomalyCard({ anomaly }: { anomaly: Anomaly }) {
  const severityColors = {
    low: 'border-neutral-200 bg-neutral-50',
    medium: 'border-amber-200 bg-amber-50',
    high: 'border-red-200 bg-red-50',
  };
  const severityIcons = {
    low: 'info',
    medium: 'alert-triangle',
    high: 'alert-circle',
  };
  
  return (
    <div className={`border rounded-xl p-4 ${severityColors[anomaly.severity]}`}>
      <div className="flex items-start gap-3">
        <Icon name={severityIcons[anomaly.severity] as any} className="w-5 h-5 text-neutral-600 mt-0.5" />
        <div className="flex-1">
          <h4 className="font-medium text-neutral-900 mb-1">{anomaly.type.replace('_', ' ')}</h4>
          <p className="text-sm text-neutral-600 mb-2">{anomaly.message}</p>
          <div className="flex items-center gap-4 text-xs text-neutral-500">
            <span>Count: {anomaly.count}</span>
            <span>Severity: {anomaly.severity}</span>
            <span>{formatDate(anomaly.timestamp)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PlatformMonitoringDashboardPage() {
  const [data, setData] = useState<MonitoringReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<Period>("24h");
  const [activeTab, setActiveTab] = useState("overview");

  const periods = [
    { id: "24h", label: "Last 24 Hours" },
    { id: "7d", label: "Last 7 Days" },
    { id: "30d", label: "Last 30 Days" },
    { id: "90d", label: "Last 90 Days" },
  ];

  const tabs = [
    { id: "overview", label: "Overview", icon: "home" },
    { id: "performance", label: "Performance", icon: "activity" },
    { id: "revenue", label: "Revenue", icon: "trending-up" },
    { id: "activity", label: "Activity", icon: "users" },
    { id: "health", label: "Health", icon: "heart" },
    { id: "anomalies", label: "Anomalies", icon: "alert-triangle" },
    { id: "reports", label: "Reports", icon: "file-text" },
  ];

  useEffect(() => {
    async function fetchMonitoringData() {
      setLoading(true);
      try {
        // Fetch monitoring report
        const response = await fetch(`/api/monitoring/health?period=${period}`);
        if (response.ok) {
          const json = await response.json();
          setData(json);
        }
      } catch (error) {
        console.error("Failed to fetch monitoring data:", error);
        setData(null);
      } finally {
        setLoading(false);
      }
    }

    fetchMonitoringData();
  }, [period]);

  const refreshData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/monitoring/health?period=${period}`);
      if (response.ok) {
        const json = await response.json();
        setData(json);
      }
    } catch (error) {
      console.error("Failed to refresh data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Mock data for demonstration (replace with real API calls)
  const mockData: MonitoringReport = {
    generated_at: new Date().toISOString(),
    period: period,
    health: {
      status: "healthy",
      timestamp: new Date().toISOString(),
      services: {
        api: { status: "healthy", endpoints_checked: 50, endpoints_up: 50 },
        payment_gateway: { status: "healthy", last_check: new Date().toISOString() },
        email_service: { status: "healthy", last_check: new Date().toISOString() },
      },
      database: {
        status: "healthy",
        response_time: 25.5,
      },
    },
    performance: {
      period: period,
      start_time: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      end_time: new Date().toISOString(),
      users: {
        new: 125,
        active: 2450,
        total: 45800,
      },
      orders: {
        new: 850,
        paid: 780,
        total: 158000,
      },
      revenue: {
        total: 12500000,
        platform_fees: 937500,
        net_revenue: 11562500,
      },
      events: {
        new: 45,
        active: 280,
        total: 12500,
      },
    },
    revenue: {
      period: period,
      start_time: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      end_time: new Date().toISOString(),
      total_revenue: 937500,
      total_transactions: 12500,
      by_transaction_type: [
        { transaction_type: "ticket_sale", count: 8500, total: 425000, average: 50 },
        { transaction_type: "featured_placement", count: 120, total: 240000, average: 2000 },
        { transaction_type: "ad_campaign", count: 850, total: 153000, average: 180 },
        { transaction_type: "verification", count: 320, total: 64000, average: 200 },
        { transaction_type: "api_access", count: 180, total: 54000, average: 300 },
      ],
      time_series: [
        { date: new Date().toISOString(), count: 1250, total: 150000 },
        { date: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), count: 980, total: 120000 },
        { date: new Date(Date.now() - 16 * 60 * 60 * 1000).toISOString(), count: 1120, total: 135000 },
      ],
    },
    activity: {
      period: period,
      start_time: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      end_time: new Date().toISOString(),
      active_users: 2450,
      new_users: 125,
      total_users: 45800,
      users_by_role: {
        organiser: 8500,
        attendee: 32000,
        vendor: 2800,
        affiliate: 1200,
        admin: 5,
      },
      sessions: 15800,
      average_session_duration: 450,
    },
    anomalies: [],
    summary: {
      status: "healthy",
      total_revenue: 937500,
      active_users: 2450,
      new_users: 125,
      anomaly_count: 0,
    },
  };

  const displayData = data || mockData;

  // Chart data
  const revenueByTypeData = displayData.revenue.by_transaction_type?.map((item: any) => ({
    label: item.transaction_type.replace('_', ' '),
    value: item.total,
  })) || [];

  const revenueTimeSeriesData = displayData.revenue.time_series?.map((item: any) => ({
    label: new Date(item.date).toLocaleDateString(),
    value: item.total,
  })) || [];

  const usersByRoleData = Object.entries(displayData.activity.users_by_role || {}).map(([role, count]) => ({
    name: role.charAt(0).toUpperCase() + role.slice(1),
    value: count,
  }));

  if (loading && !data) {
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Platform Monitoring</h1>
          <p className="text-neutral-500 mt-1">Real-time platform health and performance tracking</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as Period)}
            className="px-3 py-2 border border-neutral-200 rounded-lg text-sm"
          >
            {periods.map((p) => (
              <option key={p.id} value={p.id}>{p.label}</option>
            ))}
          </select>
          <Button onClick={refreshData}>
            <Icon name="refresh-cw" className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-4 -mb-4">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            variant={activeTab === tab.id ? 'primary' : 'outline'}
            size="sm"
          >
            <Icon name={tab.icon as any} className="w-4 h-4 mr-2" />
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title="Platform Status"
              value={displayData.summary.status.charAt(0).toUpperCase() + displayData.summary.status.slice(1)}
              icon="activity"
              color={displayData.summary.status === 'healthy' ? 'success' : displayData.summary.status === 'degraded' ? 'warning' : 'danger'}
            />
            <MetricCard
              title="Total Revenue"
              value={formatCurrency(displayData.summary.total_revenue, 'NGN')}
              icon="dollar-sign"
              color="primary"
              trend={12.5}
              trendType="up"
            />
            <MetricCard
              title="Active Users"
              value={formatNumber(displayData.summary.active_users)}
              icon="users"
              color="success"
              trend={8.3}
              trendType="up"
            />
            <MetricCard
              title="New Users"
              value={formatNumber(displayData.summary.new_users)}
              icon="user-plus"
              color="primary"
              trend={15.2}
              trendType="up"
            />
          </div>

          {/* Platform Health Summary */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-neutral-900">Platform Health</h2>
              <StatusBadge status={displayData.health.status} />
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <ServiceHealthCard
                name="Database"
                status={displayData.health.database.status}
                details={{ response_time: `${displayData.health.database.response_time}ms` }}
              />
              <ServiceHealthCard
                name="API Service"
                status={displayData.health.services.api.status}
                details={displayData.health.services.api}
              />
              <ServiceHealthCard
                name="Payment Gateway"
                status={displayData.health.services.payment_gateway.status}
              />
            </div>
          </Card>

          {/* Key Metrics */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Revenue Overview</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Total Revenue</span>
                  <span className="font-semibold text-neutral-900">{formatCurrency(displayData.performance.revenue.total, 'NGN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Platform Fees</span>
                  <span className="font-semibold text-neutral-900">{formatCurrency(displayData.performance.revenue.platform_fees, 'NGN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Net Revenue</span>
                  <span className="font-semibold text-neutral-900">{formatCurrency(displayData.performance.revenue.net_revenue, 'NGN')}</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">User Metrics</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Total Users</span>
                  <span className="font-semibold text-neutral-900">{formatNumber(displayData.performance.users.total)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Active Users</span>
                  <span className="font-semibold text-neutral-900">{formatNumber(displayData.performance.users.active)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">New Users</span>
                  <span className="font-semibold text-neutral-900">{formatNumber(displayData.performance.users.new)}</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Event Metrics</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Total Events</span>
                  <span className="font-semibold text-neutral-900">{formatNumber(displayData.performance.events.total)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Active Events</span>
                  <span className="font-semibold text-neutral-900">{formatNumber(displayData.performance.events.active)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">New Events</span>
                  <span className="font-semibold text-neutral-900">{formatNumber(displayData.performance.events.new)}</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Revenue by Type Chart */}
          {revenueByTypeData.length > 0 && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Revenue by Transaction Type</h3>
              <div className="h-64">
                <PieChart
                  data={revenueByTypeData}
                  animated
                  gradient
                />
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Performance Tab */}
      {activeTab === 'performance' && (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <MetricCard
              title="Total Orders"
              value={formatNumber(displayData.performance.orders.total)}
              icon="shopping-bag"
              color="primary"
              trend={5.2}
              trendType="up"
            />
            <MetricCard
              title="Paid Orders"
              value={formatNumber(displayData.performance.orders.paid)}
              icon="credit-card"
              color="success"
              trend={7.8}
              trendType="up"
            />
            <MetricCard
              title="New Orders"
              value={formatNumber(displayData.performance.orders.new)}
              icon="package"
              color="warning"
              trend={12.3}
              trendType="up"
            />
          </div>

          {/* Performance Charts */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Revenue Over Time</h3>
              <div className="h-64">
                <LineChart
                  data={revenueTimeSeriesData}
                  color="#84CC16"
                  height={200}
                  animated
                  gradient
                />
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Users by Role</h3>
              <div className="h-64">
                <DonutChart
                  data={usersByRoleData}
                  dataKey="value"
                  nameKey="name"
                  colors={['#84CC16', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6']}
                />
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Revenue Tab */}
      {activeTab === 'revenue' && (
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Revenue Analytics</h3>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="text-center p-4 border border-neutral-200 rounded-lg">
                <p className="text-sm text-neutral-500 mb-1">Total Revenue</p>
                <p className="text-2xl font-bold text-neutral-900">{formatCurrency(displayData.revenue.total_revenue, 'NGN')}</p>
              </div>
              <div className="text-center p-4 border border-neutral-200 rounded-lg">
                <p className="text-sm text-neutral-500 mb-1">Transactions</p>
                <p className="text-2xl font-bold text-neutral-900">{formatNumber(displayData.revenue.total_transactions)}</p>
              </div>
              <div className="text-center p-4 border border-neutral-200 rounded-lg">
                <p className="text-sm text-neutral-500 mb-1">Avg Transaction</p>
                <p className="text-2xl font-bold text-neutral-900">
                  {formatCurrency(displayData.revenue.total_revenue / Math.max(1, displayData.revenue.total_transactions), 'NGN')}
                </p>
              </div>
              <div className="text-center p-4 border border-neutral-200 rounded-lg">
                <p className="text-sm text-neutral-500 mb-1">Period</p>
                <p className="text-lg font-semibold text-neutral-900">{displayData.revenue.period}</p>
              </div>
            </div>
          </Card>

          {/* Transaction Types Table */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Revenue by Transaction Type</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-200">
                    <th className="text-left py-3 px-4 font-medium text-neutral-500">Type</th>
                    <th className="text-right py-3 px-4 font-medium text-neutral-500">Transactions</th>
                    <th className="text-right py-3 px-4 font-medium text-neutral-500">Total (NGN)</th>
                    <th className="text-right py-3 px-4 font-medium text-neutral-500">Average (NGN)</th>
                    <th className="text-right py-3 px-4 font-medium text-neutral-500">% of Total</th>
                  </tr>
                </thead>
                <tbody>
                  {displayData.revenue.by_transaction_type?.map((item: any, index: number) => {
                    const percentage = (item.total / Math.max(1, displayData.revenue.total_revenue)) * 100;
                    return (
                      <tr key={index} className="border-b border-neutral-100">
                        <td className="py-3 px-4 text-neutral-900">
                          {item.transaction_type.replace('_', ' ')}
                        </td>
                        <td className="py-3 px-4 text-right text-neutral-600">
                          {formatNumber(item.count)}
                        </td>
                        <td className="py-3 px-4 text-right text-neutral-900">
                          {formatCurrency(item.total, 'NGN')}
                        </td>
                        <td className="py-3 px-4 text-right text-neutral-600">
                          {formatCurrency(item.average, 'NGN')}
                        </td>
                        <td className="py-3 px-4 text-right text-neutral-600">
                          {formatPercentage(percentage, 1)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* Activity Tab */}
      {activeTab === 'activity' && (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <MetricCard
              title="Total Users"
              value={formatNumber(displayData.activity.total_users)}
              icon="users"
              color="primary"
            />
            <MetricCard
              title="Active Users"
              value={formatNumber(displayData.activity.active_users)}
              icon="activity"
              color="success"
              trend={8.3}
              trendType="up"
            />
            <MetricCard
              title="New Users"
              value={formatNumber(displayData.activity.new_users)}
              icon="user-plus"
              color="warning"
              trend={15.2}
              trendType="up"
            />
          </div>

          {/* Users by Role */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Users by Role</h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Object.entries(displayData.activity.users_by_role || {}).map(([role, count]) => (
                <div key={role} className="bg-neutral-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-neutral-900">
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </span>
                    <span className="text-sm text-neutral-500">
                      {formatPercentage((count / Math.max(1, displayData.activity.total_users)) * 100, 1)}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-neutral-900">{formatNumber(count)}</span>
                    <span className="text-sm text-neutral-500">users</span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-2 mt-3">
                    <div
                      className="bg-lime h-2 rounded-full"
                      style={{ width: `${(count / Math.max(1, displayData.activity.total_users)) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Activity Metrics */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Sessions</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Total Sessions</span>
                  <span className="font-semibold text-neutral-900">{formatNumber(displayData.activity.sessions)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Avg Session Duration</span>
                  <span className="font-semibold text-neutral-900">{Math.round(displayData.activity.average_session_duration / 60)} minutes</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Health Tab */}
      {activeTab === 'health' && (
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">System Health Overview</h3>
            <div className="flex items-center gap-4 mb-6">
              <StatusBadge status={displayData.health.status} />
              <span className="text-neutral-500">Last checked: {formatDate(displayData.health.timestamp)}</span>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-medium text-neutral-900 mb-3">Database</h4>
                <ServiceHealthCard
                  name="Database Connection"
                  status={displayData.health.database.status}
                  details={{ response_time: `${displayData.health.database.response_time}ms` }}
                />
              </div>
              <div>
                <h4 className="font-medium text-neutral-900 mb-3">Services</h4>
                <div className="space-y-3">
                  <ServiceHealthCard
                    name="API Service"
                    status={displayData.health.services.api.status}
                  />
                  <ServiceHealthCard
                    name="Payment Gateway"
                    status={displayData.health.services.payment_gateway.status}
                  />
                  <ServiceHealthCard
                    name="Email Service"
                    status={displayData.health.services.email_service.status}
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Anomalies Tab */}
      {activeTab === 'anomalies' && (
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-neutral-900">Platform Anomalies</h3>
              <StatusBadge status={displayData.anomalies.length > 0 ? 'degraded' : 'healthy'} />
            </div>
            
            {displayData.anomalies.length === 0 ? (
              <div className="text-center py-12">
                <Icon name="check-circle" className="w-16 h-16 mx-auto mb-4 text-green-500" />
                <p className="text-lg font-semibold text-green-600">No anomalies detected</p>
                <p className="text-sm text-neutral-500 mt-2">All systems are operating normally</p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-neutral-500 mb-4">
                  {displayData.anomalies.length} anomaly{displayData.anomalies.length !== 1 ? 'ies' : ''} detected
                </p>
                <div className="space-y-3">
                  {displayData.anomalies.map((anomaly, index) => (
                    <AnomalyCard key={index} anomaly={anomaly} />
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Reports Tab */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-neutral-900">Monitoring Reports</h3>
              <Button>
                <Icon name="download" className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-neutral-50 rounded-lg p-4">
                <h4 className="font-medium text-neutral-900 mb-2">Report Summary</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Report Period</span>
                      <span className="font-medium text-neutral-900">{displayData.period}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Generated At</span>
                      <span className="font-medium text-neutral-900">{formatDate(displayData.generated_at)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Anomalies Found</span>
                      <span className="font-medium text-neutral-900">{displayData.anomalies.length}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Total Revenue</span>
                      <span className="font-medium text-neutral-900">{formatCurrency(displayData.summary.total_revenue, 'NGN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Active Users</span>
                      <span className="font-medium text-neutral-900">{formatNumber(displayData.summary.active_users)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">New Users</span>
                      <span className="font-medium text-neutral-900">{formatNumber(displayData.summary.new_users)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-lime/10 border border-lime/20 rounded-lg p-4 mt-6">
              <h4 className="font-medium text-lime-800 mb-2 flex items-center gap-2">
                <Icon name="info" className="w-4 h-4" />
                Report Features
              </h4>
              <ul className="list-disc list-inside text-sm text-lime-700 space-y-1">
                <li>Comprehensive platform health overview</li>
                <li>Performance metrics and trends</li>
                <li>Revenue analytics by transaction type</li>
                <li>User activity and engagement metrics</li>
                <li>Anomaly detection and alerting</li>
                <li>Exportable in JSON, CSV, and PDF formats</li>
              </ul>
              <Button variant="outline" className="mt-4">
                <Icon name="calendar" className="w-4 h-4 mr-2" />
                Schedule Daily Report
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
