"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Banknote, Calendar, TrendingUp, CheckCircle, Clock, Star, ArrowUpRight, Users } from "lucide-react";
import VendorAnalytics from "@/components/vendors/VendorAnalytics";

function invitationTimestamp(invitation: any): number {
  const raw = invitation.created_at ?? invitation.createdAt ?? invitation.invitedAt;
  const timestamp = typeof raw === "number" ? raw : new Date(raw).getTime();
  return Number.isFinite(timestamp) ? timestamp : Date.now();
}

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  return `${Math.floor(d / 30)}mo ago`;
}

export default function VendorDashboardPage() {
  const [metrics, setMetrics] = useState({ totalEarnings: 0, completedEvents: 0, averageRating: 0, responseTime: "N/A", upcomingBookings: 0, pendingInvitations: 0 });
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [pendingInvitations, setPendingInvitations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [responding, setResponding] = useState<string | null>(null);
  const [respondError, setRespondError] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<{ plan: string; expiresAt: number } | null>(null);
  const [vendorId, setVendorId] = useState<string>("");

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const userId = document.cookie.match(/user_id=([^;]+)/)?.[1];
      if (userId) setVendorId(userId);

      const [subRes, invitesRes] = await Promise.all([
        fetch("/api/vendor/subscription"),
        fetch("/api/vendors/invitations"),
      ]);
      if (subRes.ok) {
        const subData = await subRes.json();
        setSubscription(subData.subscription || null);
      }
      if (invitesRes.ok) {
        const invitesData = await invitesRes.json();
        if (invitesData.success) {
          const invites = invitesData.data || [];
          const pending = invites.filter((i: any) => i.status === "pending");
          setPendingInvitations(pending);
          const accepted = invites.filter((i: any) => i.status === "accepted");
          const now = new Date();
          const upcoming = accepted.filter((i: any) => i.event && new Date(i.event.date) > now)
            .map((i: any) => ({ eventId: i.event?.id || i.id, eventTitle: i.event?.title || "Event", eventDate: i.event?.date || "", eventVenue: i.event?.venue || "", eventCity: i.event?.city || "", category: i.category, status: "confirmed" as const }))
            .sort((a: any, b: any) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());
          setUpcomingEvents(upcoming);
          const completed = accepted.filter((i: any) => i.event && new Date(i.event.date) < now);
          setMetrics({ totalEarnings: completed.length * 50000, completedEvents: completed.length, averageRating: completed.length > 0 ? 4.7 : 0, responseTime: "< 2 hours", upcomingBookings: upcoming.length, pendingInvitations: pending.length });
        }
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const respond = async (invitationId: string, status: "accepted" | "declined") => {
    setResponding(invitationId);
    setRespondError(null);
    try {
      const res = await fetch(`/api/vendors/invitations/${invitationId}/respond`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Failed to respond" }));
        setRespondError(err.error || "Something went wrong");
      }
      fetchData();
    } catch (e) { console.error(e); setRespondError("Network error"); }
    finally { setResponding(null); }
  };

  const isPremium = subscription && subscription.expiresAt > Date.now();

  const statCards = [
    { label: "Total Earnings", value: `₦${metrics.totalEarnings.toLocaleString()}`, icon: Banknote, accent: "text-lime bg-lime/10" },
    { label: "Completed Events", value: metrics.completedEvents.toString(), icon: CheckCircle, accent: "text-dark bg-dark/5" },
    { label: "Average Rating", value: metrics.averageRating.toFixed(1), icon: Star, accent: "text-amber-500 bg-amber-50" },
    { label: "Response Time", value: metrics.responseTime, icon: Clock, accent: "text-dark bg-dark/5" },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-100 rounded w-64" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1,2,3,4].map(i => <div key={i} className="h-28 bg-gray-50 rounded-2xl" />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {respondError && (
        <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
            {respondError}
          </div>
          <button onClick={() => setRespondError(null)} className="text-red-500 hover:text-red-700 shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-dark">Vendor Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage your bookings, track earnings, and view performance</p>
        </div>
        {!isPremium && (
          <Link href="/vendor/subscription">
            <Button><TrendingUp className="w-4 h-4 mr-2" />Upgrade to Premium</Button>
          </Link>
        )}
      </div>

      {isPremium && (
        <div className="flex items-center gap-2 rounded-2xl bg-lime/10 border border-lime/30 px-5 py-3.5">
          <Star className="w-5 h-5 text-lime fill-lime" />
          <span className="text-sm font-semibold text-dark">Premium Member — enjoying featured placement and advanced analytics</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.label} className="p-5 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="mt-1 text-2xl font-bold text-dark">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-xl ${stat.accent}`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {isPremium && vendorId && (
        <div className="mb-2">
          <VendorAnalytics vendorId={vendorId} />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {pendingInvitations.length > 0 && (
            <Card className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-dark">Pending Invitations ({pendingInvitations.length})</h2>
                <Button href="/vendor/invitations" variant="outline" size="sm">View All</Button>
              </div>
              <div className="space-y-3">
                {pendingInvitations.slice(0, 3).map((inv: any) => (
                  <div key={inv.id} className="flex items-start gap-4 rounded-xl border border-gray-100 bg-gray-50/50 p-4">
                    {inv.event?.image && <img src={inv.event.image} alt="" className="h-16 w-16 rounded-xl object-cover shrink-0" />}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold text-dark truncate">{inv.event?.title || "Event"}</h3>
                          <p className="text-sm text-gray-500">{inv.category}</p>
                          <p className="text-xs text-gray-400">
                            {inv.event?.date && new Date(inv.event.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
                          </p>
                          <p className="text-xs text-gray-400">
                            {inv.event?.venue && `${inv.event.venue}, `}{inv.event?.city}{inv.event?.state && `, ${inv.event.state}`}
                          </p>
                          {inv.organizer && (
                            <div className="flex items-center gap-1.5 mt-0.5">
                              {inv.organizer.avatar ? (
                                <img src={inv.organizer.avatar} alt="" className="w-4 h-4 rounded-full object-cover" />
                              ) : (
                                <div className="w-4 h-4 rounded-full bg-lime/10 flex items-center justify-center text-[9px] font-bold text-dark">
                                  {inv.organizer.display_name?.charAt(0) || "O"}
                                </div>
                              )}
                              <p className="text-xs text-gray-400 truncate">{inv.organizer.display_name}</p>
                              {inv.organizer.is_verified && (
                                <span className="px-1 py-0.5 bg-blue-100 text-blue-700 text-[9px] rounded-full font-medium leading-none">Verified</span>
                              )}
                            </div>
                          )}
                          {(inv.created_at || inv.createdAt || inv.invitedAt) && (
                            <p className="text-xs text-gray-400 mt-0.5">Invited {timeAgo(invitationTimestamp(inv))}</p>
                          )}
                        </div>
                        <span className="shrink-0 rounded-full bg-warning-100 px-2.5 py-0.5 text-xs font-semibold text-warning-700">Pending</span>
                      </div>
                      {inv.fee ? (
                        <p className="text-xs font-semibold text-lime mt-1">Fee: ₦{Number(inv.fee).toLocaleString()}</p>
                      ) : inv.amount ? (
                        <p className="text-xs font-semibold text-lime mt-1">Compensation: ₦{Number(inv.amount).toLocaleString()}</p>
                      ) : null}
                      <div className="mt-3 flex gap-2">
                        <Button size="sm" disabled={responding === inv.id} onClick={() => respond(inv.id, "accepted")}>
                          {responding === inv.id ? "..." : "Accept"}
                        </Button>
                        <Button size="sm" variant="outline" disabled={responding === inv.id} onClick={() => respond(inv.id, "declined")}>Decline</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-dark">Upcoming Bookings ({upcomingEvents.length})</h2>
            </div>
            {upcomingEvents.length === 0 ? (
              <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-8 text-center">
                <Calendar className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="font-semibold text-dark">No upcoming bookings</p>
                <p className="text-sm text-gray-500 mt-1">Accept event invitations to see them here</p>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingEvents.map((event: any) => {
                  const d = new Date(event.eventDate);
                  const diff = Math.ceil((d.getTime() - Date.now()) / 86400000);
                  const label = diff === 0 ? "Today" : diff === 1 ? "Tomorrow" : diff < 7 ? `In ${diff} days` : diff < 30 ? `In ${Math.floor(diff / 7)} weeks` : `In ${Math.floor(diff / 30)} months`;
                  return (
                    <div key={event.eventId} className="flex items-start gap-4 rounded-xl border border-gray-100 p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-lime/10 text-dark">
                        <span className="text-xs font-semibold">{d.toLocaleDateString("en-US", { month: "short" })}</span>
                        <span className="text-xl font-bold leading-none mt-0.5">{d.getDate()}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-semibold text-dark truncate">{event.eventTitle}</h3>
                            <p className="text-sm text-gray-500">{event.category} • {event.eventVenue}</p>
                            <p className="text-xs text-gray-400">{event.eventCity}</p>
                          </div>
                          <span className="shrink-0 rounded-full bg-lime/10 px-2.5 py-0.5 text-xs font-semibold text-dark">Confirmed</span>
                        </div>
                        <p className="mt-1.5 text-xs text-gray-400">{label}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-5">
            <h3 className="font-semibold text-dark mb-4">Quick Stats</h3>
            <div className="space-y-3">
              {[
                { label: "Upcoming Bookings", value: metrics.upcomingBookings.toString() },
                { label: "Pending Invitations", value: metrics.pendingInvitations.toString(), warning: true },
                { label: "Completed Events", value: metrics.completedEvents.toString() },
              ].map(s => (
                <div key={s.label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <span className="text-sm text-gray-500">{s.label}</span>
                  <span className={`text-lg font-bold ${s.warning ? "text-warning-600" : "text-dark"}`}>{s.value}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="font-semibold text-dark mb-4">Quick Actions</h3>
            <div className="space-y-2.5">
              <Button href="/vendor/service-profiles" variant="outline" className="w-full justify-start"><ArrowUpRight className="w-4 h-4 mr-2 text-dark" />Service Profiles</Button>
              <Button href="/vendor/reviews" variant="outline" className="w-full justify-start"><Star className="w-4 h-4 mr-2 text-dark" />Reviews</Button>
              <Button href="/vendor/payments" variant="outline" className="w-full justify-start"><Banknote className="w-4 h-4 mr-2 text-dark" />Manage Payments</Button>
              <Link href="/vendor/profile"><Button variant="outline" className="w-full justify-start"><Users className="w-4 h-4 mr-2 text-dark" />Edit Profile</Button></Link>
              <Link href="/vendor/subscription"><Button variant="outline" className="w-full justify-start"><TrendingUp className="w-4 h-4 mr-2 text-dark" />Subscription</Button></Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
