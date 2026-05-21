"use client";
import React, { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import { BarChart, LineChart, PieChart } from "@/components/charts";

type ChartPoint = { label: string; value: number; color?: string };

interface DashboardMetrics {
  total_users?: number;
  total_events?: number;
  total_orders?: number;
  total_revenue?: number;
  active_users?: number;
  published_events?: number;
  pending_disputes?: number;
  pending_withdrawals?: number;
  growth_data?: ChartPoint[];
}

interface PlatformGrowthPoint {
  label: string;
  events: number;
  users: number;
  revenue: number;
}

interface PlatformMetrics {
  totalEvents?: number;
  totalUsers?: number;
  totalRevenue?: number;
  totalCommission?: number;
  activeOrganizers?: number;
  activeVendors?: number;
  activeUsers?: number;
  growthTrends?: {
    events?: number;
    users?: number;
    revenue?: number;
    organizers?: number;
    vendors?: number;
  };
}

interface TopEvent {
  id: string;
  title: string;
  revenue?: number;
  ticketsSold?: number;
  orders?: number;
}

interface MetricsApiResponse {
  success: boolean;
  data?: {
    metrics?: PlatformMetrics;
    growthData?: PlatformGrowthPoint[];
    topEvents?: TopEvent[];
    categoryRevenue?: Array<{ category: string; revenue: number }>;
  };
}

interface AnalyticsState {
  dashboard: Required<Omit<DashboardMetrics, "growth_data">>;
  revenueTrend: ChartPoint[];
  userTrend: ChartPoint[];
  commissionTrend: ChartPoint[];
  categoryData: ChartPoint[];
  topEvents: TopEvent[];
  growthTrends?: PlatformMetrics["growthTrends"];
}

const ADMIN_CHART_COLORS = [
  "var(--color-primary-500)",
  "var(--color-primary-400)",
  "var(--color-primary-300)",
  "var(--color-navy-500)",
  "var(--color-navy-300)",
  "var(--color-navy-700)",
];

const emptyDashboard: AnalyticsState["dashboard"] = {
  total_users: 0,
  total_events: 0,
  total_orders: 0,
  total_revenue: 0,
  active_users: 0,
  published_events: 0,
  pending_disputes: 0,
  pending_withdrawals: 0,
};

function toNumber(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch ${url}:`, error);
    return null;
  }
}

function normalizeChartData(data: unknown): ChartPoint[] {
  if (!Array.isArray(data)) return [];

  return data
    .map((point) => {
      if (!point || typeof point !== "object") return null;
      const item = point as Record<string, unknown>;
      const label = typeof item.label === "string" ? item.label : "";
      return {
        label,
        value: toNumber(item.value),
      };
    })
    .filter((point): point is ChartPoint => Boolean(point?.label));
}

function buildAnalytics(
  dashboard: DashboardMetrics | null,
  platform: MetricsApiResponse | null,
  commissionResponse: { data?: unknown } | ChartPoint[] | null
): AnalyticsState | null {
  const platformData = platform?.success !== false ? platform?.data : undefined;
  const platformMetrics = platformData?.metrics;

  if (!dashboard && !platformData) return null;

  const growthData = platformData?.growthData ?? [];
  const revenueTrend = growthData.length > 0
    ? growthData.map((point) => ({ label: point.label, value: toNumber(point.revenue) }))
    : normalizeChartData(dashboard?.growth_data);
  const userTrend = growthData.length > 0
    ? growthData.map((point) => ({ label: point.label, value: toNumber(point.users) }))
    : [
        { label: "Users", value: toNumber(dashboard?.total_users ?? platformMetrics?.totalUsers) },
        { label: "Active", value: toNumber(dashboard?.active_users ?? platformMetrics?.activeUsers) },
      ];

  const commissionPayload = Array.isArray(commissionResponse)
    ? commissionResponse
    : commissionResponse?.data;
  const commissionTrend = normalizeChartData(commissionPayload);

  return {
    dashboard: {
      ...emptyDashboard,
      total_users: toNumber(dashboard?.total_users ?? platformMetrics?.totalUsers),
      total_events: toNumber(dashboard?.total_events ?? platformMetrics?.totalEvents),
      total_orders: toNumber(dashboard?.total_orders),
      total_revenue: toNumber(dashboard?.total_revenue ?? platformMetrics?.totalRevenue),
      active_users: toNumber(dashboard?.active_users ?? platformMetrics?.activeUsers),
      published_events: toNumber(dashboard?.published_events ?? platformMetrics?.totalEvents),
      pending_disputes: toNumber(dashboard?.pending_disputes),
      pending_withdrawals: toNumber(dashboard?.pending_withdrawals),
    },
    revenueTrend,
    userTrend,
    commissionTrend,
    categoryData: (platformData?.categoryRevenue ?? []).map((item, index) => ({
      label: item.category,
      value: toNumber(item.revenue),
      color: ADMIN_CHART_COLORS[index % ADMIN_CHART_COLORS.length],
    })),
    topEvents: platformData?.topEvents ?? [],
    growthTrends: platformMetrics?.growthTrends,
  };
}

function formatCurrency(value: number): string {
  return `₦${value.toLocaleString("en-NG", { maximumFractionDigits: 0 })}`;
}

function formatTrend(value?: number): string {
  const numeric = toNumber(value);
  if (numeric === 0) return "0%";
  return `${numeric > 0 ? "+" : ""}${numeric}%`;
}

export default function AdminAnalyticsPage() {
  const [metrics, setMetrics] = useState<AnalyticsState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadMetrics() {
      const [dashboard, platform, commissionTrends] = await Promise.all([
        fetchJson<DashboardMetrics>("/api/admin?sub=dashboard"),
        fetchJson<MetricsApiResponse>("/api/admin/metrics?period=month"),
        fetchJson<{ success: boolean; data?: ChartPoint[] }>("/api/admin/commissions?action=trends&months=6"),
      ]);

      if (!active) return;

      const analytics = buildAnalytics(dashboard, platform, commissionTrends);
      setMetrics(analytics);

      if (!analytics) {
        setError("Analytics data is unavailable right now.");
      }
      setLoading(false);
    }

    loadMetrics().catch((e) => {
      console.error(e);
      if (!active) return;
      setError("Analytics data is unavailable right now.");
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-neutral-200 rounded w-48 mb-2" />
          <div className="h-4 bg-neutral-200 rounded w-72" />
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="h-28 rounded-2xl bg-neutral-200 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
        <p className="text-sm text-slate-500">Platform-wide analytics and insights</p>
      </div>

      {error && (
        <Card className="p-6">
          <p className="text-sm font-medium text-slate-900">{error}</p>
          <p className="mt-1 text-sm text-slate-500">Check that the admin session and backend services are active.</p>
        </Card>
      )}

      {metrics && (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="p-6">
              <h3 className="text-sm text-slate-500">Total Users</h3>
              <p className="text-2xl font-bold text-slate-900">{metrics.dashboard.total_users.toLocaleString()}</p>
              <p className="text-xs text-slate-500">{metrics.dashboard.active_users.toLocaleString()} active</p>
            </Card>
            <Card className="p-6">
              <h3 className="text-sm text-slate-500">Total Events</h3>
              <p className="text-2xl font-bold text-slate-900">{metrics.dashboard.total_events.toLocaleString()}</p>
              <p className="text-xs text-slate-500">{metrics.dashboard.published_events.toLocaleString()} published</p>
            </Card>
            <Card className="p-6">
              <h3 className="text-sm text-slate-500">Total Orders</h3>
              <p className="text-2xl font-bold text-slate-900">{metrics.dashboard.total_orders.toLocaleString()}</p>
              <p className="text-xs text-slate-500">
                {metrics.dashboard.pending_disputes + metrics.dashboard.pending_withdrawals} pending actions
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="text-sm text-slate-500">Total Revenue</h3>
              <p className="text-2xl font-bold text-slate-900">{formatCurrency(metrics.dashboard.total_revenue)}</p>
              <p className="text-xs text-slate-500">{formatTrend(metrics.growthTrends?.revenue)} this period</p>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card className="p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Revenue Trends</h3>
              <div className="h-64">
                <LineChart
                  data={metrics.revenueTrend}
                  color={ADMIN_CHART_COLORS[0]}
                  formatValue={formatCurrency}
                />
              </div>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold text-slate-900 mb-4">User Growth</h3>
              <div className="h-64">
                <LineChart
                  data={metrics.userTrend}
                  color={ADMIN_CHART_COLORS[3]}
                />
              </div>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Platform Mix</h3>
              <div className="h-64">
                <BarChart
                  data={[
                    { label: "Users", value: metrics.dashboard.total_users, color: ADMIN_CHART_COLORS[0] },
                    { label: "Events", value: metrics.dashboard.total_events, color: ADMIN_CHART_COLORS[1] },
                    { label: "Orders", value: metrics.dashboard.total_orders, color: ADMIN_CHART_COLORS[3] },
                  ]}
                />
              </div>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Revenue by Category</h3>
              <div className="h-64">
                <PieChart data={metrics.categoryData} />
              </div>
            </Card>
          </div>

          {metrics.commissionTrend.length > 0 && (
            <Card className="p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Commission Trends</h3>
              <div className="h-64">
                <LineChart
                  data={metrics.commissionTrend}
                  color={ADMIN_CHART_COLORS[2]}
                  formatValue={formatCurrency}
                />
              </div>
            </Card>
          )}

          {metrics.topEvents.length > 0 && (
            <Card className="p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Top Performing Events</h3>
              <div className="divide-y divide-neutral-100">
                {metrics.topEvents.map((event) => (
                  <div key={event.id} className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{event.title}</p>
                      <p className="text-xs text-slate-500">
                        {toNumber(event.ticketsSold).toLocaleString()} tickets · {toNumber(event.orders).toLocaleString()} orders
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-slate-900">{formatCurrency(toNumber(event.revenue))}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
