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

async function backendFetch<T = any>(path: string, request: NextRequest): Promise<T> {
  const res = await fetch(`${BACKEND_URL}/api/v1${path}`, {
    headers: authHeaders(request),
    cache: "no-store",
  });
  if (!res.ok) return null as T;
  return res.json();
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
    const [dashboard, summary, feeSettings, commissions, settlements] = await Promise.all([
      backendFetch<any>("/admin/platform/revenue/dashboard", request),
      backendFetch<any>("/admin/platform/revenue/summary", request),
      backendFetch<any>("/admin/platform/fee-settings", request),
      backendFetch<any>("/admin/commissions", request),
      backendFetch<any>("/admin/settlements?status=pending", request),
    ]);

    const raw = dashboard || {};
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

    const totalCommission = (commissions?.total ?? 0) as number;
    const settledCommission = (summary?.total_commission_settled ?? totalCommission) as number;
    const totalFees = totalRevenue;

    const streams = Object.entries(byType).map(([type, val]: [string, any]) => {
      const meta = STREAM_META[type as TransactionType] ?? {
        displayName: type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        icon: "dollar-sign",
        color: "var(--color-neutral-500)",
      };
      const streamTotal = val.total ?? 0;
      return {
        type,
        displayName: meta.displayName,
        total: streamTotal,
        periodTotal: streamTotal,
        growth: 0,
        icon: meta.icon,
        color: meta.color,
      };
    });

    const feeConfigs = Array.isArray(feeSettings) ? feeSettings.map((f: any) => ({
      id: f.id,
      transactionType: f.transaction_type,
      feeType: f.fee_type || "percentage",
      feeValue: f.fee_value || 0,
      isActive: f.is_active ?? true,
      description: f.description || "",
      appliesToAttendee: f.applies_to_attendee ?? false,
      appliesToOrganizer: f.applies_to_organizer ?? true,
    })) : [];

    const topOrgs = summary?.top_organizers || [];
    const topEvts = summary?.top_events || [];
    const topVndrs = summary?.top_vendors || [];

    const settlementList = Array.isArray(settlements) ? settlements : (settlements?.settlements || []);

    const dashboard_response = {
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
        netRevenue: totalRevenue - totalCommission,
        totalCommission,
        periodCommission: settledCommission,
        totalFees,
        periodFees: periodRevenue,
        totalTransactions: settledCount,
        periodTransactions: settledCount,
        pendingSettlements: pendingCount,
        pendingAmount,
      },
      streams,
      trends: {
        total: summary?.revenue_trend || [],
        byStream: {} as Record<string, any[]>,
        byDay: summary?.daily_trend || [],
      },
      feeConfigurations: feeConfigs,
      topEarners: {
        organizers: topOrgs.map((o: any) => ({
          id: o.id || o.organizer_id,
          name: o.name || o.organizer_name || "Unknown",
          revenue: o.revenue ?? 0,
          commission: o.commission ?? 0,
        })),
        events: topEvts.map((e: any) => ({
          id: e.id || e.event_id,
          title: e.title || e.event_title || "Unknown",
          revenue: e.revenue ?? 0,
          commission: e.commission ?? 0,
        })),
        vendors: topVndrs.map((v: any) => ({
          id: v.id || v.vendor_id,
          name: v.name || v.vendor_name || "Unknown",
          revenue: v.revenue ?? 0,
          fee: v.fee ?? 0,
        })),
      },
      settlements: {
        pending: settlementList.filter((s: any) => (s.status || "").toLowerCase() === "pending").map((s: any) => ({
          id: s.id,
          amount: s.amount ?? 0,
          type: s.transaction_type || s.type,
          createdAt: s.created_at || s.createdAt,
          user: s.user_name || s.userName || s.user || "Unknown",
          date: (s.created_at || s.createdAt || "") as string,
        })),
        completed: settlementList.filter((s: any) => (s.status || "").toLowerCase() === "completed" || (s.status || "").toLowerCase() === "settled").map((s: any) => ({
          id: s.id,
          amount: s.amount ?? 0,
          type: s.transaction_type || s.type,
          completedAt: s.completed_at || s.settled_at || s.completedAt,
          user: s.user_name || s.userName || s.user || "Unknown",
          date: (s.completed_at || s.settled_at || s.completedAt || "") as string,
        })),
        totalPending: pendingAmount,
        totalCompleted: totalRevenue,
      },
    };

    return NextResponse.json(dashboard_response);
  } catch {
    return NextResponse.json(
      { success: false, error: { code: "BACKEND_ERROR", message: "Platform revenue backend unavailable" } },
      { status: 502 },
    );
  }
}
