"use client";
import React from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import EventCard from "@/components/events/EventCard";
import EmptyState from "@/components/ui/EmptyState";
import { Icon } from "@/components/ui/Icon";
import { useRouter } from "next/navigation";

const tabs = [
  { key: "upcoming", label: "Upcoming", icon: "calendar" as const },
  { key: "saved", label: "Saved", icon: "heart" as const },
  { key: "recommended", label: "For You", icon: "sparkles" as const },
  { key: "past", label: "Past", icon: "clock" as const },
] as const;

type TabKey = (typeof tabs)[number]["key"];

function StatCard({ label, value, icon, iconBg, children }: { label: string; value: string | number; icon: string; iconBg: string; children?: React.ReactNode }) {
  return (
    <div className="group relative rounded-xl bg-white p-5 shadow-sm border border-neutral-200/60 transition-all duration-300 hover:shadow-md hover:border-neutral-300 flex flex-col">
      <div className="flex items-center gap-3">
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${iconBg} text-white transition-transform duration-300 group-hover:scale-110`}>
          <Icon name={icon as any} size={20} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-2xl font-bold tabular-nums text-neutral-900 truncate">{value}</p>
          <p className="text-xs font-medium text-neutral-500">{label}</p>
        </div>
      </div>
      {children && <div className="mt-3 pt-3 border-t border-neutral-100 space-y-1.5">{children}</div>}
    </div>
  );
}

export default function AttendeePage() {
  const router = useRouter();
  const [tab, setTab] = React.useState<TabKey>("upcoming");
  const [wallet, setWallet] = React.useState<{ balance: number; promoBalance: number } | null>(null);
  const [orders, setOrders] = React.useState<any[]>([]);
  const [savedIds, setSavedIds] = React.useState<string[]>([]);
  const [savedEvents, setSavedEvents] = React.useState<any[]>([]);
  const [upcomingEvents, setUpcomingEvents] = React.useState<any[]>([]);
  const [pastEvents, setPastEvents] = React.useState<any[]>([]);
  const [unreadCount, setUnreadCount] = React.useState(0);
  const [referralStats, setReferralStats] = React.useState<{ totalReferrals: number; totalEarned: number } | null>(null);
  const [followedOrganizers, setFollowedOrganizers] = React.useState<any[]>([]);
  const [recommended, setRecommended] = React.useState<any[]>([]);
  const [recommendationsLoading, setRecommendationsLoading] = React.useState(false);
  const [eventsLoading, setEventsLoading] = React.useState(true);

  React.useEffect(() => {
    fetch("/api/wallet/balance").then(r => r.json()).then(d => { if (d.ok) setWallet(d); }).catch(() => {});
    fetch("/api/orders/user").then(r => r.json()).then(d => { if (d.success) setOrders(d.orders); }).catch(() => {});
    fetch("/api/events/save").then(r => r.json()).then(d => {
      if (d.ok) {
        setSavedIds(d.data.map((e: any) => e.event_id || e.id));
        setSavedEvents(d.data);
      }
    }).catch(() => {});
    fetch("/api/notifications?unreadOnly=true").then(r => r.json()).then(d => { if (d.success) setUnreadCount(d.data.length); }).catch(() => {});
    fetch("/api/referrals/stats").then(r => r.json()).then(d => { setReferralStats(d); }).catch(() => {});
    fetch("/api/follows").then(r => r.json()).then(d => { if (d.success) setFollowedOrganizers(d.data); }).catch(() => {});

    // Fetch upcoming and past events from backend
    setEventsLoading(true);
    const today = new Date().toISOString().split("T")[0];
    const yesterdayEnd = new Date(Date.now() - 86400000);
    yesterdayEnd.setHours(23, 59, 59, 999);
    Promise.all([
      fetch(`/api/events?status=published&startDate=${today}&page_size=20`).then(r => r.json()).catch(() => ({ events: [] })),
      fetch(`/api/events?status=published&endDate=${yesterdayEnd.toISOString()}&page_size=20`).then(r => r.json()).catch(() => ({ events: [] })),
    ]).then(([upcoming, past]) => {
      setUpcomingEvents(Array.isArray(upcoming?.events) ? upcoming.events : []);
      setPastEvents(Array.isArray(past?.events) ? past.events : []);
    }).finally(() => setEventsLoading(false));

    // Fetch personalized recommendations
    setRecommendationsLoading(true);
    fetch("/api/community/events/recommendations?limit=10")
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          setRecommended(d.data.map((e: any) => ({
            id: e.id, title: e.title, description: e.description,
            date: e.date, category: e.category, city: e.city,
            image: e.image, eventType: e.event_type, distanceKm: e.distance_km,
          })));
        }
      })
      .catch(() => {})
      .finally(() => setRecommendationsLoading(false));
  }, []);

  function fmt(d: string) {
    if (!d) return "";
    return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }

  const sectionMap: Record<TabKey, any[]> = { upcoming: upcomingEvents, saved: savedEvents, recommended, past: pastEvents };
  const events = sectionMap[tab];
  const walletBalance = wallet?.balance ?? 0;
  const promoBalance = wallet?.promoBalance ?? 0;
  const recentOrders = orders.slice(0, 3);
  const totalSpent = orders.reduce((sum, o) => sum + (o.total ?? 0), 0);
  const nextEvent = upcomingEvents.length > 0 ? upcomingEvents[0] : null;
  const paidOrders = orders.filter(o => o.status === "paid").length;
  const pendingOrders = orders.length - paidOrders;
  const lastSaved = savedEvents.length > 0 ? savedEvents[savedEvents.length - 1] : null;

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

        {/* Stats + Quick Actions (side by side) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Stats col */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <StatCard label="Upcoming" value={upcomingEvents.length} icon="calendar" iconBg="bg-dark">
                {nextEvent ? (
                  <>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-neutral-400">Next event</span>
                      <span className="font-medium text-neutral-700 truncate max-w-[55%] text-right">{nextEvent.title}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-neutral-400">Date</span>
                      <span className="font-medium text-neutral-700">{fmt(nextEvent.date)}</span>
                    </div>
                  </>
                ) : (
                  <p className="text-xs text-neutral-400">No upcoming events</p>
                )}
              </StatCard>
              <StatCard label="Saved" value={savedEvents.length} icon="heart" iconBg="bg-rose-500">
                {lastSaved ? (
                  <>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-neutral-400">Last saved</span>
                      <span className="font-medium text-neutral-700 truncate max-w-[55%] text-right">{lastSaved.title}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-neutral-400">Date</span>
                      <span className="font-medium text-neutral-700">{fmt(lastSaved.date)}</span>
                    </div>
                  </>
                ) : (
                  <p className="text-xs text-neutral-400">Save events to find them later</p>
                )}
              </StatCard>
              <StatCard label="Orders" value={orders.length} icon="ticket" iconBg="bg-emerald-500">
                {orders.length > 0 ? (
                  <>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-neutral-400">Total spent</span>
                      <span className="font-semibold text-neutral-800">₦{totalSpent.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span className="text-neutral-500">{paidOrders} paid</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-warning-400" />
                        <span className="text-neutral-500">{pendingOrders} pending</span>
                      </span>
                    </div>
                  </>
                ) : (
                  <p className="text-xs text-neutral-400">No orders yet</p>
                )}
              </StatCard>
              <StatCard label="Balance" value={`₦${walletBalance.toLocaleString()}`} icon="wallet" iconBg="bg-amber-500">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-400">Main balance</span>
                  <span className="font-medium text-neutral-700">₦{(walletBalance - promoBalance).toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-400">Promo credit</span>
                  <span className="font-medium text-emerald-600">{promoBalance > 0 ? `₦${promoBalance.toLocaleString()}` : "—"}</span>
                </div>
              </StatCard>
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {recentOrders.map((order: any) => (
                    <div key={order.id} className="group relative rounded-xl bg-white p-4 shadow-sm border border-neutral-200/60 border-l-4 border-l-lime transition-all duration-300 hover:shadow-md">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-neutral-900 truncate">{order.event_title ?? order.eventTitle ?? "Event"}</p>
                          <p className="text-[11px] text-neutral-500 mt-0.5">
                            {order.created_at ? new Date(order.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : ""}
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
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Quick Actions col */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Quick Actions</h3>
            <button onClick={() => router.push("/attendee/referrals")} className="group flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm border border-neutral-200/60 text-left transition-all duration-300 hover:shadow-md hover:border-neutral-300 w-full">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-lime/10 text-dark transition-transform duration-300 group-hover:scale-110 shrink-0">
                <Icon name="link" size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-neutral-900">Refer & Earn</p>
                <p className="text-xs text-neutral-500 truncate">
                  {referralStats ? `${referralStats.totalReferrals} referral${referralStats.totalReferrals !== 1 ? "s" : ""} • ₦${(referralStats.totalEarned ?? 0).toLocaleString()} earned` : "Invite friends to earn rewards"}
                </p>
              </div>
            </button>
            <button onClick={() => router.push("/wallet")} className="group flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm border border-neutral-200/60 text-left transition-all duration-300 hover:shadow-md hover:border-neutral-300 w-full">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 transition-transform duration-300 group-hover:scale-110 shrink-0">
                <Icon name="target" size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-neutral-900">Savings</p>
                <p className="text-xs text-neutral-500">Save towards your next event</p>
              </div>
            </button>
            <button onClick={() => router.push("/near")} className="group flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm border border-neutral-200/60 text-left transition-all duration-300 hover:shadow-md hover:border-neutral-300 w-full">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-100 text-rose-600 transition-transform duration-300 group-hover:scale-110 shrink-0">
                <Icon name="location" size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-neutral-900">Near Me</p>
                <p className="text-xs text-neutral-500">Discover events around you</p>
              </div>
            </button>
          </div>
        </div>

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
        {tab === "recommended" && recommendationsLoading ? (
          <div className="rounded-xl bg-white p-8 shadow-sm border border-neutral-200/60 flex flex-col items-center justify-center py-12">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-lime border-t-transparent mb-4" />
            <p className="text-sm text-neutral-500">Finding events you&apos;ll love...</p>
          </div>
        ) : events.length === 0 ? (
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
                  key={e.event_id || e.id}
                  id={e.event_id || e.id}
                  title={e.title}
                  description={e.description}
                  date={e.date}
                  city={e.city}
                  category={e.category}
                  image={e.image}
                  eventType={e.event_type?.toLowerCase()}
                  distanceKm={(e as any).distanceKm}
                />
              ))}
            </div>
          </section>
        )}

        {/* Following */}
        {followedOrganizers.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-dark">Following ({followedOrganizers.length})</h2>
              <span className="text-[10px] text-neutral-400">Organizers you follow</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {followedOrganizers.map((org: any) => (
                <div key={org.following_id} className="rounded-xl bg-white p-4 shadow-sm border border-neutral-200/60 transition-all duration-300 hover:shadow-md hover:border-neutral-300">
                  <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-lime/10 text-dark text-base font-bold overflow-hidden">
                      {org.avatar ? (
                        <img src={org.avatar} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span>{org.display_name?.charAt(0)?.toUpperCase() || "O"}</span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-dark truncate">{org.display_name}</p>
                      {org.bio && <p className="text-xs text-neutral-500 mt-0.5 line-clamp-2 leading-relaxed">{org.bio}</p>}
                      <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                        {(org.location_city || org.location_country) && (
                          <span className="text-[11px] text-neutral-400 flex items-center gap-1">
                            <Icon name="location" size={11} />
                            {[org.location_city, org.location_country].filter(Boolean).join(", ")}
                          </span>
                        )}
                        {org.created_at && (
                          <span className="text-[11px] text-neutral-400">
                            Since {new Date(org.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="shrink-0">
                      <button
                        onClick={async () => {
                          await fetch("/api/follows", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ organizerId: org.following_id, action: "unfollow" }),
                          });
                          setFollowedOrganizers(prev => prev.filter(o => o.following_id !== org.following_id));
                        }}
                        className="rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-500 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
                      >
                        Unfollow
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}


      </div>
    </ProtectedRoute>
  );
}
