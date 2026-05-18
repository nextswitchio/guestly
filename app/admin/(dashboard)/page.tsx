'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { BarChart } from '@/components/charts/BarChart';
import { LineChart } from '@/components/charts/LineChart';
import { PieChart } from '@/components/charts/PieChart';

interface PlatformMetrics {
  totalEvents: number;
  totalUsers: number;
  totalRevenue: number;
  activeOrganizers: number;
  activeVendors: number;
  monthlyGrowth: {
    events: number;
    users: number;
    revenue: number;
  };
}

interface FraudAlert {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  timestamp: string;
}

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = React.useState<PlatformMetrics | null>(null);
  const [fraudAlerts, setFraudAlerts] = React.useState<FraudAlert[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch('/api/admin/metrics');
        if (response.ok) {
          const data = await response.json();
          setMetrics(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch metrics:', error);
      }
    };

    const fetchFraudAlerts = async () => {
      try {
        const response = await fetch('/api/admin/fraud');
        if (response.ok) {
          const data = await response.json();
          setFraudAlerts(data.data || []);
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
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-32 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[var(--foreground)] md:text-4xl">Global Overview</h1>
        <p className="text-[var(--foreground-muted)]">Real-time platform performance and management</p>
      </div>

      {/* Key Metrics */}
      {metrics && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[var(--foreground-muted)]">Total Events</p>
                <p className="text-2xl font-bold text-[var(--foreground)]">
                  {metrics.totalEvents.toLocaleString()}
                </p>
                <p className="text-xs text-success-600">
                  +{(metrics.monthlyGrowth.events * 100).toFixed(1)}% this month
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
                <p className="text-sm font-medium text-[var(--foreground-muted)]">Total Users</p>
                <p className="text-2xl font-bold text-[var(--foreground)]">
                  {metrics.totalUsers.toLocaleString()}
                </p>
                <p className="text-xs text-success-600">
                  +{(metrics.monthlyGrowth.users * 100).toFixed(1)}% this month
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
                <p className="text-sm font-medium text-[var(--foreground-muted)]">Total Revenue</p>
                <p className="text-2xl font-bold text-[var(--foreground)]">
                  ₦{metrics.totalRevenue.toLocaleString()}
                </p>
                <p className="text-xs text-success-600">
                  +{(metrics.monthlyGrowth.revenue * 100).toFixed(1)}% this month
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
                <p className="text-sm font-medium text-[var(--foreground-muted)]">Active Organizers</p>
                <p className="text-2xl font-bold text-[var(--foreground)]">
                  {metrics.activeOrganizers.toLocaleString()}
                </p>
                <p className="text-xs text-[var(--foreground-muted)]">
                  {metrics.activeVendors} vendors
                </p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-danger-100 flex items-center justify-center">
                <Icon name="briefcase" className="h-6 w-6 text-danger-600" />
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Fraud Alerts */}
      {fraudAlerts.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[var(--foreground)]">Recent Fraud Alerts</h2>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>
          <div className="space-y-3">
            {fraudAlerts.slice(0, 5).map(alert => (
              <div key={alert.id} className="flex items-center justify-between p-3 bg-[var(--surface-elevated)] rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`h-2 w-2 rounded-full ${
                    alert.severity === 'high' ? 'bg-danger-500' :
                    alert.severity === 'medium' ? 'bg-warning-500' : 'bg-success-500'
                  }`} />
                  <div>
                    <p className="text-sm font-medium text-[var(--foreground)]">{alert.type}</p>
                    <p className="text-xs text-[var(--foreground-muted)]">{alert.description}</p>
                  </div>
                </div>
                <p className="text-xs text-[var(--foreground-muted)]">
                  {new Date(alert.timestamp).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">Revenue Trends</h3>
          <div className="h-64">
            <LineChart
              data={[
                { label: "Jan", value: 12000 },
                { label: "Feb", value: 19000 },
                { label: "Mar", value: 15000 },
                { label: "Apr", value: 25000 },
                { label: "May", value: 22000 },
                { label: "Jun", value: 30000 },
              ]}
              color="var(--primary-500)"
            />
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">Event Categories</h3>
          <div className="h-64">
            <PieChart
              data={[
                { label: 'Technology', value: 35, color: 'var(--primary-500)' },
                { label: 'Business', value: 25, color: 'var(--success-500)' },
                { label: 'Entertainment', value: 20, color: 'var(--warning-500)' },
                { label: 'Education', value: 15, color: 'var(--danger-500)' },
                { label: 'Other', value: 5, color: 'var(--neutral-500)' },
              ]}
            />
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">Quick Actions</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Button variant="outline" className="justify-start">
            <Icon name="users" className="h-4 w-4 mr-2" />
            Manage Users
          </Button>
          <Button variant="outline" className="justify-start">
            <Icon name="calendar" className="h-4 w-4 mr-2" />
            Review Events
          </Button>
          <Button variant="outline" className="justify-start">
            <Icon name="alert-triangle" className="h-4 w-4 mr-2" />
            Handle Disputes
          </Button>
          <Button variant="outline" className="justify-start">
            <Icon name="settings" className="h-4 w-4 mr-2" />
            Platform Settings
          </Button>
        </div>
      </Card>
    </div>
  );
}