"use client";

import React from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Icon from "@/components/ui/Icon";
import DateRangeSelector from "@/components/ui/DateRangeSelector";
import { BarChart, LineChart, PieChart } from "@/components/charts";

type Period = "day" | "week" | "month" | "year";
type TabId = "overview" | "revenue" | "events" | "users" | "operations" | "exports";

interface TrendPoint {
  label: string;
  value: number;
  color?: string;
}

interface SegmentPoint {
  label: string;
  value: number;
}

interface AnalyticsOverview {
  totalRevenue: number;
  periodRevenue: number;
  netRevenue: number;
  totalCommission: number;
  periodCommission: number;
  totalOrders: number;
  paidOrders: number;
  periodOrders: number;
  averageOrderValue: number;
  paymentSuccessRate: number;
  totalUsers: number;
  activeUsers: number;
  verifiedUsers: number;
  periodUsers: number;
  totalEvents: number;
  publishedEvents: number;
  upcomingEvents: number;
  periodEvents: number;
  organizers: number;
  vendors: number;
  affiliates: number;
  refundTotal: number;
  pendingDisputes: number;
  flaggedFraud: number;
  pendingWithdrawals: number;
}

interface AnalyticsPayload {
  period: {
    key: Period;
    label: string;
    startDate: string;
    endDate: string;
    generatedAt: string;
  };
  overview: AnalyticsOverview;
  growth: Record<"revenue" | "orders" | "users" | "events" | "commissions", number>;
  trends: {
    revenue: TrendPoint[];
    orders: TrendPoint[];
    users: TrendPoint[];
    events: TrendPoint[];
    commissions: TrendPoint[];
  };
  segments: {
    userRoles: SegmentPoint[];
    eventStatuses: SegmentPoint[];
    orderStatuses: SegmentPoint[];
    commissionStatuses: SegmentPoint[];
    disputeStatuses: SegmentPoint[];
  };
  reports: {
    topEvents: TopEvent[];
    categoryPerformance: CategoryPerformance[];
    cityPerformance: CityPerformance[];
    countryPerformance: CountryPerformance[];
    paymentMethods: PaymentMethodReport[];
    recentOrders: RecentOrder[];
    commissions: CommissionReport[];
  };
}

interface TopEvent {
  id: string;
  title: string;
  category: string;
  city: string;
  status: string;
  date: string;
  orders: number;
  revenue: number;
  ticketsSold: number;
}

interface CategoryPerformance {
  category: string;
  events: number;
  orders: number;
  revenue: number;
}

interface CityPerformance {
  city: string;
  events: number;
  orders: number;
  revenue: number;
}

interface CountryPerformance {
  country: string;
  events: number;
  orders: number;
  revenue: number;
}

interface PaymentMethodReport {
  method: string;
  orders: number;
  revenue: number;
}

interface RecentOrder {
  id: string;
  createdAt: string;
  status: string;
  total: number;
  paymentMethod: string;
  customer: string;
  email: string;
  event: string;
}

interface CommissionReport {
  id: string;
  event: string;
  organizer: string;
  totalRevenue: number;
  commissionRate: number;
  commissionAmount: number;
  netAmount: number;
  status: string;
  createdAt: string;
}

type ReportColumn<T> = {
  label: string;
  align?: "left" | "right";
  render: (row: T) => React.ReactNode;
};

const ADMIN_CHART_COLORS = [
  "var(--color-primary-500)",
  "var(--color-primary-400)",
  "var(--color-primary-300)",
  "var(--color-navy-500)",
  "var(--color-navy-300)",
  "var(--color-success-500)",
  "var(--color-warning-500)",
  "var(--color-danger-500)",
];

const REPORT_EXPORTS = [
  { id: "overview", label: "Executive Overview", detail: "KPI totals, growth, revenue, orders, users, events" },
  { id: "events", label: "Event Performance", detail: "Event revenue, orders, tickets sold, location, status" },
  { id: "orders", label: "Order Ledger", detail: "Recent customer orders, payment method, status, event" },
  { id: "users", label: "User Directory", detail: "Users, roles, verification status, location, join date" },
  { id: "commissions", label: "Commission Ledger", detail: "Organizer commissions, rates, net amounts, settlement status" },
  { id: "categories", label: "Category Revenue", detail: "Revenue and order performance by event category" },
  { id: "locations", label: "City Revenue", detail: "City-level event, order, and revenue performance" },
  { id: "countries", label: "Country Revenue", detail: "Country-level event, order, and revenue performance" },
];

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-NG").format(value || 0);
}

function formatPercent(value: number): string {
  return `${value > 0 ? "+" : ""}${Number(value || 0).toFixed(1)}%`;
}

function formatDate(value: string): string {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
  }).format(new Date(value));
}

function humanize(value: string): string {
  return value.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

async function fetchAnalytics(period: Period): Promise<AnalyticsPayload> {
  const response = await fetch(`/api/admin/analytics?period=${period}`, {
    credentials: "include",
  });
  const data = await response.json();
  if (!response.ok || data.success === false) {
    throw new Error(data.error?.message || data.detail || "Failed to load analytics reports");
  }
  return data;
}

export default function AdminAnalyticsPage() {
  const [period, setPeriod] = React.useState<Period>("month");
  const [activeTab, setActiveTab] = React.useState<TabId>("overview");
  const [analytics, setAnalytics] = React.useState<AnalyticsPayload | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [exporting, setExporting] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let active = true;

    fetchAnalytics(period)
      .then((data) => {
        if (!active) return;
        setAnalytics(data);
      })
      .catch((loadError) => {
        if (!active) return;
        setError(loadError instanceof Error ? loadError.message : "Analytics data is unavailable right now.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [period]);

  function handlePeriodChange(nextPeriod: Period) {
    setLoading(true);
    setError(null);
    setPeriod(nextPeriod);
  }

  async function downloadReport(report: string, format: "csv" | "json" = "csv") {
    setExporting(`${report}-${format}`);
    setError(null);
    try {
      const response = await fetch(`/api/admin/analytics?period=${period}&export=${report}&format=${format}`, {
        credentials: "include",
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error?.message || data.detail || "Export failed");
      }

      const blob = await response.blob();
      const contentDisposition = response.headers.get("Content-Disposition") || "";
      const fileNameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
      const fallbackName = `guestly-${report}-${period}.${format}`;
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = fileNameMatch?.[1] || fallbackName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(link.href);
    } catch (exportError) {
      setError(exportError instanceof Error ? exportError.message : "Could not export report.");
    } finally {
      setExporting(null);
    }
  }

  if (loading && !analytics) {
    return <AnalyticsLoading />;
  }

  const tabs: Array<{ id: TabId; label: string }> = [
    { id: "overview", label: "Overview" },
    { id: "revenue", label: "Revenue" },
    { id: "events", label: "Events" },
    { id: "users", label: "Users" },
    { id: "operations", label: "Operations" },
    { id: "exports", label: "Exports" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Analytics Reports</h1>
          <p className="mt-1 text-sm text-slate-500">
            Product-wide reporting across revenue, events, users, orders, commissions, and operations.
          </p>
          {analytics && (
            <p className="mt-2 text-xs text-slate-500">
              {analytics.period.label} · {formatDate(analytics.period.startDate)} to {formatDate(analytics.period.endDate)}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <DateRangeSelector value={period} onChange={handlePeriodChange} />
          <Button variant="outline" onClick={() => downloadReport("overview")} loading={exporting === "overview-csv"}>
            <Icon name="download" size={16} />
            Export Summary
          </Button>
        </div>
      </div>

      {error && (
        <Card className="border-danger-100 bg-danger-50 p-4">
          <p className="text-sm font-medium text-danger-700">{error}</p>
        </Card>
      )}

      {analytics && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <KpiCard
              title="Total Revenue"
              value={formatCurrency(analytics.overview.totalRevenue)}
              detail={`${formatCurrency(analytics.overview.periodRevenue)} in period`}
              trend={analytics.growth.revenue}
              analysisRows={[
                ["Period revenue", formatCurrency(analytics.overview.periodRevenue)],
                ["Net revenue", formatCurrency(analytics.overview.netRevenue)],
                ["Commission", formatCurrency(analytics.overview.totalCommission)],
                ["Average order value", formatCurrency(analytics.overview.averageOrderValue)],
              ]}
            />
            <KpiCard
              title="Orders"
              value={formatNumber(analytics.overview.totalOrders)}
              detail={`${formatNumber(analytics.overview.paidOrders)} paid orders`}
              trend={analytics.growth.orders}
              analysisRows={[
                ["Paid orders", formatNumber(analytics.overview.paidOrders)],
                ["Orders in period", formatNumber(analytics.overview.periodOrders)],
                ["Payment success", `${analytics.overview.paymentSuccessRate}%`],
                ["Refund exposure", formatCurrency(analytics.overview.refundTotal)],
              ]}
            />
            <KpiCard
              title="Users"
              value={formatNumber(analytics.overview.totalUsers)}
              detail={`${formatNumber(analytics.overview.activeUsers)} active users`}
              trend={analytics.growth.users}
              analysisRows={[
                ["Active users", formatNumber(analytics.overview.activeUsers)],
                ["Verified users", formatNumber(analytics.overview.verifiedUsers)],
                ["Organizers", formatNumber(analytics.overview.organizers)],
                ["Vendors", formatNumber(analytics.overview.vendors)],
                ["Affiliates", formatNumber(analytics.overview.affiliates)],
              ]}
            />
            <KpiCard
              title="Events"
              value={formatNumber(analytics.overview.totalEvents)}
              detail={`${formatNumber(analytics.overview.publishedEvents)} published events`}
              trend={analytics.growth.events}
              analysisRows={[
                ["Published events", formatNumber(analytics.overview.publishedEvents)],
                ["Upcoming events", formatNumber(analytics.overview.upcomingEvents)],
                ["Events in period", formatNumber(analytics.overview.periodEvents)],
                ["Pending disputes", formatNumber(analytics.overview.pendingDisputes)],
              ]}
            />
          </div>

          <div className="overflow-x-auto border-b border-neutral-200">
            <div className="flex min-w-max gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative min-h-11 px-4 text-sm font-medium transition-colors ${
                    activeTab === tab.id ? "text-primary-700" : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-primary-500" />}
                </button>
              ))}
            </div>
          </div>

          {activeTab === "overview" && <OverviewReport analytics={analytics} downloadReport={downloadReport} exporting={exporting} />}
          {activeTab === "revenue" && <RevenueReport analytics={analytics} downloadReport={downloadReport} exporting={exporting} />}
          {activeTab === "events" && <EventsReport analytics={analytics} downloadReport={downloadReport} exporting={exporting} />}
          {activeTab === "users" && <UsersReport analytics={analytics} downloadReport={downloadReport} exporting={exporting} />}
          {activeTab === "operations" && <OperationsReport analytics={analytics} downloadReport={downloadReport} exporting={exporting} />}
          {activeTab === "exports" && <ExportCenter downloadReport={downloadReport} exporting={exporting} />}
        </>
      )}
    </div>
  );
}

function OverviewReport({ analytics, downloadReport, exporting }: ReportProps) {
  const overview = analytics.overview;
  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(360px,0.6fr)]">
      <AnalysisCard
        title="Product Growth"
        description="Revenue, orders, users, and event creation over the selected period."
        action={(
          <Button variant="ghost" size="sm" onClick={() => downloadReport("overview")} loading={exporting === "overview-csv"}>
            <Icon name="download" size={15} />
            CSV
          </Button>
        )}
        expandedContent={(
          <div className="grid gap-6 xl:grid-cols-2">
            <ChartPanel title="Revenue Trend" expanded={false}>
              <LineChart data={analytics.trends.revenue} height={420} color={ADMIN_CHART_COLORS[0]} formatValue={formatCurrency} />
            </ChartPanel>
            <ChartPanel title="Order Volume" expanded={false}>
              <LineChart data={analytics.trends.orders} height={420} color={ADMIN_CHART_COLORS[3]} />
            </ChartPanel>
            <ChartPanel title="New Users" expanded={false}>
              <LineChart data={analytics.trends.users} height={420} color={ADMIN_CHART_COLORS[1]} />
            </ChartPanel>
            <ChartPanel title="New Events" expanded={false}>
              <LineChart data={analytics.trends.events} height={420} color={ADMIN_CHART_COLORS[5]} />
            </ChartPanel>
          </div>
        )}
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartPanel
            title="Revenue Trend"
            expandedContent={<LineChart data={analytics.trends.revenue} height={560} color={ADMIN_CHART_COLORS[0]} formatValue={formatCurrency} />}
          >
            <LineChart data={analytics.trends.revenue} height={240} color={ADMIN_CHART_COLORS[0]} formatValue={formatCurrency} />
          </ChartPanel>
          <ChartPanel
            title="Order Volume"
            expandedContent={<LineChart data={analytics.trends.orders} height={560} color={ADMIN_CHART_COLORS[3]} />}
          >
            <LineChart data={analytics.trends.orders} height={240} color={ADMIN_CHART_COLORS[3]} />
          </ChartPanel>
          <ChartPanel
            title="New Users"
            expandedContent={<LineChart data={analytics.trends.users} height={560} color={ADMIN_CHART_COLORS[1]} />}
          >
            <LineChart data={analytics.trends.users} height={240} color={ADMIN_CHART_COLORS[1]} />
          </ChartPanel>
          <ChartPanel
            title="New Events"
            expandedContent={<LineChart data={analytics.trends.events} height={560} color={ADMIN_CHART_COLORS[5]} />}
          >
            <LineChart data={analytics.trends.events} height={240} color={ADMIN_CHART_COLORS[5]} />
          </ChartPanel>
        </div>
      </AnalysisCard>

      <div className="space-y-6">
        <MetricList
          title="Executive Snapshot"
          rows={[
            ["Net revenue", formatCurrency(overview.netRevenue)],
            ["Average order value", formatCurrency(overview.averageOrderValue)],
            ["Payment success rate", `${overview.paymentSuccessRate}%`],
            ["Commission earned", formatCurrency(overview.totalCommission)],
            ["Refund exposure", formatCurrency(overview.refundTotal)],
          ]}
        />
        <MetricList
          title="Marketplace Coverage"
          rows={[
            ["Organizers", formatNumber(overview.organizers)],
            ["Vendors", formatNumber(overview.vendors)],
            ["Affiliates", formatNumber(overview.affiliates)],
            ["Upcoming events", formatNumber(overview.upcomingEvents)],
            ["Verified users", formatNumber(overview.verifiedUsers)],
          ]}
        />
      </div>
    </div>
  );
}

function RevenueReport({ analytics, downloadReport, exporting }: ReportProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2 2xl:grid-cols-3">
        <AnalysisCard
          title="Revenue and Commission"
          action={<ExportButton report="commissions" label="Export Commissions" exporting={exporting} onExport={downloadReport} />}
          expandedContent={(
            <div className="space-y-6">
              <LineChart data={analytics.trends.revenue} height={560} color={ADMIN_CHART_COLORS[0]} formatValue={formatCurrency} />
              <div className="grid gap-4 sm:grid-cols-3">
                <MiniMetric title="Gross revenue" value={formatCurrency(analytics.overview.totalRevenue)} />
                <MiniMetric title="Commission" value={formatCurrency(analytics.overview.totalCommission)} />
                <MiniMetric title="Net to organizers" value={formatCurrency(analytics.overview.netRevenue)} />
              </div>
            </div>
          )}
        >
          <LineChart data={analytics.trends.revenue} height={260} color={ADMIN_CHART_COLORS[0]} formatValue={formatCurrency} />
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <MiniMetric title="Gross revenue" value={formatCurrency(analytics.overview.totalRevenue)} />
            <MiniMetric title="Commission" value={formatCurrency(analytics.overview.totalCommission)} />
            <MiniMetric title="Net to organizers" value={formatCurrency(analytics.overview.netRevenue)} />
          </div>
        </AnalysisCard>
        <AnalysisCard
          title="Payment Methods"
          action={<ExportButton report="orders" label="Export Orders" exporting={exporting} onExport={downloadReport} />}
          expandedContent={(
            <BarChart
              height={560}
              formatValue={formatCurrency}
              data={analytics.reports.paymentMethods.map((method, index) => ({
                label: humanize(method.method),
                value: method.revenue,
                color: ADMIN_CHART_COLORS[index % ADMIN_CHART_COLORS.length],
              }))}
            />
          )}
        >
          <BarChart
            height={260}
            formatValue={formatCurrency}
            data={analytics.reports.paymentMethods.map((method, index) => ({
              label: humanize(method.method),
              value: method.revenue,
              color: ADMIN_CHART_COLORS[index % ADMIN_CHART_COLORS.length],
            }))}
          />
        </AnalysisCard>
      </div>

      <ReportTable
        title="Commission Ledger"
        rows={analytics.reports.commissions}
        rowKey={(row) => row.id}
        emptyText="No commission records found."
        columns={[
          { label: "Event", render: (row) => <span className="font-medium text-slate-900">{row.event}</span> },
          { label: "Organizer", render: (row) => row.organizer },
          { label: "Rate", align: "right", render: (row) => `${row.commissionRate}%` },
          { label: "Commission", align: "right", render: (row) => formatCurrency(row.commissionAmount) },
          { label: "Net", align: "right", render: (row) => formatCurrency(row.netAmount) },
          { label: "Status", render: (row) => <Badge variant={row.status === "settled" ? "success" : row.status === "disputed" ? "danger" : "warning"}>{humanize(row.status)}</Badge> },
        ]}
      />
    </div>
  );
}

function EventsReport({ analytics, downloadReport, exporting }: ReportProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <AnalysisCard
          title="Revenue by Category"
          action={<ExportButton report="categories" label="Export Categories" exporting={exporting} onExport={downloadReport} />}
          expandedContent={(
            <div className="mx-auto max-w-5xl">
              <PieChart
                data={analytics.reports.categoryPerformance.map((category, index) => ({
                  label: category.category,
                  value: category.revenue,
                  color: ADMIN_CHART_COLORS[index % ADMIN_CHART_COLORS.length],
                }))}
              />
            </div>
          )}
        >
          <PieChart
            data={analytics.reports.categoryPerformance.map((category, index) => ({
              label: category.category,
              value: category.revenue,
              color: ADMIN_CHART_COLORS[index % ADMIN_CHART_COLORS.length],
            }))}
          />
        </AnalysisCard>
        <AnalysisCard
          title="Top Cities"
          action={<ExportButton report="locations" label="Export Cities" exporting={exporting} onExport={downloadReport} />}
          expandedContent={(
            <BarChart
              height={560}
              formatValue={formatCurrency}
              data={analytics.reports.cityPerformance.map((city, index) => ({
                label: city.city,
                value: city.revenue,
                color: ADMIN_CHART_COLORS[index % ADMIN_CHART_COLORS.length],
              }))}
            />
          )}
        >
          <BarChart
            height={260}
            formatValue={formatCurrency}
            data={analytics.reports.cityPerformance.map((city, index) => ({
              label: city.city,
              value: city.revenue,
              color: ADMIN_CHART_COLORS[index % ADMIN_CHART_COLORS.length],
            }))}
          />
        </AnalysisCard>
        <AnalysisCard
          title="Top Countries"
          action={<ExportButton report="countries" label="Export Countries" exporting={exporting} onExport={downloadReport} />}
          expandedContent={(
            <BarChart
              height={560}
              formatValue={formatCurrency}
              data={analytics.reports.countryPerformance.map((country, index) => ({
                label: country.country,
                value: country.revenue,
                color: ADMIN_CHART_COLORS[index % ADMIN_CHART_COLORS.length],
              }))}
            />
          )}
        >
          <BarChart
            height={260}
            formatValue={formatCurrency}
            data={analytics.reports.countryPerformance.map((country, index) => ({
              label: country.country,
              value: country.revenue,
              color: ADMIN_CHART_COLORS[index % ADMIN_CHART_COLORS.length],
            }))}
          />
        </AnalysisCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <ReportTable
          title="Country Performance"
          action={<ExportButton report="countries" label="Export Countries" exporting={exporting} onExport={downloadReport} />}
          rows={analytics.reports.countryPerformance}
          rowKey={(row) => row.country}
          emptyText="No country performance data found."
          columns={[
            { label: "Country", render: (row) => <span className="font-medium text-slate-900">{row.country}</span> },
            { label: "Events", align: "right", render: (row) => formatNumber(row.events) },
            { label: "Orders", align: "right", render: (row) => formatNumber(row.orders) },
            { label: "Revenue", align: "right", render: (row) => formatCurrency(row.revenue) },
          ]}
        />
        <ReportTable
          title="City Performance"
          action={<ExportButton report="locations" label="Export Cities" exporting={exporting} onExport={downloadReport} />}
          rows={analytics.reports.cityPerformance}
          rowKey={(row) => row.city}
          emptyText="No city performance data found."
          columns={[
            { label: "City", render: (row) => <span className="font-medium text-slate-900">{row.city}</span> },
            { label: "Events", align: "right", render: (row) => formatNumber(row.events) },
            { label: "Orders", align: "right", render: (row) => formatNumber(row.orders) },
            { label: "Revenue", align: "right", render: (row) => formatCurrency(row.revenue) },
          ]}
        />
      </div>

      <ReportTable
        title="Top Performing Events"
        action={<ExportButton report="events" label="Export Events" exporting={exporting} onExport={downloadReport} />}
        rows={analytics.reports.topEvents}
        rowKey={(row) => row.id}
        emptyText="No event performance data found."
        columns={[
          { label: "Event", render: (row) => <span className="font-medium text-slate-900">{row.title}</span> },
          { label: "Category", render: (row) => row.category },
          { label: "City", render: (row) => row.city },
          { label: "Tickets", align: "right", render: (row) => formatNumber(row.ticketsSold) },
          { label: "Orders", align: "right", render: (row) => formatNumber(row.orders) },
          { label: "Revenue", align: "right", render: (row) => formatCurrency(row.revenue) },
        ]}
      />
    </div>
  );
}

function UsersReport({ analytics, downloadReport, exporting }: ReportProps) {
  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(420px,0.8fr)]">
      <AnalysisCard
        title="User Role Mix"
        action={<ExportButton report="users" label="Export Users" exporting={exporting} onExport={downloadReport} />}
        expandedContent={(
          <div className="mx-auto max-w-5xl">
            <PieChart
              data={analytics.segments.userRoles.map((role, index) => ({
                label: humanize(role.label),
                value: role.value,
                color: ADMIN_CHART_COLORS[index % ADMIN_CHART_COLORS.length],
              }))}
            />
          </div>
        )}
      >
        <PieChart
          data={analytics.segments.userRoles.map((role, index) => ({
            label: humanize(role.label),
            value: role.value,
            color: ADMIN_CHART_COLORS[index % ADMIN_CHART_COLORS.length],
          }))}
        />
      </AnalysisCard>
      <AnalysisCard
        title="User Health"
        expandedContent={(
          <div className="mx-auto max-w-5xl space-y-6">
            <ProgressRow label="Active users" value={analytics.overview.activeUsers} total={analytics.overview.totalUsers} />
            <ProgressRow label="Verified users" value={analytics.overview.verifiedUsers} total={analytics.overview.totalUsers} />
            <ProgressRow label="Organizers" value={analytics.overview.organizers} total={analytics.overview.totalUsers} />
            <ProgressRow label="Vendors" value={analytics.overview.vendors} total={analytics.overview.totalUsers} />
            <ProgressRow label="Affiliates" value={analytics.overview.affiliates} total={analytics.overview.totalUsers} />
          </div>
        )}
      >
        <div className="mt-5 space-y-4">
          <ProgressRow label="Active users" value={analytics.overview.activeUsers} total={analytics.overview.totalUsers} />
          <ProgressRow label="Verified users" value={analytics.overview.verifiedUsers} total={analytics.overview.totalUsers} />
          <ProgressRow label="Organizers" value={analytics.overview.organizers} total={analytics.overview.totalUsers} />
          <ProgressRow label="Vendors" value={analytics.overview.vendors} total={analytics.overview.totalUsers} />
          <ProgressRow label="Affiliates" value={analytics.overview.affiliates} total={analytics.overview.totalUsers} />
        </div>
      </AnalysisCard>
    </div>
  );
}

function OperationsReport({ analytics, downloadReport, exporting }: ReportProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <KpiCard title="Pending Disputes" value={formatNumber(analytics.overview.pendingDisputes)} detail="Open customer disputes" />
        <KpiCard title="Flagged Fraud" value={formatNumber(analytics.overview.flaggedFraud)} detail="Cases needing review" />
        <KpiCard title="Pending Withdrawals" value={formatNumber(analytics.overview.pendingWithdrawals)} detail="Organizer payout queue" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SegmentPanel title="Order Status" data={analytics.segments.orderStatuses} />
        <SegmentPanel title="Event Status" data={analytics.segments.eventStatuses} />
        <SegmentPanel title="Commission Status" data={analytics.segments.commissionStatuses} />
        <SegmentPanel title="Dispute Status" data={analytics.segments.disputeStatuses} />
      </div>

      <ReportTable
        title="Recent Orders"
        action={<ExportButton report="orders" label="Export Orders" exporting={exporting} onExport={downloadReport} />}
        rows={analytics.reports.recentOrders}
        rowKey={(row) => row.id}
        emptyText="No orders found."
        columns={[
          { label: "Customer", render: (row) => <span className="font-medium text-slate-900">{row.customer}</span> },
          { label: "Event", render: (row) => row.event },
          { label: "Method", render: (row) => humanize(row.paymentMethod) },
          { label: "Status", render: (row) => <Badge variant={row.status === "paid" ? "success" : row.status === "refunded" ? "warning" : "neutral"}>{humanize(row.status)}</Badge> },
          { label: "Date", render: (row) => formatDate(row.createdAt) },
          { label: "Total", align: "right", render: (row) => formatCurrency(row.total) },
        ]}
      />
    </div>
  );
}

function ExportCenter({ downloadReport, exporting }: Pick<ReportProps, "downloadReport" | "exporting">) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {REPORT_EXPORTS.map((report) => (
        <Card key={report.id} className="p-5">
          <div className="flex min-h-32 flex-col justify-between gap-5">
            <div>
              <h2 className="text-base font-semibold text-slate-900">{report.label}</h2>
              <p className="mt-1 text-sm text-slate-500">{report.detail}</p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => downloadReport(report.id, "csv")} loading={exporting === `${report.id}-csv`}>
                <Icon name="download" size={15} />
                CSV
              </Button>
              <Button size="sm" variant="ghost" onClick={() => downloadReport(report.id, "json")} loading={exporting === `${report.id}-json`}>
                <Icon name="file" size={15} />
                JSON
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

interface ReportProps {
  analytics: AnalyticsPayload;
  exporting: string | null;
  downloadReport: (report: string, format?: "csv" | "json") => void;
}

function KpiCard({
  title,
  value,
  detail,
  trend,
  analysisRows = [],
}: {
  title: string;
  value: string;
  detail: string;
  trend?: number;
  analysisRows?: Array<[string, string]>;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
          <p className="mt-1 text-xs text-slate-500">{detail}</p>
        </div>
        {typeof trend === "number" && (
          <Badge variant={trend >= 0 ? "success" : "danger"}>
            {formatPercent(trend)}
          </Badge>
        )}
        <ExpandButton title={title}>
          <div className="mx-auto max-w-3xl">
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <p className="mt-3 text-5xl font-bold text-slate-900">{value}</p>
            <p className="mt-2 text-base text-slate-500">{detail}</p>
            {typeof trend === "number" && (
              <div className="mt-5">
                <Badge variant={trend >= 0 ? "success" : "danger"}>{formatPercent(trend)}</Badge>
              </div>
            )}
            {analysisRows.length > 0 && (
              <div className="mt-8 divide-y divide-neutral-100 rounded-lg border border-neutral-200">
                {analysisRows.map(([label, rowValue]) => (
                  <div key={label} className="flex items-center justify-between gap-4 px-4 py-4">
                    <span className="text-sm text-slate-500">{label}</span>
                    <span className="text-base font-semibold text-slate-900">{rowValue}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ExpandButton>
      </div>
    </Card>
  );
}

function MiniMetric({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{title}</p>
      <p className="mt-2 text-lg font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function ChartPanel({
  title,
  children,
  expandedContent,
  expanded = true,
}: {
  title: string;
  children: React.ReactNode;
  expandedContent?: React.ReactNode;
  expanded?: boolean;
}) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
        {expanded && <ExpandButton title={title}>{expandedContent ?? children}</ExpandButton>}
      </div>
      {children}
    </div>
  );
}

function AnalysisCard({
  title,
  description,
  action,
  children,
  expandedContent,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  expandedContent?: React.ReactNode;
}) {
  return (
    <Card className="p-6">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {action}
          <ExpandButton title={title}>{expandedContent ?? children}</ExpandButton>
        </div>
      </div>
      {children}
    </Card>
  );
}

function ExportButton({ report, label, exporting, onExport }: { report: string; label: string; exporting: string | null; onExport: (report: string) => void }) {
  return (
    <Button variant="ghost" size="sm" onClick={() => onExport(report)} loading={exporting === `${report}-csv`}>
      <Icon name="download" size={15} />
      {label}
    </Button>
  );
}

function MetricList({ title, rows }: { title: string; rows: Array<[string, string]> }) {
  const content = (
    <div className="divide-y divide-neutral-100">
      {rows.map(([label, value]) => (
        <div key={label} className="flex items-center justify-between gap-4 py-3">
          <span className="text-sm text-slate-500">{label}</span>
          <span className="text-sm font-semibold text-slate-900">{value}</span>
        </div>
      ))}
    </div>
  );

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-slate-900">{title}</h2>
        <ExpandButton title={title}>
          <div className="mx-auto max-w-4xl">{content}</div>
        </ExpandButton>
      </div>
      <div className="mt-4">{content}</div>
    </Card>
  );
}

function SegmentPanel({ title, data }: { title: string; data: SegmentPoint[] }) {
  const content = (
    <div className="space-y-3">
      {data.length === 0 ? (
        <p className="text-sm text-slate-500">No records found.</p>
      ) : data.map((item) => (
        <div key={item.label} className="flex items-center justify-between gap-4">
          <span className="text-sm text-slate-600">{humanize(item.label)}</span>
          <Badge variant="neutral">{formatNumber(item.value)}</Badge>
        </div>
      ))}
    </div>
  );

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-slate-900">{title}</h2>
        <ExpandButton title={title}>
          <div className="mx-auto max-w-4xl">{content}</div>
        </ExpandButton>
      </div>
      <div className="mt-4">{content}</div>
    </Card>
  );
}

function ProgressRow({ label, value, total }: { label: string; value: number; total: number }) {
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div>
      <div className="flex items-center justify-between gap-4 text-sm">
        <span className="font-medium text-slate-700">{label}</span>
        <span className="text-slate-500">{formatNumber(value)} · {percentage}%</span>
      </div>
      <div className="mt-2 h-2 rounded-full bg-neutral-100">
        <div className="h-2 rounded-full bg-primary-500" style={{ width: `${Math.min(percentage, 100)}%` }} />
      </div>
    </div>
  );
}

function ReportTable<T>({
  title,
  rows,
  columns,
  rowKey,
  emptyText,
  action,
}: {
  title: string;
  rows: T[];
  columns: Array<ReportColumn<T>>;
  rowKey: (row: T) => string;
  emptyText: string;
  action?: React.ReactNode;
}) {
  const tableContent = (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px]">
        <thead className="bg-neutral-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.label}
                className={`px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 ${
                  column.align === "right" ? "text-right" : "text-left"
                }`}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100">
          {rows.length === 0 ? (
            <tr>
              <td className="px-4 py-10 text-center text-sm text-slate-500" colSpan={columns.length}>
                {emptyText}
              </td>
            </tr>
          ) : rows.map((row) => (
            <tr key={rowKey(row)} className="hover:bg-neutral-50">
              {columns.map((column) => (
                <td
                  key={column.label}
                  className={`px-4 py-3 text-sm text-slate-600 ${
                    column.align === "right" ? "text-right" : "text-left"
                  }`}
                >
                  {column.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-neutral-200 px-5 py-4">
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        <div className="flex items-center gap-2">
          {action}
          <ExpandButton title={title}>
            <div className="min-w-[1100px]">{tableContent}</div>
          </ExpandButton>
        </div>
      </div>
      <div className="overflow-x-auto">
        {tableContent}
      </div>
    </Card>
  );
}

function ExpandButton({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-neutral-200 bg-white text-slate-500 transition-colors hover:bg-neutral-50 hover:text-slate-900"
        aria-label={`Expand ${title}`}
        title={`Expand ${title}`}
      >
        <Icon name="external-link" size={15} />
      </button>
      {open && (
        <FullscreenModal title={title} onClose={() => setOpen(false)}>
          {children}
        </FullscreenModal>
      )}
    </>
  );
}

function FullscreenModal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 p-3 sm:p-5" role="dialog" aria-modal="true" aria-label={title}>
      <div className="flex h-full max-h-[calc(100vh-1.5rem)] w-full max-w-[1680px] flex-col overflow-hidden rounded-lg bg-white shadow-2xl sm:max-h-[calc(100vh-2.5rem)]">
        <div className="flex items-center justify-between gap-3 border-b border-neutral-200 px-4 py-3 sm:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Full screen view</p>
            <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-neutral-100 hover:text-slate-900"
            aria-label="Close full screen view"
            title="Close"
          >
            <Icon name="x" size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-auto p-4 sm:p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

function AnalyticsLoading() {
  return (
    <div className="space-y-6">
      <div className="animate-pulse">
        <div className="h-8 w-64 rounded bg-neutral-200" />
        <div className="mt-2 h-4 w-96 max-w-full rounded bg-neutral-200" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="h-32 rounded-lg bg-neutral-200" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-80 rounded-lg bg-neutral-200" />
        <div className="h-80 rounded-lg bg-neutral-200" />
      </div>
    </div>
  );
}
