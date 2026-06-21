import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api/client";

type TransactionType =
  | "TICKET_SALE" | "MERCH_SALE" | "VENDOR_PAYMENT" | "AD_CAMPAIGN"
  | "FEATURED_PLACEMENT" | "VERIFICATION" | "API_ACCESS" | "SUBSCRIPTION"
  | "WALLET_DEPOSIT" | "WALLET_WITHDRAWAL";

const STREAM_META: Record<TransactionType, { displayName: string; icon: string; color: string }> = {
  TICKET_SALE:          { displayName: "Ticket Sales",        icon: "ticket",       color: "var(--color-primary-500)" },
  MERCH_SALE:           { displayName: "Merchandise",          icon: "shopping-bag", color: "var(--color-teal-500)" },
  VENDOR_PAYMENT:       { displayName: "Vendor Payments",     icon: "users",        color: "var(--color-amber-500)" },
  AD_CAMPAIGN:          { displayName: "Advertising",         icon: "megaphone",    color: "var(--color-purple-500)" },
  FEATURED_PLACEMENT:   { displayName: "Featured Placement",  icon: "star",         color: "var(--color-lime-500)" },
  VERIFICATION:         { displayName: "Verification",        icon: "shield-check", color: "var(--color-orange-500)" },
  API_ACCESS:           { displayName: "API Access",          icon: "code",         color: "var(--color-cyan-500)" },
  SUBSCRIPTION:         { displayName: "Subscriptions",       icon: "repeat",       color: "var(--color-indigo-500)" },
  WALLET_DEPOSIT:       { displayName: "Wallet Deposits",     icon: "credit-card",  color: "var(--color-rose-500)" },
  WALLET_WITHDRAWAL:    { displayName: "Wallet Withdrawals",  icon: "credit-card",  color: "var(--color-gray-500)" },
};

const PERIOD_LABELS: Record<string, string> = {
  day: "Today",
  week: "This Week",
  month: "This Month",
  year: "This Year",
};

function authHeaders(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function requireAdmin(request: NextRequest) {
  return request.cookies.get("role")?.value === "admin" && request.cookies.get("access_token")?.value;
}

function isoDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

export async function GET(request: NextRequest) {
  if (!requireAdmin(request)) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "Admin access required" } },
      { status: 401 },
    );
  }

  const { searchParams } = new URL(request.url);
  const period = searchParams.get("period") || "month";

  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/admin/platform/revenue/dashboard`, {
      headers: authHeaders(request),
      cache: "no-store",
      credentials: 'include',
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return NextResponse.json(body, { status: res.status });
    }
    const raw = await res.json();

    const metrics = raw.metrics || {};
    const counts = raw.counts || {};
    const byType = raw.revenue_by_type_last_30_days || {};
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const totalRevenue = metrics.total ?? 0;
    const periodRevenue = metrics.this_month ?? 0;
    const pendingAmount = metrics.pending ?? 0;
    const settledCount = counts.settled ?? 0;
    const pendingCount = counts.pending ?? 0;

    const streams = Object.entries(byType).map(([type, val]: [string, any]) => {
      const meta = STREAM_META[type as TransactionType] ?? {
        displayName: type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        icon: "dollar-sign",
        color: "var(--color-neutral-500)",
      };
      const streamTotal = val.total ?? 0;
      const growth = periodRevenue > 0 ? ((streamTotal - periodRevenue) / periodRevenue) * 100 : 0;
      return {
        type,
        displayName: meta.displayName,
        total: streamTotal,
        periodTotal: streamTotal,
        growth: Math.round(growth * 10) / 10,
        icon: meta.icon,
        color: meta.color,
      };
    });

    const dashboard = {
      period: {
        key: period,
        label: PERIOD_LABELS[period] || period,
        startDate: isoDate(startDate),
        endDate: isoDate(endDate),
        generatedAt: now.toISOString(),
      },
      summary: {
        totalRevenue,
        periodRevenue,
        netRevenue: totalRevenue * 0.8,
        totalCommission: totalRevenue * 0.2,
        periodCommission: periodRevenue * 0.2,
        totalFees: 0,
        periodFees: 0,
        totalTransactions: settledCount,
        periodTransactions: settledCount,
        pendingSettlements: pendingCount,
        pendingAmount,
      },
      streams,
      trends: {
        total: [],
        byStream: {} as Record<string, any[]>,
        byDay: [],
      },
      feeConfigurations: [],
      topEarners: {
        organizers: [],
        events: [],
        vendors: [],
      },
      settlements: {
        pending: [],
        completed: [],
        totalPending: pendingAmount,
        totalCompleted: totalRevenue,
      },
    };

    return NextResponse.json(dashboard);
  } catch {
    return NextResponse.json(
      { success: false, error: { code: "BACKEND_ERROR", message: "Platform revenue backend unavailable" } },
      { status: 502 },
    );
  }
}
