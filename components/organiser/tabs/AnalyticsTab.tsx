"use client";
import React, { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import LineChart from "@/components/charts/LineChart";
import BarChart from "@/components/charts/BarChart";
import DateRangeFilter, { RangeKey, rangeToParams } from "@/components/charts/DateRangeFilter";

interface EventAnalytics {
  totalRevenue: number;
  totalTickets: number;
  totalViews: number;
  conversionPct: number;
  dailyStats: { date: string; revenue: number; ticketsSold: number; pageViews: number }[];
  ticketMix: { type: string; count: number; color: string }[];
  trafficSources: { name: string; pct: number }[];
}

function fmt(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toLocaleString();
}

export default function AnalyticsTab({ eventId }: { eventId: string }) {
  const [range, setRange] = useState<RangeKey>("30d");
  const [data, setData] = useState<EventAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ eventId });
    const { from, to } = rangeToParams(range);
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    fetch(`/api/analytics?${params}`)
      .then((r) => r.json())
      .then((d) => setData(d))
      .finally(() => setLoading(false));
  }, [eventId, range]);

  if (loading && !data) {
    return (
      <div className="flex h-48 items-center justify-center">
        <div className="h-7 w-7 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
      </div>
    );
  }

  if (!data) return null;

  const metrics = [
    { label: "Revenue", value: `$${fmt(data.totalRevenue)}`, color: "text-primary-600" },
    { label: "Tickets", value: fmt(data.totalTickets), color: "text-amber-600" },
    { label: "Views", value: fmt(data.totalViews), color: "text-emerald-600" },
    { label: "Conversion", value: `${data.conversionPct}%`, color: "text-violet-600" },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Range filter */}
      <div className="flex justify-end">
        <DateRangeFilter value={range} onChange={setRange} />
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {metrics.map((m) => (
          <Card key={m.label} className="p-3">
            <p className="text-xs text-neutral-500">{m.label}</p>
            <p className={`mt-1 text-lg font-bold tabular-nums ${m.color}`}>{m.value}</p>
          </Card>
        ))}
      </div>

      {/* Sales chart */}
      <Card>
        <h3 className="mb-3 text-sm font-semibold text-neutral-900">Sales Over Time</h3>
        <LineChart
          data={data.dailyStats.map((d) => ({ label: d.date.slice(5), value: d.ticketsSold }))}
          color="#6366f1"
        />
      </Card>

      {/* Ticket mix */}
      <Card>
        <h3 className="mb-3 text-sm font-semibold text-neutral-900">Ticket Type Breakdown</h3>
        <BarChart
          data={data.ticketMix.map((t) => ({ label: t.type, value: t.count, color: t.color }))}
          height={180}
        />
      </Card>

      {/* Traffic Sources */}
      <Card>
        <h3 className="mb-4 text-sm font-semibold text-neutral-900">Traffic Sources</h3>
        <div className="space-y-3">
          {data.trafficSources.map((s) => (
            <div key={s.name}>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="text-neutral-700">{s.name}</span>
                <span className="font-medium text-neutral-900 tabular-nums">{s.pct}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-100">
                <div
                  className="h-full rounded-full bg-primary-500 transition-all duration-500"
                  style={{ width: `${s.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

