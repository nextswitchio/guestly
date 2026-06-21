"use client";

import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";

interface VendorAnalyticsData {
  profileViews: number;
  invitationsSent: number;
  invitationsAccepted: number;
  conversionRate: number;
  eventsCompleted: number;
  averageRating: number;
  averageResponseTime: number;
  reliabilityScore: number;
  acceptanceRate: number;
  totalEarnings: number;
  viewsThisMonth: number;
  viewsLastMonth: number;
  topCategories: Array<{ category: string; count: number }>;
}

interface VendorAnalyticsProps {
  vendorId: string;
}

export default function VendorAnalytics({ vendorId }: VendorAnalyticsProps) {
  const [analytics, setAnalytics] = useState<VendorAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [vendorId]);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch(`/api/vendor/analytics?vendorId=${vendorId}`);
      if (res.ok) {
        const data = await res.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-[var(--surface-card)] rounded w-24 mb-2"></div>
              <div className="h-8 bg-[var(--surface-card)] rounded w-16"></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (!analytics) {
    return (
      <Card className="p-6">
        <p className="text-[var(--foreground-muted)]">
          Analytics data not available
        </p>
      </Card>
    );
  }

  const viewsGrowth = analytics.viewsLastMonth > 0
    ? ((analytics.viewsThisMonth - analytics.viewsLastMonth) / analytics.viewsLastMonth) * 100
    : 0;

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[var(--foreground-muted)]">
              Profile Views
            </span>
            <svg
              className="w-5 h-5 text-primary-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          </div>
          <div className="text-3xl font-bold text-[var(--foreground)] mb-1">
            {analytics.profileViews.toLocaleString()}
          </div>
          {viewsGrowth !== 0 && (
            <div className={`text-sm ${viewsGrowth > 0 ? "text-success-500" : "text-danger-500"}`}>
              {viewsGrowth > 0 ? "↑" : "↓"} {Math.abs(viewsGrowth).toFixed(1)}% vs last month
            </div>
          )}
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[var(--foreground-muted)]">
              Invitations
            </span>
            <svg
              className="w-5 h-5 text-success-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div className="text-3xl font-bold text-[var(--foreground)] mb-1">
            {analytics.invitationsSent}
          </div>
          <div className="text-sm text-[var(--foreground-muted)]">
            {analytics.invitationsAccepted} accepted
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[var(--foreground-muted)]">
              Conversion Rate
            </span>
            <svg
              className="w-5 h-5 text-warning-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
          </div>
          <div className="text-3xl font-bold text-[var(--foreground)] mb-1">
            {analytics.conversionRate.toFixed(1)}%
          </div>
          <div className="text-sm text-[var(--foreground-muted)]">
            Invitation to booking
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[var(--foreground-muted)]">
              Average Rating
            </span>
            <svg
              className="w-5 h-5 text-warning-500"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>
          <div className="text-3xl font-bold text-[var(--foreground)] mb-1">
            {analytics.averageRating.toFixed(1)}
          </div>
          <div className="text-sm text-[var(--foreground-muted)]">
            {analytics.eventsCompleted} events completed
          </div>
        </Card>
      </div>

      {/* Performance Chart */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">
          Performance Overview
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="text-sm text-[var(--foreground-muted)] mb-2">
              Total Earnings
            </div>
            <div className="text-2xl font-bold text-[var(--foreground)]">
              ₦{(analytics.totalEarnings / 100).toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-sm text-[var(--foreground-muted)] mb-2">
              Events Completed
            </div>
            <div className="text-2xl font-bold text-[var(--foreground)]">
              {analytics.eventsCompleted}
            </div>
          </div>
          <div>
            <div className="text-sm text-[var(--foreground-muted)] mb-2">
              Success Rate
            </div>
            <div className="text-2xl font-bold text-[var(--foreground)]">
              {analytics.invitationsSent > 0
                ? ((analytics.invitationsAccepted / analytics.invitationsSent) * 100).toFixed(1)
                : 0}%
            </div>
          </div>
        </div>
      </Card>

      {/* Performance Metrics */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">
          Performance Metrics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[var(--foreground-muted)]">
                Reliability Score
              </span>
              <svg
                className="w-5 h-5 text-success-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="text-3xl font-bold text-[var(--foreground)] mb-2">
              {analytics.reliabilityScore.toFixed(0)}
            </div>
            <div className="w-full h-2 bg-[var(--surface-card)] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  analytics.reliabilityScore >= 80
                    ? "bg-success-500"
                    : analytics.reliabilityScore >= 60
                    ? "bg-warning-500"
                    : "bg-danger-500"
                }`}
                style={{ width: `${analytics.reliabilityScore}%` }}
              ></div>
            </div>
            <div className="text-xs text-[var(--foreground-muted)] mt-1">
              Based on acceptance rate, response time, and ratings
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[var(--foreground-muted)]">
                Avg Response Time
              </span>
              <svg
                className="w-5 h-5 text-primary-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="text-3xl font-bold text-[var(--foreground)] mb-2">
              {analytics.averageResponseTime < 1
                ? `${(analytics.averageResponseTime * 60).toFixed(0)}m`
                : `${analytics.averageResponseTime.toFixed(1)}h`}
            </div>
            <div className="text-xs text-[var(--foreground-muted)]">
              Time to respond to invitations
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[var(--foreground-muted)]">
                Acceptance Rate
              </span>
              <svg
                className="w-5 h-5 text-success-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div className="text-3xl font-bold text-[var(--foreground)] mb-2">
              {analytics.acceptanceRate.toFixed(1)}%
            </div>
            <div className="text-xs text-[var(--foreground-muted)]">
              {analytics.invitationsAccepted} of {analytics.invitationsSent} invitations accepted
            </div>
          </div>
        </div>
      </Card>

      {/* Top Event Categories */}
      {analytics.topCategories.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">
            Top Event Categories
          </h3>
          <div className="space-y-3">
            {analytics.topCategories.map((cat, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="text-sm text-[var(--foreground)]">
                  {cat.category}
                </span>
                <div className="flex items-center gap-3">
                  <div className="w-32 h-2 bg-[var(--surface-card)] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary-500 rounded-full"
                      style={{
                        width: `${(cat.count / analytics.eventsCompleted) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-[var(--foreground)] w-8 text-right">
                    {cat.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
