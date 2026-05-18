'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Tabs } from '@/components/ui/Tabs';
import { Select } from '@/components/ui/Select';
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
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[var(--foreground)] sm:text-3xl">Analytics</h1>
              <p className="text-[var(--foreground-muted)]">Track your event performance and insights</p>
            </div>
            <div className="flex items-center gap-3">
              <Select
                value={range}
                onChange={(e) => setRange(e.target.value)}
                options={[
                  { value: '7d', label: 'Last 7 days' },
                  { value: '30d', label: 'Last 30 days' },
                  { value: '90d', label: 'Last 90 days' },
                  { value: '1y', label: 'Last year' },
                ]}
              />
              <Button variant="outline" size="sm">
                <Icon name="download" className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-24 bg-[var(--surface-card)] rounded-lg animate-pulse" />
                ))}
              </div>
              <div className="grid gap-6 lg:grid-cols-2">
                {[1, 2].map(i => (
                  <div key={i} className="h-80 bg-[var(--surface-card)] rounded-lg animate-pulse" />
                ))}
              </div>
            </div>
          ) : data ? (
            <>
              {/* Stats Cards */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map(stat => (
                  <Card key={stat.key} className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-[var(--foreground-muted)]">{stat.label}</p>
                        <p className="text-2xl font-bold text-[var(--foreground)]">{stat.value}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Icon 
                            name={stat.up ? "trending-up" : "trending-down"} 
                            className={`h-4 w-4 ${stat.up ? 'text-success-600' : 'text-danger-600'}`} 
                          />
                          <span className={`text-sm ${stat.up ? 'text-success-600' : 'text-danger-600'}`}>
                            {Math.abs(stat.change)}%
                          </span>
                        </div>
                      </div>
                      <div className="h-12 w-12 rounded-lg bg-primary-100 flex items-center justify-center">
                        <Icon name={
                          stat.key === 'revenue' ? 'dollar-sign' :
                          stat.key === 'tickets' ? 'ticket' :
                          stat.key === 'views' ? 'eye' : 'trending-up'
                        } className="h-6 w-6 text-primary-600" />
                      </div>
                    </div>
                  </Card>
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
                      <Card className="p-6">
                        <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">Revenue Over Time</h3>
                        <div className="h-80">
                          <LineChart
                            data={data.revenueByMonth.map(item => ({
                              label: item.month,
                              value: item.revenue
                            }))}
                            color="var(--primary-500)"
                            formatValue={(v) => `₦${v.toLocaleString()}`}
                          />
                        </div>
                      </Card>
                    )
                  },
                  {
                    id: 'ticket-categories',
                    label: 'Ticket Categories',
                    content: (
                      <Card className="p-6">
                        <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">Tickets by Category</h3>
                        <div className="h-80">
                          <PieChart
                            data={data.ticketsByCategory.map(item => ({
                              label: item.category,
                              value: item.count,
                              color: item.color
                            }))}
                          />
                        </div>
                      </Card>
                    )
                  },
                  {
                    id: 'top-events',
                    label: 'Top Events',
                    content: (
                      <Card className="p-6">
                        <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">Top Performing Events</h3>
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b border-[var(--surface-border)]">
                                <th className="text-left py-3 text-sm font-medium text-[var(--foreground-muted)]">Event</th>
                                <th className="text-right py-3 text-sm font-medium text-[var(--foreground-muted)]">Tickets Sold</th>
                                <th className="text-right py-3 text-sm font-medium text-[var(--foreground-muted)]">Revenue</th>
                                <th className="text-right py-3 text-sm font-medium text-[var(--foreground-muted)]">Views</th>
                              </tr>
                            </thead>
                            <tbody>
                              {data.topEvents.map((ev, i) => (
                                <tr key={ev.name} className="border-b border-[var(--surface-border)] last:border-0">
                                  <td className="py-3">
                                    <div className="flex items-center gap-3">
                                      <div className="h-8 w-8 rounded-lg bg-primary-100 flex items-center justify-center text-sm font-medium text-primary-600">
                                        {i + 1}
                                      </div>
                                      <span className="font-medium text-[var(--foreground)]">{ev.name}</span>
                                    </div>
                                  </td>
                                  <td className="py-3 text-right tabular-nums text-[var(--foreground)]">{ev.sold.toLocaleString()}</td>
                                  <td className="py-3 text-right font-medium tabular-nums text-[var(--foreground)]">₦{ev.revenue.toLocaleString()}</td>
                                  <td className="py-3 text-right tabular-nums text-[var(--foreground-muted)]">{ev.views.toLocaleString()}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </Card>
                    )
                  }
                ]}
              />
            </>
          ) : (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <Icon name="bar-chart" className="h-12 w-12 text-[var(--foreground-muted)] mx-auto mb-4" />
                <h3 className="text-lg font-medium text-[var(--foreground)] mb-2">No Analytics Data</h3>
                <p className="text-[var(--foreground-muted)] mb-4">Create your first event to start seeing analytics</p>
                <Button>Create Event</Button>
              </div>
            </div>
          )}
        </div>
      </PullToRefresh>
    </ProtectedRoute>
  );
}