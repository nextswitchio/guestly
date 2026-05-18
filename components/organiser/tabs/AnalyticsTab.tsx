import { Banknote, Package, ShoppingBag, Tag } from 'lucide-react';
"use client";
import React, { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import LineChart from "@/components/charts/LineChart";
import BarChart from "@/components/charts/BarChart";
import DateRangeFilter, { RangeKey, rangeToParams } from "@/components/charts/DateRangeFilter";

interface EventAnalytics {
  totalRevenue: number;
  totalTickets: number;
  totalViews: number;
  conversionPct: number;
  dailyStats: { date: string; revenue: number; ticketsSold: number; pageViews: number }[];
  ticketMix: { type: string; count: number; color: string }[];
  trafficSources: { name: string; pct: number }[];
}

interface MerchMetrics {
  totalRevenue: number;
  totalProducts: number;
  unitsSold: number;
  conversionRate: number;
  bestSellers: Array<{
    id: string;
    name: string;
    sold: number;
    revenue: number;
    image: string;
  }>;
  productsSold: Array<{
    id: string;
    name: string;
    image: string;
    unitsSold: number;
    revenue: number;
    stock: number;
    category: string;
  }>;
}

function fmt(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toLocaleString();
}

export default function AnalyticsTab({ eventId }: { eventId: string }) {
  const [range, setRange] = useState<RangeKey>("30d");
  const [data, setData] = useState<EventAnalytics | null>(null);
  const [merchData, setMerchData] = useState<MerchMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ eventId });
    const { from, to } = rangeToParams(range);
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    
    // Fetch analytics data
    Promise.all([
      fetch(`/api/analytics?${params}`).then((r) => r.json()),
      fetch(`/api/events/${eventId}/merch/metrics`).then((r) => r.json()),
    ])
      .then(([analyticsData, merchMetrics]) => {
        setData(analyticsData);
        setMerchData(merchMetrics);
      })
      .finally(() => setLoading(false));
  }, [eventId, range]);

  if (loading && !data) {
    return (
      <div className="flex flex-col gap-6 animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 rounded-2xl bg-[var(--surface-card)] border border-[var(--surface-border)] shimmer" />
          ))}
        </div>
        <div className="h-80 rounded-2xl bg-[var(--surface-card)] border border-[var(--surface-border)] shimmer" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-neutral-100 mx-auto mb-4">
            <svg className="h-10 w-10 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-[var(--foreground)]">No analytics data available</p>
          <p className="text-xs text-[var(--foreground-subtle)] mt-1">Data will appear once your event starts receiving traffic</p>
        </div>
      </div>
    );
  }

  const metrics = [
    { 
      label: "Revenue", 
      value: `$${fmt(data.totalRevenue)}`, 
      icon: "money" as const,
      gradient: "from-primary-500 to-primary-700",
      change: "+12.5%",
      trend: "up"
    },
    { 
      label: "Tickets Sold", 
      value: fmt(data.totalTickets), 
      icon: "ticket" as const,
      gradient: "from-warning-500 to-warning-700",
      change: "+8.3%",
      trend: "up"
    },
    { 
      label: "Page Views", 
      value: fmt(data.totalViews), 
      icon: "search" as const,
      gradient: "from-success-500 to-success-700",
      change: "+15.7%",
      trend: "up"
    },
    { 
      label: "Conversion", 
      value: `${data.conversionPct}%`, 
      icon: "trending-up" as const,
      gradient: "from-violet-500 to-violet-700",
      change: "+2.1%",
      trend: "up"
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header with Date Range Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[var(--foreground)]">Analytics Dashboard</h2>
          <p className="text-sm text-[var(--foreground-subtle)] mt-1">Track your event performance and insights</p>
        </div>
        <DateRangeFilter value={range} onChange={setRange} />
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <Card key={m.label} className="relative overflow-hidden group hover:shadow-xl transition-all duration-300">
            <div className={`absolute inset-0 bg-gradient-to-br ${m.gradient} opacity-0 group-hover:opacity-5 transition-opacity`} />
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${m.gradient}`}>
                  <Icon name={m.icon} size={24} className="text-white" />
                </div>
                <span className={`flex items-center gap-1 text-xs font-semibold ${
                  m.trend === "up" ? "text-success-600" : "text-danger-600"
                }`}>
                  <svg className={`h-3 w-3 ${m.trend === "down" ? "rotate-180" : ""}`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  {m.change}
                </span>
              </div>
              <p className="text-sm text-[var(--foreground-subtle)] mb-1">{m.label}</p>
              <p className="text-3xl font-bold text-[var(--foreground)] tabular-nums">{m.value}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Sales Over Time */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-[var(--foreground)]">Sales Over Time</h3>
            <p className="text-sm text-[var(--foreground-subtle)] mt-1">Daily ticket sales performance</p>
          </div>
          <button className="flex items-center gap-2 rounded-lg border border-[var(--surface-border)] bg-[var(--surface-card)] px-3 py-2 text-sm font-medium text-[var(--foreground)] transition hover:bg-[var(--surface-hover)]">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export
          </button>
        </div>
        <LineChart
          data={data.dailyStats.map((d) => ({ label: d.date.slice(5), value: d.ticketsSold }))}
          color="#6366f1"
        />
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ticket Type Breakdown */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-[var(--foreground)] mb-6">Ticket Type Breakdown</h3>
          <BarChart
            data={data.ticketMix.map((t) => ({ label: t.type, value: t.count, color: t.color }))}
            height={240}
          />
        </Card>

        {/* Traffic Sources */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-[var(--foreground)] mb-6">Traffic Sources</h3>
          <div className="space-y-4">
            {data.trafficSources.map((s, idx) => (
              <div key={s.name} className="group">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-100 text-xs font-bold text-primary-700">
                      {idx + 1}
                    </div>
                    <span className="text-sm font-medium text-[var(--foreground)]">{s.name}</span>
                  </div>
                  <span className="text-sm font-bold text-[var(--foreground)] tabular-nums">{s.pct}%</span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-[var(--surface-border)]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary-400 to-primary-600 transition-all duration-700 group-hover:from-primary-500 group-hover:to-primary-700"
                    style={{ width: `${s.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Merchandise Performance Section */}
      {merchData && merchData.totalProducts > 0 && (
        <>
          <div className="flex items-center gap-3 mt-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-success-500 to-success-700">
              <span className="text-xl"><ShoppingBag className="h-4 w-4 inline-block" /></span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-[var(--foreground)]">Merchandise Performance</h2>
              <p className="text-sm text-[var(--foreground-subtle)]">Track your event merchandise sales and revenue</p>
            </div>
          </div>

          {/* Merch Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success-100">
                  <span className="text-xl">Banknote</span>
                </div>
                <div>
                  <p className="text-xs text-[var(--foreground-subtle)]">Merch Revenue</p>
                  <p className="text-2xl font-bold tabular-nums text-success-600">
                    ₦{merchData.totalRevenue.toLocaleString()}
                  </p>
                </div>
              </div>
            </Card>
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100">
                  <span className="text-xl"><Package className="h-4 w-4 inline-block" /></span>
                </div>
                <div>
                  <p className="text-xs text-[var(--foreground-subtle)]">Units Sold</p>
                  <p className="text-2xl font-bold tabular-nums text-primary-600">
                    {merchData.unitsSold.toLocaleString()}
                  </p>
                </div>
              </div>
            </Card>
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning-100">
                  <span className="text-xl"><Tag className="h-4 w-4 inline-block" /></span>
                </div>
                <div>
                  <p className="text-xs text-[var(--foreground-subtle)]">Products</p>
                  <p className="text-2xl font-bold tabular-nums text-warning-600">
                    {merchData.totalProducts}
                  </p>
                </div>
              </div>
            </Card>
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100">
                  <Icon name="chart" size={20} className="text-violet-600" />
                </div>
                <div>
                  <p className="text-xs text-[var(--foreground-subtle)]">Conversion</p>
                  <p className="text-2xl font-bold tabular-nums text-violet-600">
                    {merchData.conversionRate}%
                  </p>
                </div>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Best Sellers */}
            {merchData.bestSellers.length > 0 && (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-[var(--foreground)]">Best-Selling Products</h3>
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-success-100 text-xs font-bold text-success-700">
                    {merchData.bestSellers.length}
                  </span>
                </div>
                <div className="space-y-4">
                  {merchData.bestSellers.map((product, idx) => (
                    <div key={product.id} className="group flex items-center gap-4 rounded-xl border border-[var(--surface-border)] bg-[var(--surface-card)] p-3 transition hover:shadow-md hover:border-success-300">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-success-400 to-success-600 text-2xl shadow-sm">
                        {product.image}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[var(--foreground)] truncate">{product.name}</p>
                        <p className="text-xs text-[var(--foreground-subtle)] mt-0.5">
                          {product.sold} units • ₦{product.revenue.toLocaleString()}
                        </p>
                      </div>
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-warning-400 to-warning-600 text-xs font-bold text-white shadow-sm">
                        #{idx + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Units Sold by Product */}
            {merchData.productsSold.length > 0 && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-[var(--foreground)] mb-6">Units Sold by Product</h3>
                <BarChart
                  data={merchData.productsSold.slice(0, 10).map((p) => ({
                    label: p.name.length > 15 ? p.name.slice(0, 15) + "..." : p.name,
                    value: p.unitsSold,
                    color: "#6366f1",
                  }))}
                  height={240}
                />
              </Card>
            )}
          </div>
        </>
      )}
    </div>
  );
}

