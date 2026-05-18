"use client";
import React from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import EventCard from "@/components/events/EventCard";
import EmptyState from "@/components/ui/EmptyState";
import Card from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { filterEvents, getEventById } from "@/lib/events";
import { useRouter } from "next/navigation";

const tabs = [
  { key: "upcoming", label: "Upcoming", icon: "calendar" as const },
  { key: "saved", label: "Saved", icon: "heart" as const },
  { key: "recommended", label: "For You", icon: "sparkles" as const },
  { key: "past", label: "Past", icon: "clock" as const },
] as const;

type TabKey = (typeof tabs)[number]["key"];

function StatCard({ label, value, icon, iconBg }: { label: string; value: string | number; icon: string; iconBg: string }) {
  return (
    <div className="group relative rounded-xl bg-white p-5 shadow-sm border border-neutral-200/60 transition-all duration-300 hover:shadow-md hover:border-neutral-300">
      <div className="flex items-center gap-3">
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconBg} text-white transition-transform duration-300 group-hover:scale-110`}>
          <Icon name={icon as any} size={20} />
        </div>
        <div className="min-w-0">
          <p className="text-2xl font-bold tabular-nums text-neutral-900 truncate">{value}</p>
          <p className="text-xs font-medium text-neutral-500">{label}</p>
        </div>
      </div>
    </div>
  );
}

export default function AttendeePage() {
  const router = useRouter();
  const [tab, setTab] = React.useState<TabKey>("upcoming");
  const [wallet, setWallet] = React.useState<{ balance: number; promoBalance: number } | null>(null);
  const [orders, setOrders] = React.useState<any[]>([]);
  const [savedIds, setSavedIds] = React.useState<string[]>([]);
  const [unreadCount, setUnreadCount] = React.useState(0);
  const [referralStats, setReferralStats] = React.useState<{ totalReferrals: number; totalEarned: number } | null>(null);
  const [followedOrganizers, setFollowedOrganizers] = React.useState<any[]>([]);

  React.useEffect(() => {
    fetch("/api/wallet").then(r => r.json()).then(d => { if (d.success) setWallet(d.data); }).catch(() => {});
    fetch("/api/orders/user").then(r => r.json()).then(d => { if (d.success) setOrders(d.orders); }).catch(() => {});
    fetch("/api/events/save").then(r => r.json()).then(d => { if (d.ok) setSavedIds(d.data.map((e: any) => e.id)); }).catch(() => {});
    fetch("/api/notifications?unreadOnly=true").then(r => r.json()).then(d => { if (d.success) setUnreadCount(d.data.length); }).catch(() => {});
    fetch("/api/referrals/stats").then(r => r.json()).then(d => { setReferralStats(d); }).catch(() => {});
    fetch("/api/follows").then(r => r.json()).then(d => { if (d.success) setFollowedOrganizers(d.data); }).catch(() => {});
  }, []);

  const allEvents = filterEvents({}).data;
  const upcoming = allEvents.filter((e) => new Date(e.date) > new Date());
  const past = allEvents.filter((e) => new Date(e.date) <= new Date());
  const recommended = filterEvents({ category: "Tech" }).data;
  const saved = savedIds.map(id => getEventById(id)).filter(Boolean) as typeof allEvents;

  const sectionMap: Record<TabKey, typeof allEvents> = { upcoming, saved, recommended, past };
  const events = sectionMap[tab];
  const walletBalance = wallet?.balance ?? 0;
  const recentOrders = orders.slice(0, 3);

  return (
    <ProtectedRoute allowRoles={["attendee"]}>
      <div className="flex flex-col gap-6 sm:gap-8">
        {/* Welcome Header */}
        <div className="relative overflow-hidden rounded-2xl bg-dark p-6 sm:p-8 text-white shadow-lg">
          <div className="absolute -top-12 -right-8 h-48 w-48 rounded-full bg-lime/5 blur-3xl" />
          <div className="absolute -bottom-8 -left-8 h-40 w-40 rounded-full bg-white/[0.03] blur-2xl" />
          <div className="absolute top-1/2 right-1/4 h-px w-32 bg-gradient-to-r from-transparent via-lime/20 to-transparent" />
          <div className="relative">
            <div className="flex items-start justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-lime/10 px-3 py-1 text-lime text-xs font-semibold mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-lime" />
                  Dashboard
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Welcome back</h1>
                <p className="mt-1 text-sm text-white/60">Here&apos;s an overview of your events</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => router.push("/attendee/notifications")}
                  className="relative h-9 w-9 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center hover:bg-white/20 transition-all"
                >
                  <Icon name="bell" size={16} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-4.5 w-4.5 rounded-full bg-danger-500 text-[9px] font-bold flex items-center justify-center shadow-lg">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => router.push("/explore")}
                  className="hidden sm:inline-flex h-9 items-center gap-1.5 rounded-xl bg-white px-4 text-sm font-semibold text-dark shadow-sm transition-all hover:bg-lime hover:text-dark active:scale-95"
                >
                  <Icon name="search" size={14} />
                  Explore
                </button>
              </div>
            </div>
            <div className="mt-5 inline-flex items-center gap-3 rounded-xl bg-white/10 backdrop-blur border border-white/[0.08] px-4 py-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-lime text-dark font-bold text-xs">₦</div>
              <div>
                <p className="text-[11px] text-white/60 font-medium leading-tight">Wallet Balance</p>
                <p className="text-base font-bold tracking-tight">₦{walletBalance.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <StatCard label="Upcoming" value={upcoming.length} icon="calendar" iconBg="bg-dark" />
          <StatCard label="Saved" value={saved.length} icon="heart" iconBg="bg-rose-500" />
          <StatCard label="Orders" value={orders.length} icon="ticket" iconBg="bg-emerald-500" />
          <StatCard label="Balance" value={`₦${walletBalance.toLocaleString()}`} icon="wallet" iconBg="bg-amber-500" />
        </div>

        {/* Recent Orders */}
        {recentOrders.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-neutral-900">My Tickets</h2>
              <button onClick={() => router.push("/attendee/orders")} className="text-xs font-semibold text-dark hover:text-dark/70 transition-colors">
                View all &rarr;
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {recentOrders.map((order: any) => {
                const event = getEventById(order.eventId);
                if (!event) return null;
                return (
                  <div key={order.id} className="group relative rounded-xl bg-white p-4 shadow-sm border border-neutral-200/60 border-l-4 border-l-lime transition-all duration-300 hover:shadow-md">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-neutral-900 truncate">{event.title}</p>
                        <p className="text-[11px] text-neutral-500 mt-0.5">
                          {new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </p>
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                            order.status === "paid" ? "bg-emerald-100 text-emerald-700" :
                            order.status === "refunded" ? "bg-neutral-100 text-neutral-500" :
                            "bg-warning-100 text-warning-700"
                          }`}>
                            {order.status}
                          </span>
                          {order.items?.map((item: any, i: number) => (
                            <span key={i} className="text-[10px] font-medium text-neutral-400">{item.type} x{item.quantity}</span>
                          ))}
                        </div>
                      </div>
                      <button
                        onClick={() => router.push("/attendee/orders")}
                        className="shrink-0 h-7 w-7 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-400 hover:text-neutral-600 hover:bg-neutral-200 transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Icon name="arrow-right" size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Tabs */}
        <div className="flex gap-1.5 overflow-x-auto rounded-xl bg-neutral-100 p-1">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex-shrink-0 flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all ${
                tab === t.key
                  ? "bg-white text-neutral-900 shadow-sm"
                  : "text-neutral-500 hover:text-neutral-700"
              }`}
            >
              <Icon name={t.icon} size={14} />
              {t.label}
            </button>
          ))}
        </div>

        {/* Event Grid */}
        {events.length === 0 ? (
          <div className="rounded-xl bg-white p-8 shadow-sm border border-neutral-200/60 flex justify-center">
            <EmptyState
              icon="calendar"
              title={`No ${tab} events`}
              description="Check back later or explore new events to discover amazing experiences."
              action={{ label: "Explore Events", onClick: () => router.push("/explore") }}
            />
          </div>
        ) : (
          <section>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-base font-bold text-neutral-900 capitalize">{tab} Events</h2>
                <p className="text-xs text-neutral-500">{events.length} event{events.length !== 1 ? "s" : ""} found</p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((e) => (
                <EventCard
                  key={e.id}
                  id={e.id}
                  title={e.title}
                  description={e.description}
                  date={e.date}
                  city={e.city}
                  category={e.category}
                  image={e.image}
                />
              ))}
            </div>
          </section>
        )}

        {/* Following */}
        {followedOrganizers.length > 0 && (
          <section>
            <h2 className="text-base font-bold text-dark mb-3">Following ({followedOrganizers.length})</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {followedOrganizers.map((org: any) => (
                <div key={org.userId} className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm border border-neutral-200/60">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-lime/10 text-dark text-sm font-bold">
                    {org.displayName?.charAt(0)?.toUpperCase() || "O"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-dark truncate">{org.displayName}</p>
                    <p className="text-xs text-gray-500">{org.followers || 0} follower{(org.followers || 0) !== 1 ? "s" : ""}</p>
                  </div>
                  <button
                    onClick={async () => {
                      await fetch("/api/follows", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ organizerId: org.userId, action: "unfollow" }),
                      });
                      setFollowedOrganizers(prev => prev.filter(o => o.userId !== org.userId));
                    }}
                    className="shrink-0 rounded-lg border border-gray-200 px-2.5 py-1 text-xs font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors"
                  >
                    Unfollow
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button onClick={() => router.push("/attendee/referrals")} className="group flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm border border-neutral-200/60 text-left transition-all duration-300 hover:shadow-md hover:border-neutral-300">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-lime/10 text-dark transition-transform duration-300 group-hover:scale-110">
              <Icon name="link" size={18} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-neutral-900">Refer & Earn</p>
              <p className="text-xs text-neutral-500 truncate">
                {referralStats ? `${referralStats.totalReferrals} referral${referralStats.totalReferrals !== 1 ? "s" : ""} • ₦${(referralStats.totalEarned ?? 0).toLocaleString()} earned` : "Invite friends to earn rewards"}
              </p>
            </div>
          </button>
          <button onClick={() => router.push("/wallet")} className="group flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm border border-neutral-200/60 text-left transition-all duration-300 hover:shadow-md hover:border-neutral-300">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 transition-transform duration-300 group-hover:scale-110">
              <Icon name="target" size={18} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-neutral-900">Savings</p>
              <p className="text-xs text-neutral-500">Save towards your next event</p>
            </div>
          </button>
          <button onClick={() => router.push("/near")} className="group flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm border border-neutral-200/60 text-left transition-all duration-300 hover:shadow-md hover:border-neutral-300">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-100 text-rose-600 transition-transform duration-300 group-hover:scale-110">
              <Icon name="location" size={18} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-neutral-900">Near Me</p>
              <p className="text-xs text-neutral-500">Discover events around you</p>
            </div>
          </button>
        </div>
      </div>
    </ProtectedRoute>
  );
}
