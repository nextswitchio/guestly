// ── Analytics types & seed data ──────────────────────────────────────────────

export interface DailyStat {
  date: string; // YYYY-MM-DD
  revenue: number;
  ticketsSold: number;
  pageViews: number;
}

export interface TicketMix {
  type: string;
  count: number;
  color: string;
}

export interface AudienceSegment {
  label: string;
  value: number;
  color: string;
}

export interface TrafficSource {
  name: string;
  pct: number;
}

export interface TopEvent {
  name: string;
  sold: number;
  revenue: number;
  views: number;
}

export interface AnalyticsOverview {
  totalRevenue: number;
  totalTickets: number;
  totalViews: number;
  conversionPct: number;
  revenueChange: number;
  ticketsChange: number;
  viewsChange: number;
  conversionChange: number;
  dailyStats: DailyStat[];
  ticketMix: TicketMix[];
  audience: AudienceSegment[];
  topEvents: TopEvent[];
  trafficSources: TrafficSource[];
}

// ── Seed data ────────────────────────────────────────────────────────────────

function generateDailyStats(days: number, baseRevenue: number, baseTickets: number): DailyStat[] {
  const stats: DailyStat[] = [];
  const now = new Date("2026-02-17");
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const jitter = 0.6 + Math.random() * 0.8;
    const weekday = d.getDay();
    const weekendBoost = weekday === 0 || weekday === 6 ? 1.4 : 1;
    stats.push({
      date: d.toISOString().slice(0, 10),
      revenue: Math.round(baseRevenue * jitter * weekendBoost),
      ticketsSold: Math.round(baseTickets * jitter * weekendBoost),
      pageViews: Math.round((baseTickets * 8 + 40) * jitter * weekendBoost),
    });
  }
  return stats;
}

const GLOBAL_DAILY = generateDailyStats(30, 620, 42);

const GLOBAL_TICKET_MIX: TicketMix[] = [
  { type: "General", count: 840, color: "#6366f1" },
  { type: "VIP", count: 280, color: "#f59e0b" },
  { type: "Early Bird", count: 120, color: "#10b981" },
];

const GLOBAL_AUDIENCE: AudienceSegment[] = [
  { label: "18–24", value: 35, color: "#6366f1" },
  { label: "25–34", value: 40, color: "#8b5cf6" },
  { label: "35–44", value: 15, color: "#f59e0b" },
  { label: "45+", value: 10, color: "#10b981" },
];

const GLOBAL_TOP_EVENTS: TopEvent[] = [
  { name: "Tech Summit 2026", sold: 420, revenue: 6300, views: 3200 },
  { name: "Music Fiesta", sold: 310, revenue: 4650, views: 2800 },
  { name: "Art Expo", sold: 280, revenue: 4200, views: 1900 },
  { name: "Street Food Carnival", sold: 230, revenue: 3450, views: 2100 },
];

const GLOBAL_TRAFFIC: TrafficSource[] = [
  { name: "Direct Link", pct: 42 },
  { name: "Social Media", pct: 28 },
  { name: "Search Engine", pct: 18 },
  { name: "Referral", pct: 12 },
];

// ── Per-event data (keyed by eventId) ────────────────────────────────────────

const EVENT_DAILY: Record<string, DailyStat[]> = {
  "evt-1": generateDailyStats(30, 210, 14),
  "evt-2": generateDailyStats(30, 155, 10),
  "evt-3": generateDailyStats(30, 140, 9),
  "evt-4": generateDailyStats(30, 115, 8),
};

// ── Public helpers ───────────────────────────────────────────────────────────

export function getAnalyticsOverview(range?: { from?: string; to?: string }): AnalyticsOverview {
  let daily = GLOBAL_DAILY;
  if (range?.from || range?.to) {
    daily = daily.filter((d) => {
      if (range.from && d.date < range.from) return false;
      if (range.to && d.date > range.to) return false;
      return true;
    });
  }

  const totalRevenue = daily.reduce((s, d) => s + d.revenue, 0);
  const totalTickets = daily.reduce((s, d) => s + d.ticketsSold, 0);
  const totalViews = daily.reduce((s, d) => s + d.pageViews, 0);
  const conversionPct = totalViews > 0 ? +((totalTickets / totalViews) * 100).toFixed(1) : 0;

  return {
    totalRevenue,
    totalTickets,
    totalViews,
    conversionPct,
    revenueChange: 12,
    ticketsChange: 8,
    viewsChange: 24,
    conversionChange: -0.5,
    dailyStats: daily,
    ticketMix: GLOBAL_TICKET_MIX,
    audience: GLOBAL_AUDIENCE,
    topEvents: GLOBAL_TOP_EVENTS,
    trafficSources: GLOBAL_TRAFFIC,
  };
}

export function getEventAnalytics(eventId: string, range?: { from?: string; to?: string }) {
  let daily = EVENT_DAILY[eventId] || generateDailyStats(30, 100, 7);
  if (range?.from || range?.to) {
    daily = daily.filter((d) => {
      if (range.from && d.date < range.from) return false;
      if (range.to && d.date > range.to) return false;
      return true;
    });
  }

  const totalRevenue = daily.reduce((s, d) => s + d.revenue, 0);
  const totalTickets = daily.reduce((s, d) => s + d.ticketsSold, 0);
  const totalViews = daily.reduce((s, d) => s + d.pageViews, 0);
  const conversionPct = totalViews > 0 ? +((totalTickets / totalViews) * 100).toFixed(1) : 0;

  const ticketMix: TicketMix[] = [
    { type: "General", count: Math.round(totalTickets * 0.68), color: "#6366f1" },
    { type: "VIP", count: Math.round(totalTickets * 0.22), color: "#f59e0b" },
    { type: "Early Bird", count: Math.round(totalTickets * 0.1), color: "#10b981" },
  ];

  const trafficSources: TrafficSource[] = [
    { name: "Direct Link", pct: 45 },
    { name: "Social Media", pct: 30 },
    { name: "Search", pct: 15 },
    { name: "Referral", pct: 10 },
  ];

  return {
    totalRevenue,
    totalTickets,
    totalViews,
    conversionPct,
    revenueChange: 15,
    ticketsChange: 8,
    viewsChange: 32,
    conversionChange: -0.3,
    dailyStats: daily,
    ticketMix,
    trafficSources,
  };
}
