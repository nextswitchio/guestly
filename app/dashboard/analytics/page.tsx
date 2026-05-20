'use client';

import React from 'react';
import { Icon } from '@/components/ui/Icon';
import { Tabs } from '@/components/ui/Tabs';
import { BarChart } from '@/components/charts/BarChart';
import { LineChart } from '@/components/charts/LineChart';
import { PieChart } from '@/components/charts/PieChart';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { PullToRefresh } from '@/components/ui/PullToRefresh';

interface AnalyticsData {
  totalRevenue: number;
  totalTickets: number;
  totalViews: number;
  conversionPct: number;
  revenueChange: number;
  ticketsChange: number;
  viewsChange: number;
  conversionChange: number;
  topEvents: Array<{
    name: string;
    sold: number;
    revenue: number;
    views: number;
  }>;
  revenueByMonth: Array<{
    month: string;
    revenue: number;
  }>;
  ticketsByCategory: Array<{
    category: string;
    count: number;
    color: string;
  }>;
}

export default function AnalyticsPage() {
  const [data, setData] = React.useState<AnalyticsData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [range, setRange] = React.useState('30d');

  const fmt = (num: number) => num.toLocaleString();

  React.useEffect(() => {
    setLoading(true);
    fetch(`/api/analytics?range=${range}`)
      .then((r) => r.json())
      .then((d) => setData(d))
      .finally(() => setLoading(false));
  }, [range]);

  const stats = data ? [
    { key: "revenue", label: "Total Revenue", value: `₦${fmt(data.totalRevenue)}`, change: data.revenueChange, up: data.revenueChange >= 0 },
    { key: "tickets", label: "Tickets Sold", value: fmt(data.totalTickets), change: data.ticketsChange, up: data.ticketsChange >= 0 },
    { key: "views", label: "Page Views", value: fmt(data.totalViews), change: data.viewsChange, up: data.viewsChange >= 0 },
    { key: "conversion", label: "Conversion", value: `${data.conversionPct}%`, change: data.conversionChange, up: data.conversionChange >= 0 },
  ] : [];

  const handleRefresh = React.useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/analytics?range=${range}`);
      const newData = await response.json();
      setData(newData);
    } catch (error) {
      console.error('Failed to refresh analytics:', error);
    } finally {
      setLoading(false);
    }
  }, [range]);

  return (
    <ProtectedRoute allowRoles={["organiser"]}>
      <PullToRefresh onRefresh={handleRefresh} disabled={loading}>
        <div className="space-y-8">
          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">Analytics</h1>
              <p className="text-neutral-500 mt-1">Track your event performance and insights</p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={range}
                onChange={(e) => setRange(e.target.value)}
                className="h-10 rounded-xl border border-neutral-200 bg-white px-3 text-sm font-medium text-neutral-900 focus:border-lime focus:outline-none focus:ring-2 focus:ring-lime/20"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              <button className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors">
                <Icon name="download" size={16} />
                Export
              </button>
            </div>
          </div>

          {loading ? (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-24 bg-neutral-100 rounded-2xl animate-pulse" />
                ))}
              </div>
              <div className="grid gap-6 lg:grid-cols-2">
                {[1, 2].map(i => (
                  <div key={i} className="h-80 bg-neutral-100 rounded-2xl animate-pulse" />
                ))}
              </div>
            </div>
          ) : data ? (
            <>
              {/* Stats Cards */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map(stat => (
                  <div key={stat.key} className="rounded-2xl border border-neutral-200 bg-white p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-neutral-500">{stat.label}</p>
                        <p className="text-2xl font-bold text-neutral-900">{stat.value}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Icon
                            name={stat.up ? "trending-up" : "trending-down"}
                            size={16}
                            className={stat.up ? 'text-green-600' : 'text-red-600'}
                          />
                          <span className={`text-sm font-medium ${stat.up ? 'text-green-600' : 'text-red-600'}`}>
                            {Math.abs(stat.change)}%
                          </span>
                        </div>
                      </div>
                      <div className="h-12 w-12 rounded-xl bg-lime/10 flex items-center justify-center">
                        <Icon name={
                          stat.key === 'revenue' ? 'dollar-sign' :
                          stat.key === 'tickets' ? 'ticket' :
                          stat.key === 'views' ? 'eye' : 'trending-up'
                        } size={24} className="text-lime" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Charts */}
              <Tabs
                defaultTabId="revenue-trends"
                tabs={[
                  {
                    id: 'revenue-trends',
                    label: 'Revenue Trends',
                    content: (
                      <div className="rounded-2xl border border-neutral-200 bg-white p-6">
                        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Revenue Over Time</h3>
                        <div className="h-80">
                          <LineChart
                            data={data?.revenueByMonth?.map(item => ({
                              label: item.month,
                              value: item.revenue
                            })) || []}
                            color="#84cc16"
                            formatValue={(v) => `₦${v.toLocaleString()}`}
                          />
                        </div>
                      </div>
                    )
                  },
                  {
                    id: 'ticket-categories',
                    label: 'Ticket Categories',
                    content: (
                      <div className="rounded-2xl border border-neutral-200 bg-white p-6">
                        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Tickets by Category</h3>
                        <div className="h-80">
                          <PieChart
                            data={data?.ticketsByCategory?.map(item => ({
                              label: item.category,
                              value: item.count,
                              color: item.color
                            })) || []}
                          />
                        </div>
                      </div>
                    )
                  },
                  {
                    id: 'top-events',
                    label: 'Top Events',
                    content: (
                      <div className="rounded-2xl border border-neutral-200 bg-white p-6">
                        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Top Performing Events</h3>
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b border-neutral-100">
                                <th className="text-left py-3 text-sm font-medium text-neutral-500">Event</th>
                                <th className="text-right py-3 text-sm font-medium text-neutral-500">Tickets Sold</th>
                                <th className="text-right py-3 text-sm font-medium text-neutral-500">Revenue</th>
                                <th className="text-right py-3 text-sm font-medium text-neutral-500">Views</th>
                              </tr>
                            </thead>
                            <tbody>
                              {data?.topEvents?.map((ev, i) => (
                                <tr key={ev.name} className="border-b border-neutral-100 last:border-0">
                                  <td className="py-3">
                                    <div className="flex items-center gap-3">
                                      <div className="h-8 w-8 rounded-lg bg-lime/10 flex items-center justify-center text-sm font-medium text-dark">
                                        {i + 1}
                                      </div>
                                      <span className="font-medium text-neutral-900">{ev.name}</span>
                                    </div>
                                  </td>
                                  <td className="py-3 text-right tabular-nums text-neutral-900">{ev.sold.toLocaleString()}</td>
                                  <td className="py-3 text-right font-medium tabular-nums text-neutral-900">₦{ev.revenue.toLocaleString()}</td>
                                  <td className="py-3 text-right tabular-nums text-neutral-500">{ev.views.toLocaleString()}</td>
                                </tr>
                              )) || []}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )
                  }
                ]}
              />
            </>
          ) : (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <Icon name="bar-chart" size={48} className="text-neutral-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-neutral-900 mb-2">No Analytics Data</h3>
                <p className="text-neutral-500 mb-4">Create your first event to start seeing analytics</p>
                <button className="rounded-xl bg-lime px-5 py-2.5 text-sm font-bold text-dark hover:bg-lime-hover transition-colors">
                  Create Event
                </button>
              </div>
            </div>
          )}
        </div>
      </PullToRefresh>
    </ProtectedRoute>
  );
}
