"use client";
import React, { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import { BarChart, LineChart } from "@/components/charts";

export default function AdminAnalyticsPage() {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const [dashboardRes, commissionsRes] = await Promise.all([
        fetch("/api/admin/dashboard"),
        fetch("/api/admin/commissions/trends"),
      ]);
      if (dashboardRes.ok && commissionsRes.ok) {
        const dashboard = await dashboardRes.json();
        const trends = await commissionsRes.json();
        setMetrics({ dashboard, trends });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Analytics</h1>
        <p className="text-sm text-[var(--foreground-muted)]">Platform-wide analytics and insights</p>
      </div>

      {metrics && (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="p-6">
              <h3 className="text-sm text-[var(--foreground-muted)]">Total Users</h3>
              <p className="text-2xl font-bold text-[var(--foreground)]">{metrics.dashboard.total_users}</p>
            </Card>
            <Card className="p-6">
              <h3 className="text-sm text-[var(--foreground-muted)]">Total Events</h3>
              <p className="text-2xl font-bold text-[var(--foreground)]">{metrics.dashboard.total_events}</p>
            </Card>
            <Card className="p-6">
              <h3 className="text-sm text-[var(--foreground-muted)]">Total Orders</h3>
              <p className="text-2xl font-bold text-[var(--foreground)]">{metrics.dashboard.total_orders}</p>
            </Card>
            <Card className="p-6">
              <h3 className="text-sm text-[var(--foreground-muted)]">Total Revenue</h3>
              <p className="text-2xl font-bold text-[var(--foreground)]">₦{metrics.dashboard.total_revenue?.toLocaleString()}</p>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card className="p-6">
              <h3 className="font-semibold text-[var(--foreground)] mb-4">Revenue Trends</h3>
              <div className="h-64">
                <LineChart data={metrics.trends || []} color="#4392F1" />
              </div>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold text-[var(--foreground)] mb-4">User Growth</h3>
              <div className="h-64">
                <BarChart data={[
                  { label: "Users", value: metrics.dashboard.total_users },
                  { label: "Events", value: metrics.dashboard.total_events },
                  { label: "Orders", value: metrics.dashboard.total_orders },
                ]} />
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
