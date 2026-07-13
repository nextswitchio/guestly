"use client";

import React from "react";
import EventHero from "@/components/events/EventHero";
import DiscussionBoard from "@/components/events/DiscussionBoard";
import type { Event } from "@/lib/events";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { useScrollAnimation } from "@/lib/hooks/useScrollAnimation";
import { SocialProofWidget } from "@/components/events/SocialProofWidget";
import { RecentPurchasePopup } from "@/components/events/RecentPurchasePopup";
import { SocialShareButtons } from "@/components/events/SocialShareButtons";
import { EventReviews } from "@/components/events/EventReviews";
import FollowButton from "@/components/users/FollowButton";
import { slugify } from "@/lib/utils";

interface EventDetailClientProps {
  event: Event;
}

interface OrganizerInfo {
  id: string;
  name: string;
  verified: boolean;
  avatar?: string;
  bio?: string;
  email?: string;
  followerCount?: number;
  totalEvents?: number;
  totalAttendees?: number;
}

export default function EventDetailClient({ event }: EventDetailClientProps) {
  const aboutSection = useScrollAnimation({ threshold: 0.2 });
  const detailsSection = useScrollAnimation({ threshold: 0.2 });
  const actionsSection = useScrollAnimation({ threshold: 0.2 });

  const [merchProductCount, setMerchProductCount] = React.useState(0);
  const [loadingMerch, setLoadingMerch] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState<"about" | "discussion">("about");
  const [organizer, setOrganizer] = React.useState<OrganizerInfo | null>(null);
  const [attendeeCount, setAttendeeCount] = React.useState(0);
  const [isSaved, setIsSaved] = React.useState(false);
  const [saveLoading, setSaveLoading] = React.useState(false);

  const eventType = event.eventType ?? "Physical";
  const isEventPast = new Date(event.date) < new Date();
  const isMerchAvailable = !isEventPast || event.postEventMerchSales;

  const formattedDate = new Date(event.date).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  React.useEffect(() => {
    // Fetch merch count
    fetch(`/api/merch?eventId=${event.id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (d) setMerchProductCount(d.products?.length || 0); })
      .catch(() => {})
      .finally(() => setLoadingMerch(false));

    // Set organizer info
    if (event.organizerName) {
      setOrganizer({
        id: event.organizerId ?? `org-${event.organizerName.toLowerCase().replace(/\s+/g, '-')}`,
        name: event.organizerName,
        verified: event.organizerVerified ?? false,
        avatar: event.organizerAvatar,
        bio: event.organizerBio,
        email: event.organizerEmail,
        followerCount: event.organizerFollowerCount,
        totalEvents: event.organizerTotalEvents,
        totalAttendees: event.organizerTotalAttendees,
      });
    } else if (event.organizerId) {
      fetch(`/api/users/organizer/${event.organizerId}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => {
          if (d && d.display_name) {
            setOrganizer({
              id: event.organizerId!,
              name: d.display_name,
              verified: d.is_verified ?? false,
              avatar: d.avatar,
              bio: d.bio,
              email: d.email,
              followerCount: d.followerCount ?? 0,
              totalEvents: d.totalEvents ?? 0,
              totalAttendees: d.totalAttendees ?? 0,
            });
          }
        })
        .catch(() => {});
    }

    // Fetch ticket sales count
    fetch(`/api/events/${event.id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        const ev = d?.event ?? d?.data ?? d;
        if (ev?.tickets_sold != null) setAttendeeCount(ev.tickets_sold);
      })
      .catch(() => {});

    // Check if event is saved/bookmarked
    fetch('/api/events/save')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.ok && Array.isArray(d.data)) {
          setIsSaved(d.data.some((e: any) => e.id === event.id || e.event_id === event.id));
        }
      })
      .catch(() => {});
  }, [event.id]);

  const toggleSave = async () => {
    setSaveLoading(true);
    try {
      const method = isSaved ? 'DELETE' : 'POST';
      const res = await fetch('/api/events/save', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId: event.id }),
      });
      if (res.status === 401) {
        window.location.href = '/login';
        return;
      }
      if (res.ok) {
        setIsSaved((prev) => !prev);
      }
    } catch (err) {
      console.error('Error toggling save:', err);
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6">
        <nav className="flex items-center gap-1.5 text-xs text-slate-400">
          <Link href="/" className="hover:text-slate-600 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/explore" className="hover:text-slate-600 transition-colors">Events</Link>
          <span>/</span>
          <span className="text-slate-500 truncate max-w-40">{event.title}</span>
        </nav>
      </div>

      {/* Hero */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 mb-12">
        <EventHero
          id={event.id}
          title={event.title}
          date={event.date}
          city={event.city}
          category={event.category}
          image={event.image}
          description={event.description}
          venue={event.venue}
          state={event.state}
          country={event.country}
          organizer={organizer ?? undefined}
          attendeeCount={attendeeCount}
          eventType={eventType}
          isSaved={isSaved}
          onSaveToggle={toggleSave}
        />
        <div className="mt-6">
          <SocialProofWidget eventId={event.id} />
        </div>
        <div className="mt-4">
          <SocialShareButtons
            eventId={event.id}
            eventTitle={event.title}
            eventUrl={`${typeof window !== "undefined" ? window.location.origin : ""}/events/${slugify(event.title)}`}
          />
        </div>
      </div>

      <RecentPurchasePopup eventId={event.id} />

      {/* Content Grid */}
      <div className="bg-[#f8fafc] py-12 sm:py-24">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Tabs */}
              <div className="bg-white rounded-2xl border border-slate-100 p-1.5 sm:p-2 shadow-sm">
                <div className="flex gap-1.5 sm:gap-2">
                  <button
                    onClick={() => setActiveTab("about")}
                    className={`flex-1 px-3 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                      activeTab === "about" ? "bg-lime text-dark shadow-sm" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    About
                  </button>
                  <button
                    onClick={() => setActiveTab("discussion")}
                    className={`flex-1 px-3 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                      activeTab === "discussion" ? "bg-lime text-dark shadow-sm" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    <span className="flex items-center justify-center gap-2">
                      {isEventPast ? "Memories" : "Discussion"}
                      {isEventPast && (
                        <span className="px-1.5 py-0.5 text-xs rounded-full bg-green-500/20 text-green-700">Active</span>
                      )}
                    </span>
                  </button>
                </div>
              </div>

              {activeTab === "about" ? (
                <>
                  <section
                    ref={aboutSection.ref}
                    className={`bg-white rounded-2xl border border-slate-100 p-4 sm:p-8 shadow-sm transition-all duration-500 ${
                      aboutSection.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 rounded-xl bg-lime/20 flex items-center justify-center">
                        <svg className="w-4 h-4 text-lime" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h2 className="text-xl font-bold text-slate-900">About this event</h2>
                    </div>
                    <p className="text-slate-500 leading-relaxed text-lg">{event.description}</p>

                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="font-bold text-slate-900 flex items-center gap-2">
                          <svg className="w-5 h-5 text-lime" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          What&apos;s included
                        </h3>
                        <ul className="space-y-2 text-slate-500">
                          <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-green-500 rounded-full" />Access to all sessions</li>
                          <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-green-500 rounded-full" />Networking opportunities</li>
                          <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-green-500 rounded-full" />Event materials</li>
                          {(eventType === "Virtual" || eventType === "Hybrid") && (
                            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-green-500 rounded-full" />Recording access (48 hours)</li>
                          )}
                        </ul>
                      </div>
                      <div className="space-y-4">
                        <h3 className="font-bold text-slate-900 flex items-center gap-2">
                          <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                          </svg>
                          Important info
                        </h3>
                        <ul className="space-y-2 text-slate-500">
                          <li>• Please arrive 15 minutes early</li>
                          <li>• Bring a valid ID for entry</li>
                          <li>• Photography may occur during event</li>
                          <li>• Refunds available up to 24 hours before</li>
                        </ul>
                      </div>
                    </div>
                  </section>

                  {/* Trust signals */}
                  <section className="bg-white rounded-2xl border border-slate-100 p-4 sm:p-8 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                      <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      Why trust this event?
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {[
                        { icon: "✓", bg: "bg-green-500/20", color: "text-green-600", title: "Verified Organizer", desc: "Identity confirmed by Guestly" },
                        { icon: "🔒", bg: "bg-lime/20", color: "text-lime", title: "Secure Payments", desc: "SSL encrypted transactions" },
                        { icon: "↩", bg: "bg-amber-500/20", color: "text-amber-600", title: "Refund Policy", desc: "Full refund up to 24h before" },
                      ].map((t) => (
                        <div key={t.title} className="text-center">
                          <div className={`w-12 h-12 ${t.bg} rounded-2xl flex items-center justify-center mx-auto mb-3`}>
                            <span className={`text-lg font-bold ${t.color}`}>{t.icon}</span>
                          </div>
                          <h4 className="font-bold text-slate-900 mb-1">{t.title}</h4>
                          <p className="text-sm text-slate-500">{t.desc}</p>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="bg-white rounded-2xl border border-slate-100 p-4 sm:p-8 shadow-sm">
                    <EventReviews eventId={event.id} />
                  </section>
                </>
              ) : (
                <div className="bg-white rounded-2xl border border-slate-100 p-4 sm:p-8 shadow-sm">
                  <DiscussionBoard eventId={event.id} eventDate={event.date} eventTitle={event.title} />
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Event details */}
              <div
                ref={detailsSection.ref}
                className={`bg-white rounded-2xl border border-slate-100 p-4 sm:p-6 shadow-sm transition-all duration-500 ${
                  detailsSection.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
              >
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Event Details</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-lime/20 flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4 text-lime" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{formattedDate}</p>
                      <p className="text-sm text-slate-500">
                        {new Date(event.date).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-green-500/20 flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path d="M12 21c-4-4-8-7.5-8-11a8 8 0 1 1 16 0c0 3.5-4 7-8 11z" /><circle cx="12" cy="10" r="3" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{event.city}</p>
                      <p className="text-sm text-slate-500">{eventType === "Virtual" ? "Online Event" : "In Person"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                    </div>
                    <div>
                      <Badge variant="primary" className="mb-1">{event.category}</Badge>
                      <p className="text-sm text-slate-500">Event Category</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Organizer details */}
              {organizer && (
                <div className="bg-white rounded-2xl border border-slate-100 p-4 sm:p-6 shadow-sm">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Organizer</h3>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-lime/20 flex items-center justify-center overflow-hidden shrink-0">
                      {organizer.avatar ? (
                        <img src={organizer.avatar} alt={organizer.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-lg font-bold text-lime">{organizer.name.charAt(0)}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="font-bold text-slate-900 truncate">{organizer.name}</p>
                        {organizer.verified && (
                          <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">Verified</span>
                        )}
                      </div>
                      {organizer.email && (
                        <p className="text-sm text-slate-500 truncate">{organizer.email}</p>
                      )}
                    </div>
                    <FollowButton
                      userId={organizer.id}
                      initialIsFollowing={false}
                      type="organizer"
                    />
                  </div>
                  {organizer.bio && (
                    <p className="text-sm text-slate-600 mb-4 line-clamp-3">{organizer.bio}</p>
                  )}
                  <div className="grid grid-cols-2 gap-3 text-sm pt-3 border-t border-slate-100">
                    {organizer.totalEvents != null && (
                      <div>
                        <p className="text-slate-400 text-xs">Events</p>
                        <p className="font-semibold text-slate-900">{organizer.totalEvents}</p>
                      </div>
                    )}
                    {organizer.totalAttendees != null && (
                      <div>
                        <p className="text-slate-400 text-xs">Total Attendees</p>
                        <p className="font-semibold text-slate-900">{organizer.totalAttendees.toLocaleString()}</p>
                      </div>
                    )}
                    {organizer.followerCount != null && (
                      <div>
                        <p className="text-slate-400 text-xs">Followers</p>
                        <p className="font-semibold text-slate-900">{organizer.followerCount.toLocaleString()}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div
                ref={actionsSection.ref}
                className={`space-y-3 transition-all duration-500 delay-200 ${
                  actionsSection.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
              >
                <Button
                  {...(isEventPast ? {} : { href: `/events/${event.id}/buy` })}
                  className={`w-full font-bold rounded-xl shadow-sm transition-all ${
                    isEventPast
                      ? "bg-slate-300 text-slate-500 cursor-default opacity-70"
                      : "bg-lime hover:bg-lime-hover text-dark hover:shadow-md"
                  }`}
                  size="lg"
                >
                  {isEventPast ? "Event Ended" : "Buy Tickets"}
                </Button>

                <Button href={`/events/${event.id}/community`} variant="outline" className="w-full font-bold rounded-xl" size="lg">
                  Join Discussion
                </Button>

                {(eventType === "Virtual" || eventType === "Hybrid") && (
                  <Button href={`/events/${event.id}/lobby`} variant="outline" className="w-full font-bold rounded-xl" size="lg">
                    Virtual Lobby
                  </Button>
                )}

                <Button
                  href={`/events/${event.id}/store`}
                  variant="outline"
                  className="w-full font-bold rounded-xl"
                  size="lg"
                  disabled={!loadingMerch && merchProductCount === 0}
                >
                  Event Merch
                  {!loadingMerch && merchProductCount > 0 && (
                    <span className="ml-2 text-xs text-slate-500">
                      {!isMerchAvailable ? "(Closed)" : `${merchProductCount} items`}
                    </span>
                  )}
                </Button>

                <Button
                  id="save-event-btn"
                  variant={isSaved ? "secondary" : "outline"}
                  className="w-full font-bold rounded-xl"
                  size="lg"
                  onClick={toggleSave}
                  loading={saveLoading}
                  disabled={saveLoading}
                >
                  {isSaved ? "Saved" : "Save Event"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
