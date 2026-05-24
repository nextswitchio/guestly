'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';
import LineChart from '@/components/charts/LineChart';
import BarChart from '@/components/charts/BarChart';
import PieChart from '@/components/charts/PieChart';

interface EventInsights {
  event: { id: string; title: string } | null;
  ticketsSold: number;
  totalRevenue: number;
  conversionRate: number;
  avgTicketPrice: number;
  ticketTypeBreakdown: Array<{ label: string; value: number }>;
  weeklyTickets: Array<{ label: string; value: number }>;
  weeklyRevenue: Array<{ label: string; value: number }>;
}

export default function EventInsightsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [insights, setInsights] = useState<EventInsights | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`/api/events/${id}`).then((r) => r.json()).catch(() => null),
      fetch(`/api/orders?eventId=${id}`).then((r) => r.json()).catch(() => null),
    ]).then(([eventData, ordersData]) => {
      const event = eventData?.event ?? null;
      const orders: any[] = Array.isArray(ordersData?.orders) ? ordersData.orders : [];
      const paidOrders = orders.filter((o: any) => o.status === "paid");

      const totalRevenue = paidOrders.reduce((s: number, o: any) => s + (o.total ?? 0), 0);
      const ticketsSold = paidOrders.reduce((s: number, o: any) =>
        s + (o.items ?? []).reduce((si: number, i: any) => si + (i.quantity ?? 0), 0), 0);
      const avgTicketPrice = ticketsSold > 0 ? totalRevenue / ticketsSold : 0;
      const conversionRate = orders.length > 0 ? (paidOrders.length / orders.length) * 100 : 0;

      // Ticket type breakdown from order items
      const typeMap: Record<string, number> = {};
      paidOrders.forEach((o: any) => {
        (o.items ?? []).forEach((item: any) => {
          const t = item.type ?? item.ticket_type ?? "General";
          typeMap[t] = (typeMap[t] ?? 0) + (item.quantity ?? 0);
        });
      });
      const ticketTypeBreakdown = Object.entries(typeMap).map(([label, value]) => ({ label, value }));

      // Weekly buckets (last 4 weeks)
      const now = Date.now();
      const weeklyTickets = [1, 2, 3, 4].map((w) => {
        const start = now - w * 7 * 86400000;
        const end = now - (w - 1) * 7 * 86400000;
        const count = paidOrders
          .filter((o: any) => {
            const t = new Date(o.created_at).getTime();
            return t >= start && t < end;
          })
          .reduce((s: number, o: any) =>
            s + (o.items ?? []).reduce((si: number, i: any) => si + (i.quantity ?? 0), 0), 0);
        return { label: `Week ${5 - w}`, value: count };
      });

      const weeklyRevenue = [1, 2, 3, 4].map((w) => {
        const start = now - w * 7 * 86400000;
        const end = now - (w - 1) * 7 * 86400000;
        const rev = paidOrders
          .filter((o: any) => {
            const t = new Date(o.created_at).getTime();
            return t >= start && t < end;
          })
          .reduce((s: number, o: any) => s + (o.total ?? 0), 0);
        return { label: `Week ${5 - w}`, value: rev };
      });

      setInsights({ event, ticketsSold, totalRevenue, conversionRate, avgTicketPrice, ticketTypeBreakdown, weeklyTickets, weeklyRevenue });
    }).finally(() => setLoading(false));
  }, [id]);

  const fmt = (n: number) => n >= 1_000_000 ? `₦${(n / 1_000_000).toFixed(2)}M` : `₦${n.toLocaleString()}`;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-lime border-t-transparent" />
      </div>
    );
  }

  const stats = insights
    ? [
        { label: 'Total Tickets Sold', value: insights.ticketsSold.toLocaleString(), icon: 'ticket' as const },
        { label: 'Total Revenue', value: fmt(insights.totalRevenue), icon: 'trending-up' as const },
        { label: 'Conversion Rate', value: `${insights.conversionRate.toFixed(1)}%`, icon: 'target' as const },
        { label: 'Avg. Ticket Price', value: fmt(insights.avgTicketPrice), icon: 'chart' as const },
      ]
    : [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors"
        >
          <Icon name="arrow-left" size={16} />
          Back
        </button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">
            {insights?.event?.title ?? 'Event'} Insights
          </h1>
          <p className="text-neutral-500 mt-1">Detailed analytics and performance metrics</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="rounded-2xl border border-neutral-200 bg-white p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-neutral-500">{stat.label}</span>
              <Icon name={stat.icon} size={20} className="text-lime" />
            </div>
            <span className="text-2xl font-bold text-neutral-900">{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Charts */}
      {insights && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-neutral-200 bg-white p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Ticket Sales Over Time</h3>
            {insights.weeklyTickets.some((w) => w.value > 0) ? (
              <LineChart data={insights.weeklyTickets} />
            ) : (
              <p className="text-sm text-neutral-400 py-8 text-center">No ticket sales data yet</p>
            )}
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Revenue by Week</h3>
            {insights.weeklyRevenue.some((w) => w.value > 0) ? (
              <BarChart data={insights.weeklyRevenue} />
            ) : (
              <p className="text-sm text-neutral-400 py-8 text-center">No revenue data yet</p>
            )}
          </div>

          {insights.ticketTypeBreakdown.length > 0 && (
            <div className="rounded-2xl border border-neutral-200 bg-white p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Ticket Type Distribution</h3>
              <PieChart data={insights.ticketTypeBreakdown} />
            </div>
          )}
        </div>
      )}

      {/* No data state */}
      {insights && insights.ticketsSold === 0 && (
        <div className="rounded-2xl border border-neutral-200 bg-white p-10 text-center">
          <p className="text-neutral-500 text-sm">No ticket sales yet. Share your event to start selling.</p>
        </div>
      )}
    </div>
  );
}
