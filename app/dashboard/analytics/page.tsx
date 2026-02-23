"use client";
import React, { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Card from "@/components/ui/Card";
import LineChart from "@/components/charts/LineChart";
import BarChart from "@/components/charts/BarChart";
import PieChart from "@/components/charts/PieChart";
import DateRangeFilter, { RangeKey, rangeToParams } from "@/components/charts/DateRangeFilter";
import type { AnalyticsOverview } from "@/features/analytics/analyticsData";

const kpiIcons: Record<string, React.ReactNode> = {
  revenue: (
    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V6m0 8v2m9-6a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    </span>
  ),
  tickets: (
    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>
    </span>
  ),
  views: (
    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
    </span>
  ),
  conversion: (
    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
    </span>
  ),
};

function fmt(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toLocaleString();
}

export default function AnalyticsPage() {
  const [range, setRange] = useState<RangeKey>("30d");
  const [data, setData] = useState<AnalyticsOverview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    const { from, to } = rangeToParams(range);
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    fetch(`/api/analytics?${params}`)
      .then((r) => r.json())
      .then((d) => setData(d))
      .finally(() => setLoading(false));
  }, [range]);

  const kpis = data
    ? [
      { key: "revenue", label: "Total Revenue", value: `$${fmt(data.totalRevenue)}`, change: data.revenueChange, up: data.revenueChange >= 0 },
      { key: "tickets", label: "Tickets Sold", value: fmt(data.totalTickets), change: data.ticketsChange, up: data.ticketsChange >= 0 },
      { key: "views", label: "Page Views", value: fmt(data.totalViews), change: data.viewsChange, up: data.viewsChange >= 0 },
      { key: "conversion", label: "Conversion", value: `${data.conversionPct}%`, change: data.conversionChange, up: data.conversionChange >= 0 },
    ]
    : [];

  return (
    <ProtectedRoute allowRoles={["organiser"]}>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Analytics</h1>
            <p className="mt-1 text-sm text-neutral-500">Track performance across all your events</p>
          </div>
          <DateRangeFilter value={range} onChange={setRange} />
        </div>

        {loading && !data ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
          </div>
        ) : data ? (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {kpis.map((s) => (
                <Card key={s.key}>
                  <div className="flex items-center justify-between">
                    {kpiIcons[s.key]}
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${s.up ? "bg-success-50 text-success-700" : "bg-red-50 text-red-600"
                        }`}
                    >
                      {s.up ? "+" : ""}
                      {s.change}%
                    </span>
                  </div>
                  <p className="mt-3 text-2xl font-bold text-neutral-900 tabular-nums">{s.value}</p>
                  <p className="mt-1 text-xs text-neutral-500">{s.label}</p>
                </Card>
              ))}
            </div>

            {/* Line Charts */}
            <div className="grid gap-4 lg:grid-cols-2">
              <Card>
                <h2 className="mb-3 text-sm font-semibold text-neutral-900">Revenue Over Time</h2>
                <LineChart
                  data={data.dailyStats.map((d) => ({ label: d.date.slice(5), value: d.revenue }))}
                  color="#6366f1"
                  formatValue={(v) => `$${v.toLocaleString()}`}
                />
              </Card>
              <Card>
                <h2 className="mb-3 text-sm font-semibold text-neutral-900">Ticket Sales Trend</h2>
                <LineChart
                  data={data.dailyStats.map((d) => ({ label: d.date.slice(5), value: d.ticketsSold }))}
                  color="#10b981"
                />
              </Card>
            </div>

            {/* Bar + Pie */}
            <div className="grid gap-4 lg:grid-cols-2">
              <Card>
                <h2 className="mb-3 text-sm font-semibold text-neutral-900">Ticket Type Breakdown</h2>
                <BarChart
                  data={data.ticketMix.map((t) => ({ label: t.type, value: t.count, color: t.color }))}
                />
              </Card>
              <Card>
                <h2 className="mb-3 text-sm font-semibold text-neutral-900">Audience Segments</h2>
                <div className="flex justify-center py-2">
                  <PieChart data={data.audience} />
                </div>
              </Card>
            </div>

            {/* Top Events Table */}
            <Card>
              <h2 className="mb-4 text-sm font-semibold text-neutral-900">Top Performing Events</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-neutral-100">
                      <th className="pb-3 text-left text-xs font-medium text-neutral-500">Event</th>
                      <th className="pb-3 text-right text-xs font-medium text-neutral-500">Sold</th>
                      <th className="pb-3 text-right text-xs font-medium text-neutral-500">Revenue</th>
                      <th className="hidden pb-3 text-right text-xs font-medium text-neutral-500 sm:table-cell">Views</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.topEvents.map((ev, i) => (
                      <tr key={ev.name} className="border-b border-neutral-50 last:border-0">
                        <td className="py-3">
                          <div className="flex items-center gap-3">
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-50 text-xs font-bold text-primary-600">
                              {i + 1}
                            </span>
                            <span className="font-medium text-neutral-900">{ev.name}</span>
                          </div>
                        </td>
                        <td className="py-3 text-right tabular-nums text-neutral-700">{ev.sold.toLocaleString()}</td>
                        <td className="py-3 text-right font-medium tabular-nums text-neutral-900">${ev.revenue.toLocaleString()}</td>
                        <td className="hidden py-3 text-right tabular-nums text-neutral-500 sm:table-cell">{ev.views.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </>
        ) : null}
      </div>
    </ProtectedRoute>
  );
}

