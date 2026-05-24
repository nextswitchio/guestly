'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { LineChart } from '@/components/charts/LineChart';
import { PieChart } from '@/components/charts/PieChart';

interface PlatformMetrics {
  total_users: number;
  total_events: number;
  total_orders: number;
  total_revenue: number;
  active_users: number;
  published_events: number;
  pending_disputes: number;
  pending_withdrawals: number;
  growth_data: Array<{ label: string; value: number }>;
}

interface FraudAlert {
  id: string;
  type: string;
  status: string;
  description: string;
  created_at: string;
}

const ADMIN_CHART_COLORS = [
  'var(--color-primary-500)',
  'var(--color-primary-400)',
  'var(--color-primary-300)',
  'var(--color-navy-500)',
  'var(--color-navy-300)',
  'var(--color-navy-700)',
];

export default function AdminDashboardPage() {
  const router = useRouter();
  const [metrics, setMetrics] = React.useState<PlatformMetrics | null>(null);
  const [fraudAlerts, setFraudAlerts] = React.useState<FraudAlert[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch('/api/admin?sub=dashboard');
        if (response.ok) {
          const data = await response.json();
          setMetrics(data);
        }
      } catch (error) {
        console.error('Failed to fetch metrics:', error);
      }
    };

    const fetchFraudAlerts = async () => {
      try {
        const response = await fetch('/api/admin?sub=fraud');
        if (response.ok) {
          const data = await response.json();
          setFraudAlerts(Array.isArray(data) ? data.slice(0, 5) : []);
        }
      } catch (error) {
        console.error('Failed to fetch fraud alerts:', error);
      }
    };

    Promise.all([fetchMetrics(), fetchFraudAlerts()]).finally(() => {
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-neutral-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-neutral-200 rounded w-1/2"></div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-32 bg-neutral-200 rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">Global Overview</h1>
        <p className="text-slate-500 mt-1">Real-time platform performance and management</p>
      </div>

      {/* Key Metrics */}
      {metrics && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Total Events</p>
                <p className="text-2xl font-bold text-slate-900">
                  {metrics.total_events.toLocaleString()}
                </p>
                <p className="text-xs text-slate-500">
                  {metrics.published_events} published
                </p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-primary-100 flex items-center justify-center">
                <Icon name="calendar" className="h-6 w-6 text-primary-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Total Users</p>
                <p className="text-2xl font-bold text-slate-900">
                  {metrics.total_users.toLocaleString()}
                </p>
                <p className="text-xs text-slate-500">
                  {metrics.active_users} active
                </p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-success-100 flex items-center justify-center">
                <Icon name="users" className="h-6 w-6 text-success-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Total Revenue</p>
                <p className="text-2xl font-bold text-slate-900">
                  ₦{metrics.total_revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-slate-500">
                  {metrics.total_orders} orders
                </p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-warning-100 flex items-center justify-center">
                <Icon name="dollar-sign" className="h-6 w-6 text-warning-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Pending Actions</p>
                <p className="text-2xl font-bold text-slate-900">
                  {metrics.pending_disputes + metrics.pending_withdrawals}
                </p>
                <p className="text-xs text-slate-500">
                  {metrics.pending_disputes} disputes, {metrics.pending_withdrawals} withdrawals
                </p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-danger-100 flex items-center justify-center">
                <Icon name="alert-triangle" className="h-6 w-6 text-danger-600" />
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Fraud Alerts */}
      {fraudAlerts.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Recent Fraud Alerts</h2>
            <Button variant="outline" size="sm" onClick={() => router.push('/admin/fraud')}>
              View All
            </Button>
          </div>
          <div className="space-y-3">
            {fraudAlerts.map(alert => (
              <div key={alert.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg border border-neutral-100">
                <div className="flex items-center gap-3">
                  <div className={`h-2 w-2 rounded-full ${
                    alert.status === 'confirmed' ? 'bg-danger-500' :
                    alert.status === 'under_review' ? 'bg-warning-500' : 'bg-success-500'
                  }`} />
                  <div>
                    <p className="text-sm font-medium text-slate-900">{alert.type}</p>
                    <p className="text-xs text-slate-500">{alert.description}</p>
                  </div>
                </div>
                <p className="text-xs text-slate-500">
                  {new Date(alert.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Revenue Trends</h3>
          <div className="h-64">
            {metrics?.growth_data && metrics.growth_data.length > 0 ? (
              <LineChart data={metrics.growth_data} color={ADMIN_CHART_COLORS[0]} />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-slate-400">
                No revenue data yet
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Event Categories</h3>
          <div className="h-64">
            {metrics && metrics.total_events > 0 ? (
              <PieChart
                data={[
                  { label: 'Published', value: metrics.published_events, color: ADMIN_CHART_COLORS[0] },
                  { label: 'Draft', value: Math.max(0, metrics.total_events - metrics.published_events), color: ADMIN_CHART_COLORS[3] },
                ].filter((d) => d.value > 0)}
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-slate-400">
                No events yet
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Button variant="outline" className="justify-start" onClick={() => router.push('/admin/users')}>
            <Icon name="users" className="h-4 w-4 mr-2" />
            Manage Users
          </Button>
          <Button variant="outline" className="justify-start" onClick={() => router.push('/admin/events')}>
            <Icon name="calendar" className="h-4 w-4 mr-2" />
            Review Events
          </Button>
          <Button variant="outline" className="justify-start" onClick={() => router.push('/admin/disputes')}>
            <Icon name="alert-triangle" className="h-4 w-4 mr-2" />
            Handle Disputes
          </Button>
          <Button variant="outline" className="justify-start" onClick={() => router.push('/admin/settings')}>
            <Icon name="settings" className="h-4 w-4 mr-2" />
            Platform Settings
          </Button>
        </div>
      </Card>
    </div>
  );
}
