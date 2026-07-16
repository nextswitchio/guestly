import { AlertTriangle, Banknote, Building2, Monitor, Package, Star, Ticket } from 'lucide-react';
import React from "react";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";

export default function TicketsTab({ eventId }: { eventId: string }) {
  const [eventType, setEventType] = React.useState<string>("Physical");
  const [availability, setAvailability] = React.useState<{
    tickets: Array<{ type: string; price: number; available: number; attendanceType?: "physical" | "virtual" }>;
  } | null>(null);

  React.useEffect(() => {
    // Fetch event type for capacity calculations
    fetch(`/api/events/${eventId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        const ev = d?.event ?? d?.data ?? d;
        if (ev?.event_type || ev?.eventType) setEventType(ev.event_type ?? ev.eventType);
      })
      .catch((err) => console.error("Failed to load event type:", err));

    async function load() {
      const res = await fetch(`/api/tickets?eventId=${eventId}`);
      const data = await res.json();
      if (res.ok) setAvailability(data.availability);
    }
    load();
  }, [eventId]);

  if (!availability) {
    return (
      <div className="flex flex-col gap-6 animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 rounded-2xl bg-[var(--surface-card)] border border-[var(--surface-border)] shimmer" />
          ))}
        </div>
        {[1, 2].map((i) => (
          <div key={i} className="h-48 rounded-2xl bg-[var(--surface-card)] border border-[var(--surface-border)] shimmer" />
        ))}
      </div>
    );
  }

  // Calculate totals
  const totalSold = availability.tickets.reduce((sum, t) => {
    const initialCapacity = eventType === "Virtual" ? 500 : 200;
    const sold = initialCapacity - t.available;
    return sum + sold;
  }, 0);

  const totalRevenue = availability.tickets.reduce((sum, t) => {
    const initialCapacity = eventType === "Virtual" ? 500 : 200;
    const sold = initialCapacity - t.available;
    return sum + (sold * t.price);
  }, 0);

  const totalRemaining = availability.tickets.reduce((sum, t) => sum + t.available, 0);
  
  const totalCapacity = availability.tickets.reduce((sum, t) => {
    const initialCapacity = eventType === "Virtual" ? 500 : 200;
    return sum + initialCapacity;
  }, 0);

  const overallProgress = totalCapacity > 0 ? Math.round((totalSold / totalCapacity) * 100) : 0;
  const avgTicketPrice = totalSold > 0 ? totalRevenue / totalSold : 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Hero Stats Card */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-primary-500 to-primary-700 border-0 p-8">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />
        
        <div className="relative">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Ticket Sales</h2>
              <p className="text-sm text-white/80">Track your ticket performance</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="ticket" size={24} className="text-white" />
                <span className="text-xs font-medium text-white/70 uppercase tracking-wide">Sold</span>
              </div>
              <p className="text-3xl font-bold text-white tabular-nums">{totalSold}</p>
              <p className="text-xs text-white/60 mt-1">{overallProgress}% of capacity</p>
            </div>

            <div className="rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="money" size={24} className="text-white" />
                <span className="text-xs font-medium text-white/70 uppercase tracking-wide">Revenue</span>
              </div>
              <p className="text-3xl font-bold text-white tabular-nums">${totalRevenue.toLocaleString()}</p>
              <p className="text-xs text-white/60 mt-1">Total earnings</p>
            </div>

            <div className="rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl"><Package className="h-4 w-4 inline-block" /></span>
                <span className="text-xs font-medium text-white/70 uppercase tracking-wide">Available</span>
              </div>
              <p className="text-3xl font-bold text-white tabular-nums">{totalRemaining}</p>
              <p className="text-xs text-white/60 mt-1">Tickets remaining</p>
            </div>

            <div className="rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">Banknote</span>
                <span className="text-xs font-medium text-white/70 uppercase tracking-wide">Avg Price</span>
              </div>
              <p className="text-3xl font-bold text-white tabular-nums">${avgTicketPrice.toFixed(0)}</p>
              <p className="text-xs text-white/60 mt-1">Per ticket</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Ticket Types */}
      <div className="grid gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[var(--foreground)]">Ticket Types</h3>
          <button className="flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-700 hover:shadow-lg">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Ticket Type
          </button>
        </div>

        {availability.tickets.map((t, idx) => {
          const initialCapacity = eventType === "Virtual" ? 500 : 200;
          const sold = initialCapacity - t.available;
          const total = initialCapacity;
          const pct = Math.round((sold / total) * 100);
          const revenue = sold * t.price;
          
          const ticketKey = t.attendanceType ? `${t.type}-${t.attendanceType}` : t.type;
          const isVIP = t.type === "VIP";
          const isLowStock = t.available < total * 0.2;
          const isSoldOut = t.available === 0;

          return (
            <Card key={ticketKey} className="group hover:shadow-lg transition-all duration-300">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Left: Ticket Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
                      isVIP 
                        ? "bg-gradient-to-br from-warning-400 to-warning-600" 
                        : "bg-gradient-to-br from-primary-400 to-primary-600"
                    }`}>
                      <span className="text-xl">{isVIP ? <Star className="h-5 w-5" /> : <Ticket className="h-5 w-5" />}</span>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h4 className="text-lg font-bold text-[var(--foreground)]">{t.type}</h4>
                        {t.attendanceType === "physical" && (
                          <span className="text-xs px-2.5 py-1 rounded-full bg-primary-100 text-primary-700 font-medium border border-primary-200">
                           <Building2 className="h-4 w-4 inline" /> In-Person
                          </span>
                        )}
                        {t.attendanceType === "virtual" && (
                          <span className="text-xs px-2.5 py-1 rounded-full bg-success-100 text-success-700 font-medium border border-success-200">
                           <Monitor className="h-4 w-4 inline" /> Virtual
                          </span>
                        )}
                        {isSoldOut && (
                          <span className="text-xs px-2.5 py-1 rounded-full bg-danger-100 text-danger-700 font-bold border border-danger-200">
                            SOLD OUT
                          </span>
                        )}
                        {isLowStock && !isSoldOut && (
                          <span className="text-xs px-2.5 py-1 rounded-full bg-warning-100 text-warning-700 font-medium border border-warning-200">
                           <AlertTriangle className="h-4 w-4 inline" /> Low Stock
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-[var(--foreground-subtle)]">
                        <span className="font-semibold text-[var(--foreground)] text-lg tabular-nums">${t.price}</span>
                        <span>•</span>
                        <span>{sold} sold</span>
                        <span>•</span>
                        <span>{t.available} available</span>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[var(--foreground-subtle)]">Sales Progress</span>
                      <span className="font-semibold text-[var(--foreground)] tabular-nums">{pct}%</span>
                    </div>
                    <div className="relative h-3 w-full overflow-hidden rounded-full bg-[var(--surface-border)]">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isVIP 
                            ? "bg-gradient-to-r from-warning-400 to-warning-600" 
                            : "bg-gradient-to-r from-primary-400 to-primary-600"
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Right: Revenue & Actions */}
                <div className="flex flex-col items-end gap-3">
                  <div className="text-right">
                    <p className="text-xs text-[var(--foreground-subtle)] mb-1">Revenue</p>
                    <p className="text-2xl font-bold text-[var(--foreground)] tabular-nums">${revenue.toLocaleString()}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <button className="flex items-center gap-1 rounded-lg border border-[var(--surface-border)] bg-[var(--surface-card)] px-3 py-1.5 text-xs font-medium text-[var(--foreground)] transition hover:bg-[var(--surface-hover)]">
                      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </button>
                    <button className="flex items-center gap-1 rounded-lg border border-[var(--surface-border)] bg-[var(--surface-card)] px-3 py-1.5 text-xs font-medium text-[var(--foreground)] transition hover:bg-[var(--surface-hover)]">
                      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      Stats
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card className="bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-navy-900 dark:to-navy-800 border-neutral-200">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-[var(--foreground)] mb-1">Need to make changes?</h3>
            <p className="text-sm text-[var(--foreground-subtle)]">Adjust pricing, add new ticket types, or pause sales</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 rounded-xl border border-[var(--surface-border)] bg-white px-4 py-2.5 text-sm font-medium text-[var(--foreground)] transition hover:shadow-md">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Export Data
            </button>
            <button className="flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-primary-700 hover:shadow-lg">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              Manage Pricing
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}

