"use client";
import React, { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Link from "next/link";
import Image from "next/image";
import Icon from "@/components/ui/Icon";
import { events } from "@/lib/events";
import { RevenueWidget } from "@/components/organiser/widgets/RevenueWidget";
import { RealTimeFeed } from "@/components/organiser/widgets/RealTimeFeed";
import { QuickActionCards } from "@/components/organiser/widgets/QuickActionCards";
import { SettlementWidget } from "@/components/organiser/widgets/SettlementWidget";
import { MerchandiseWidget } from "@/components/organiser/widgets/MerchandiseWidget";
import StatusIndicator from "@/components/ui/StatusIndicator";

const stats = [
  {
    label: "Total Revenue",
    value: "₦18.6M",
    change: "+12.5%",
    up: true,
    iconName: "money" as const,
  },
  {
    label: "Tickets Sold",
    value: "1,240",
    change: "+8.2%",
    up: true,
    iconName: "ticket" as const,
  },
  {
    label: "Total Events",
    value: "6",
    change: "2 upcoming",
    up: null,
    iconName: "calendar" as const,
  },
  {
    label: "Attendees",
    value: "4,820",
    change: "+24.1%",
    up: true,
    iconName: "users" as const,
  },
];

const revenueData = [
  { month: "Oct", pct: 40, val: "₦7.4M" },
  { month: "Nov", pct: 65, val: "₦12.1M" },
  { month: "Dec", pct: 90, val: "₦16.8M" },
  { month: "Jan", pct: 55, val: "₦10.2M" },
  { month: "Feb", pct: 75, val: "₦14.0M" },
  { month: "Mar", pct: 100, val: "₦18.6M" },
];

const salesData = [45, 60, 38, 72, 85, 52, 93, 68, 77, 88, 62, 95];

const liveFeed = [
  { name: "Tunde A.", ticket: "VIP", event: "Lagos Tech Fest", time: "2m ago" },
  { name: "Chioma B.", ticket: "Regular", event: "Afro Night", time: "5m ago" },
  { name: "Samuel K.", ticket: "Early Bird", event: "Lagos Tech Fest", time: "8m ago" },
  { name: "Fatima M.", ticket: "VIP", event: "Startup Summit", time: "12m ago" },
  { name: "Kemi O.", ticket: "Regular", event: "Afro Night", time: "15m ago" },
];

const settlementData = {
  totalEarned: "₦18.6M",
  pending: "₦4.2M",
  settled: "₦14.4M",
  settlementPercentage: 77,
};

const quickActions = [
  {
    label: "Create Event",
    href: "/dashboard/events/new",
    iconName: "plus" as const,
    color: "bg-lime text-dark font-bold hover:bg-lime-hover",
  },
  {
    label: "View Events",
    href: "/dashboard/events",
    iconName: "calendar" as const,
    color: "bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-50",
  },
  {
    label: "Analytics",
    href: "/dashboard/analytics",
    iconName: "chart" as const,
    color: "bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-50",
  },
  {
    label: "Wallet",
    href: "/dashboard/wallet",
    iconName: "wallet" as const,
    color: "bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-50",
  },
];

export default function DashboardPage() {
  const recent = events.slice(0, 4);
  const [merchStats, setMerchStats] = useState<{
    totalProducts: number;
    unitsSold: number;
    revenue: number;
    bestSellers: Array<{
      id: string;
      name: string;
      sold: number;
      revenue: number;
      image: string;
      eventId: string;
    }>;
  } | null>(null);

  useEffect(() => {
    fetch("/api/merch?stats=true")
      .then((res) => res.json())
      .then((data) => setMerchStats(data))
      .catch((err) => console.error("Failed to fetch merch stats:", err));
  }, []);

  return (
    <ProtectedRoute allowRoles={["organiser"]}>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
              Dashboard
            </h1>
            <p className="text-sm text-neutral-500">
              Welcome back! Here&apos;s an overview of your events and performance.
            </p>
          </div>
          <Link
            href="/dashboard/events/new"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-lime px-6 text-sm font-bold text-dark shadow-md transition-all hover:bg-lime-hover hover:shadow-lg hover:scale-105"
          >
            <Icon name="plus" size={16} />
            Create Event
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-neutral-200 bg-white p-5 transition-all hover:shadow-xl group"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-100 text-neutral-700 transition-transform group-hover:scale-110">
                  <Icon name={stat.iconName} size={20} />
                </div>
                {stat.up !== null && (
                  <div className="flex items-center gap-1 rounded-full bg-success-50 px-2 py-1 text-xs font-semibold text-success-700">
                    <Icon name={stat.up ? "arrow-up" : "arrow-down"} size={12} />
                    {stat.change}
                  </div>
                )}
                {stat.up === null && (
                  <span className="text-xs font-medium text-neutral-500">{stat.change}</span>
                )}
              </div>
              <div className="mt-4 space-y-1">
                <p className="text-3xl font-bold tabular-nums tracking-tight text-neutral-900">
                  {stat.value}
                </p>
                <p className="text-sm font-medium text-neutral-500">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <QuickActionCards
          actions={quickActions}
          title="Quick Actions"
        />

        {/* Main Content */}
        <div className="space-y-6">
          {/* Revenue & Live Feed */}
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <RevenueWidget
                data={revenueData}
                total="₦18.6M"
                title="Revenue Overview"
                subtitle="Last 6 months"
              />
            </div>

            <div className="lg:col-span-1">
              <RealTimeFeed
                items={liveFeed}
                title="Live Sales Feed"
              />
            </div>
          </div>

          {/* Recent Events & Ticket Sales */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Recent Events */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-5 lg:col-span-2">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-neutral-900">Recent Events</h2>
                  <p className="text-sm text-neutral-500">Your latest events</p>
                </div>
                <Link
                  href="/dashboard/events"
                  className="inline-flex items-center gap-1 text-sm font-semibold text-lime-600 hover:text-lime-700 transition-colors"
                >
                  View all
                  <Icon name="arrow-right" size={14} />
                </Link>
              </div>
              <div className="space-y-3">
                {recent.map((ev) => (
                  <div
                    key={ev.id}
                    className="flex items-center gap-4 rounded-xl p-3 transition-all hover:bg-neutral-50 group"
                  >
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-neutral-100 ring-1 ring-neutral-200 group-hover:ring-lime transition-all">
                      {ev.image && (
                        <Image
                          src={ev.image}
                          alt={ev.title}
                          width={56}
                          height={56}
                          className="h-full w-full object-cover transition-transform group-hover:scale-110"
                        />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-neutral-900 group-hover:text-lime-600 transition-colors">
                        {ev.title}
                      </p>
                      <div className="mt-1 flex items-center gap-2 text-xs text-neutral-500">
                        <span className="flex items-center gap-1">
                          <Icon name="calendar" size={12} />
                          {ev.date}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Icon name="location" size={12} />
                          {ev.city}
                        </span>
                      </div>
                    </div>
                    <StatusIndicator status="active" />
                    <Link
                      href={`/dashboard/events/${ev.id}/manage`}
                      className="shrink-0 rounded-lg border border-neutral-200 bg-white px-4 py-2 text-xs font-semibold text-neutral-700 transition-all hover:border-lime hover:bg-lime/10 hover:text-lime-700"
                    >
                      Manage
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Ticket Sales Sparkline */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-5 transition-all hover:shadow-xl">
              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-bold text-neutral-900">Ticket Sales</h2>
                  <p className="text-sm text-neutral-500">This month</p>
                </div>
                <div className="space-y-2">
                  <p className="text-3xl font-bold text-neutral-900">1,240</p>
                  <div className="flex items-center gap-1 text-sm font-semibold text-success-600">
                    <Icon name="arrow-up" size={14} />
                    <span>+8.2% vs last month</span>
                  </div>
                </div>
                <div className="flex items-end gap-1 h-20 pt-4">
                  {salesData.map((v, i) => (
                    <div
                      key={i}
                      className={`flex-1 rounded-t-md transition-all hover:scale-110 ${
                        i === salesData.length - 1
                          ? "bg-lime shadow-lg"
                          : "bg-lime/20 hover:bg-lime/40"
                      }`}
                      style={{ height: `${v}%` }}
                      title={`${v}%`}
                    />
                  ))}
                </div>
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
            walletLink="/dashboard/wallet"
          />
        </div>
      </div>
    </ProtectedRoute>
  );
}
