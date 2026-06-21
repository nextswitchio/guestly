"use client";
import React, { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Link from "next/link";
import Image from "next/image";
import Icon from "@/components/ui/Icon";
import { RevenueWidget } from "@/components/organizer/widgets/RevenueWidget";
import { RealTimeFeed } from "@/components/organizer/widgets/RealTimeFeed";
import { QuickActionCards } from "@/components/organizer/widgets/QuickActionCards";
import { SettlementWidget } from "@/components/organizer/widgets/SettlementWidget";
import { MerchandiseWidget } from "@/components/organizer/widgets/MerchandiseWidget";
import StatusIndicator from "@/components/ui/StatusIndicator";
import EmptyState from "@/components/ui/EmptyState";

const quickActions = [
  { label: "Create Event", href: "/organizer/dashboard/events/new", iconName: "plus" as const, color: "bg-lime text-dark font-bold hover:bg-lime-hover" },
  { label: "View Events", href: "/organizer/dashboard/events", iconName: "calendar" as const, color: "bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-50" },
  { label: "Analytics", href: "/organizer/dashboard/analytics", iconName: "chart" as const, color: "bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-50" },
  { label: "Wallet", href: "/organizer/dashboard/wallet", iconName: "wallet" as const, color: "bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-50" },
];

interface DashboardData {
  totalRevenue: number;
  ticketsSold: number;
  totalEvents: number;
  upcomingEvents: number;
  walletBalance: number;
  totalSettled: number;
  pendingSettlement: number;
  recentOrders: Array<{ name: string; event: string; amount: number; createdAt: string | null }>;
  monthlyRevenueTrend: Array<{ label: string; value: number }>;
  recentEvents: Array<{ id: string; title: string; date: string | null; city: string; status: string; image: string | null }>;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [merchStats, setMerchStats] = useState<{
    totalProducts: number; unitsSold: number; revenue: number;
    bestSellers: Array<{ id: string; name: string; sold: number; revenue: number; image: string; eventId: string }>;
  } | null>(null);

  useEffect(() => {
    fetch("/api/analytics")
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false));

    fetch("/api/merch?stats=true")
      .then((r) => r.json())
      .then((d) => setMerchStats(d))
      .catch(() => {});
  }, []);

  const formatMoney = (n: number) => {
    if (n >= 1_000_000) return `₦${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `₦${(n / 1_000).toFixed(1)}K`;
    return `₦${n.toLocaleString()}`;
  };

  const formatNumber = (n: number | null | undefined) => {
    const num = Number(n) || 0;
    return num.toLocaleString();
  };

  const stats = data
    ? [
        { label: "Total Revenue", value: formatMoney(data.totalRevenue || 0), iconName: "money" as const },
        { label: "Tickets Sold", value: formatNumber(data.ticketsSold), iconName: "ticket" as const },
        { label: "Total Events", value: String(data.totalEvents || 0), change: `${data.upcomingEvents || 0} upcoming`, iconName: "calendar" as const },
        { label: "Wallet Balance", value: formatMoney(data.walletBalance || 0), iconName: "wallet" as const },
      ]
    : [];

  const revenueWidgetData = (data?.monthlyRevenueTrend ?? []).map((m) => ({
    month: m.label || "",
    pct: 0,
    val: formatMoney(m.value || 0),
  }));

  // Normalise pct relative to max value for the bar chart
  const monthlyValues = (data?.monthlyRevenueTrend ?? []).map((m) => m.value || 0);
  const maxVal = Math.max(...monthlyValues, 1);
  revenueWidgetData.forEach((m, i) => {
    const value = monthlyValues[i] || 0;
    m.pct = Math.round((value / maxVal) * 100);
  });

  const liveFeedItems = (data?.recentOrders ?? []).map((o) => ({
    name: o.name || "Unknown",
    ticket: "",
    event: o.event || "Unknown Event",
    time: o.createdAt
      ? (() => {
          try {
            const diff = Math.floor((Date.now() - new Date(o.createdAt).getTime()) / 60000);
            return diff < 60 ? `${diff}m ago` : `${Math.floor(diff / 60)}h ago`;
          } catch {
            return "recently";
          }
        })()
      : "",
  }));

  const settlementData = data
    ? {
        totalEarned: formatMoney(data.totalRevenue || 0),
        pending: formatMoney(data.pendingSettlement || 0),
        settled: formatMoney(data.totalSettled || 0),
        settlementPercentage:
          (data.totalRevenue || 0) > 0 ? Math.round(((data.totalSettled || 0) / (data.totalRevenue || 1)) * 100) : 0,
      }
    : { totalEarned: "₦0", pending: "₦0", settled: "₦0", settlementPercentage: 0 };

  if (loading) {
    return (
      <ProtectedRoute allowRoles={["organiser"]}>
        <div className="space-y-8 animate-pulse">
          <div className="h-10 bg-neutral-100 rounded w-48" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => <div key={i} className="h-28 bg-neutral-100 rounded-2xl" />)}
          </div>
          <div className="h-64 bg-neutral-100 rounded-2xl" />
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowRoles={["organiser"]}>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Dashboard</h1>
            <p className="text-sm text-neutral-500">Welcome back! Here&apos;s an overview of your events and performance.</p>
          </div>
          <Link
            href="/organizer/dashboard/events/new"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-lime px-6 text-sm font-bold text-dark shadow-md transition-all hover:bg-lime-hover hover:shadow-lg hover:scale-105"
          >
            <Icon name="plus" size={16} />
            Create Event
          </Link>
        </div>

        {/* Stats Grid */}
        {stats.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-neutral-200 bg-white p-5 transition-all hover:shadow-xl group">
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-100 text-neutral-700 transition-transform group-hover:scale-110">
                    <Icon name={stat.iconName} size={20} />
                  </div>
                  {"change" in stat && (
                    <span className="text-xs font-medium text-neutral-500">{stat.change}</span>
                  )}
                </div>
                <div className="mt-4 space-y-1">
                  <p className="text-3xl font-bold tabular-nums tracking-tight text-neutral-900">{stat.value}</p>
                  <p className="text-sm font-medium text-neutral-500">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <QuickActionCards actions={quickActions} title="Quick Actions" />

        {/* Main Content */}
        <div className="space-y-6">
          {/* Revenue & Live Feed */}
          {revenueWidgetData.length > 0 && (
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <RevenueWidget
                  data={revenueWidgetData}
                  total={formatMoney(data?.totalRevenue ?? 0)}
                  title="Revenue Overview"
                  subtitle="Last 6 months"
                />
              </div>
              <div className="lg:col-span-1">
                <RealTimeFeed
                  items={liveFeedItems.length > 0 ? liveFeedItems : []}
                  title="Recent Sales"
                />
              </div>
            </div>
          )}

          {/* Recent Events */}
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-2xl border border-neutral-200 bg-white p-5 lg:col-span-2">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-neutral-900">Recent Events</h2>
                  <p className="text-sm text-neutral-500">Your latest events</p>
                </div>
                <Link href="/organizer/dashboard/events" className="inline-flex items-center gap-1 text-sm font-semibold text-lime-600 hover:text-lime-700 transition-colors">
                  View all <Icon name="arrow-right" size={14} />
                </Link>
              </div>

              {(data?.recentEvents ?? []).length === 0 ? (
                <EmptyState
                  icon="calendar"
                  title="No events yet"
                  description="Create your first event to get started."
                  action={{ label: "Create Event", href: "/organizer/dashboard/events/new" }}
                />
              ) : (
                <div className="space-y-3">
                  {(data?.recentEvents ?? []).map((ev) => (
                    <div key={ev.id} className="flex items-center gap-4 rounded-xl p-3 transition-all hover:bg-neutral-50 group">
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-neutral-100 ring-1 ring-neutral-200 group-hover:ring-lime transition-all">
                        {ev.image && (
                          <Image src={ev.image} alt={ev.title || "Event"} width={56} height={56} className="h-full w-full object-cover transition-transform group-hover:scale-110" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-neutral-900 group-hover:text-lime-600 transition-colors">{ev.title || "Untitled Event"}</p>
                        <div className="mt-1 flex items-center gap-2 text-xs text-neutral-500">
                          {ev.date && (
                            <span className="flex items-center gap-1">
                              <Icon name="calendar" size={12} />
                              {(() => {
                                try {
                                  return new Date(ev.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
                                } catch {
                                  return ev.date;
                                }
                              })()}
                            </span>
                          )}
                          {ev.city && <><span>•</span><span className="flex items-center gap-1"><Icon name="location" size={12} />{ev.city}</span></>}
                        </div>
                      </div>
                      <StatusIndicator status={(ev.status === "published" || ev.status === "ongoing") ? "active" : "inactive"} />
                      <Link
                        href={`/dashboard/events/${ev.id}/manage`}
                        className="shrink-0 rounded-lg border border-neutral-200 bg-white px-4 py-2 text-xs font-semibold text-neutral-700 transition-all hover:border-lime hover:bg-lime/10 hover:text-lime-700"
                      >
                        Manage
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Ticket Sales Summary */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-5 transition-all hover:shadow-xl">
              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-bold text-neutral-900">Ticket Sales</h2>
                  <p className="text-sm text-neutral-500">All time</p>
                </div>
                <div className="space-y-2">
                  <p className="text-3xl font-bold text-neutral-900">{formatNumber(data?.ticketsSold)}</p>
                  <p className="text-sm text-neutral-500">across {data?.totalEvents ?? 0} event{(data?.totalEvents ?? 0) !== 1 ? "s" : ""}</p>
                </div>
                {revenueWidgetData.length > 0 && (
                  <div className="flex items-end gap-1 h-20 pt-4">
                    {revenueWidgetData.map((m, i) => (
                      <div
                        key={i}
                        className={`flex-1 rounded-t-md transition-all hover:scale-110 ${i === revenueWidgetData.length - 1 ? "bg-lime shadow-lg" : "bg-lime/20 hover:bg-lime/40"}`}
                        style={{ height: `${Math.max(m.pct, 4)}%` }}
                        title={`${m.month}: ${m.val}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Merchandise Widget */}
          {merchStats && (
            <MerchandiseWidget
              totalProducts={merchStats.totalProducts}
              unitsSold={merchStats.unitsSold}
              revenue={merchStats.revenue}
              bestSellers={merchStats.bestSellers}
            />
          )}

          {/* Settlement Widget */}
          <SettlementWidget
            data={settlementData}
            title="Settlement Tracker"
            subtitle="Your earnings and payout status"
            walletLink="/organizer/dashboard/wallet"
          />
        </div>
      </div>
    </ProtectedRoute>
  );
}
