"use client";

import React from "react";
import EventHero from "@/components/events/EventHero";
import DiscussionBoard from "@/components/events/DiscussionBoard";
import { getEventById } from "@/lib/events";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { useScrollAnimation } from "@/lib/hooks/useScrollAnimation";
import { SocialProofWidget } from "@/components/events/SocialProofWidget";
import { RecentPurchasePopup } from "@/components/events/RecentPurchasePopup";
import { SocialShareButtons } from "@/components/events/SocialShareButtons";
import { EventReviews } from "@/components/events/EventReviews";

interface EventDetailClientProps {
  event: NonNullable<ReturnType<typeof getEventById>>;
}

export default function EventDetailClient({ event }: EventDetailClientProps) {
  const aboutSection = useScrollAnimation({ threshold: 0.2 });
  const detailsSection = useScrollAnimation({ threshold: 0.2 });
  const actionsSection = useScrollAnimation({ threshold: 0.2 });

  const [merchProductCount, setMerchProductCount] = React.useState(0);
  const [loadingMerch, setLoadingMerch] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState<"about" | "discussion">("about");

  const formattedDate = new Date(event.date).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Check if event has passed
  const isEventPast = new Date(event.date) < new Date();
  const isMerchAvailable = !isEventPast || event.postEventMerchSales;

  // Fetch merchandise count
  React.useEffect(() => {
    async function loadMerch() {
      try {
        const res = await fetch(`/api/merch?eventId=${event.id}`);
        if (res.ok) {
          const data = await res.json();
          setMerchProductCount(data.products?.length || 0);
        }
      } catch (error) {
        console.error("Failed to load merchandise:", error);
      } finally {
        setLoadingMerch(false);
      }
    }
    loadMerch();
  }, [event.id]);

  // Mock data for enhanced features
  const mockOrganizer = {
    name: "EventCorp Ltd",
    verified: true,
  };

  const mockAttendeeCount = Math.floor(Math.random() * 500) + 50;
  const mockEventType = event.category === "Tech" ? "Hybrid" : event.category === "Music" ? "Physical" : "Virtual";

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <nav className="flex items-center gap-1.5 text-xs text-slate-400">
          <Link href="/" className="hover:text-slate-600 transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/explore" className="hover:text-slate-600 transition-colors">
            Events
          </Link>
          <span>/</span>
          <span className="text-slate-500 truncate max-w-40">{event.title}</span>
        </nav>
      </div>

      {/* Enhanced Hero */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <EventHero
          id={event.id}
          title={event.title}
          date={event.date}
          city={event.city}
          category={event.category}
          image={event.image}
          description={event.description}
          organizer={mockOrganizer}
          attendeeCount={mockAttendeeCount}
          eventType={mockEventType as "Physical" | "Virtual" | "Hybrid"}
        />
        
        {/* Social Proof Widget */}
        <div className="mt-6">
          <SocialProofWidget eventId={event.id} />
        </div>
        
        {/* Social Share Buttons */}
        <div className="mt-4">
          <SocialShareButtons 
            eventId={event.id}
            eventTitle={event.title}
            eventUrl={typeof window !== 'undefined' ? window.location.href : ''}
          />
        </div>
      </div>
      
      {/* Recent Purchase Popup */}
      <RecentPurchasePopup eventId={event.id} />

      {/* Content Grid */}
      <div className="bg-[#f8fafc] py-12 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Tabs */}
              <div className="bg-white rounded-2xl border border-slate-100 p-1.5 sm:p-2 shadow-sm">
                <div className="flex gap-1.5 sm:gap-2">
                  <button
                    onClick={() => setActiveTab("about")}
                    className={`flex-1 px-3 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                      activeTab === "about"
                        ? "bg-lime text-dark shadow-sm"
                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    About
                  </button>
                  <button
                    onClick={() => setActiveTab("discussion")}
                    className={`flex-1 px-3 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                      activeTab === "discussion"
                        ? "bg-lime text-dark shadow-sm"
                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    <span className="flex items-center justify-center gap-2">
                      {isEventPast ? "Memories" : "Discussion"}
                      {isEventPast && (
                        <span className="px-1.5 py-0.5 text-xs rounded-full bg-green-500/20 text-green-700">
                          Active
                        </span>
                      )}
                    </span>
                  </button>
                </div>
              </div>

              {/* Tab content */}
              {activeTab === "about" ? (
                <>
                  {/* About section */}
                  <section
                    ref={aboutSection.ref}
                    className={`bg-white rounded-2xl border border-slate-100 p-4 sm:p-8 shadow-sm transition-all duration-[var(--duration-slow)] ${
                      aboutSection.isVisible 
                        ? "animate-fade-in-up opacity-100" 
                        : "opacity-0 translate-y-8"
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
                    
                    <div className="max-w-none">
                      <p className="text-slate-500 leading-relaxed text-lg">
                        {event.description}
                      </p>
                      
                      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h3 className="font-bold text-slate-900 flex items-center gap-2">
                            <svg className="w-5 h-5 text-lime" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            What's included
                          </h3>
                          <ul className="space-y-2 text-slate-500">
                            <li className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                              Access to all sessions
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                              Networking opportunities
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                              Event materials
                            </li>
                            {mockEventType === "Virtual" || mockEventType === "Hybrid" ? (
                              <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                Recording access (48 hours)
                              </li>
                            ) : null}
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
                    </div>
                  </section>

                  {/* Trust signals section */}
                  <section
                    className={`bg-white rounded-2xl border border-slate-100 p-4 sm:p-8 shadow-sm transition-all duration-[var(--duration-slow)] delay-200 ${
                      aboutSection.isVisible 
                        ? "animate-fade-in-up opacity-100" 
                        : "opacity-0 translate-y-8"
                    }`}
                  >
                    <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                      <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      Why trust this event?
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                          <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <h4 className="font-bold text-slate-900 mb-1">Verified Organizer</h4>
                        <p className="text-sm text-slate-500">Identity confirmed by Guestly</p>
                      </div>
                      
                      <div className="text-center">
                    <div className="w-12 h-12 bg-lime/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-lime" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <h4 className="font-bold text-slate-900 mb-1">Secure Payments</h4>
                    <p className="text-sm text-slate-500">SSL encrypted transactions</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-amber-500/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h4 className="font-bold text-slate-900 mb-1">Refund Policy</h4>
                    <p className="text-sm text-slate-500">Full refund up to 24h before</p>
                  </div>
                </div>
              </section>
              
              {/* Event Reviews Section */}
              <section
                className={`bg-white rounded-2xl border border-slate-100 p-4 sm:p-8 shadow-sm transition-all duration-[var(--duration-slow)] delay-300 ${
                  aboutSection.isVisible 
                    ? "animate-fade-in-up opacity-100" 
                    : "opacity-0 translate-y-8"
                }`}
              >
                <EventReviews eventId={event.id} />
              </section>
            </>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-100 p-4 sm:p-8 shadow-sm">
              <DiscussionBoard 
                eventId={event.id} 
                eventDate={event.date}
                eventTitle={event.title}
              />
            </div>
          )}
        </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Event details card */}
              <div
                ref={detailsSection.ref}
                className={`bg-white rounded-2xl border border-slate-100 p-4 sm:p-6 shadow-sm transition-all duration-[var(--duration-slow)] ${
                  detailsSection.isVisible 
                    ? "animate-fade-in-up opacity-100" 
                    : "opacity-0 translate-y-8"
                }`}
              >
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Event Details
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-lime/20 flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4 text-lime" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <rect x="3" y="4" width="18" height="18" rx="2" />
                        <path d="M16 2v4M8 2v4M3 10h18" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{formattedDate}</p>
                      <p className="text-sm text-slate-500">
                        {new Date(event.date).toLocaleTimeString("en-GB", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-green-500/20 flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path d="M12 21c-4-4-8-7.5-8-11a8 8 0 1 1 16 0c0 3.5-4 7-8 11z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{event.city}</p>
                      <p className="text-sm text-slate-500">
                        {mockEventType === "Virtual" ? "Online Event" : "In Person"}
                      </p>
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

              {/* Action buttons */}
              <div
                ref={actionsSection.ref}
                className={`space-y-3 transition-all duration-[var(--duration-slow)] delay-200 ${
                  actionsSection.isVisible 
                    ? "animate-fade-in-up opacity-100" 
                    : "opacity-0 translate-y-8"
                }`}
              >
                <Button
                  href={`/events/${event.id}/buy`}
                  className="w-full bg-lime hover:bg-lime-hover text-dark font-bold rounded-xl shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 active:translate-y-0"
                  size="lg"
                  leftIcon={
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                    </svg>
                  }
                >
                  Buy Tickets
                </Button>
                
                <Button 
                  href={`/events/${event.id}/community`} 
                  variant="outline" 
                  className="w-full border-slate-200 hover:bg-slate-50 font-bold py-4 rounded-xl transition-all" 
                  size="lg"
                  leftIcon={
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path d="M7 8h10M7 12h6M21 15a4 4 0 01-4 4H7l-4 4V7a4 4 0 014-4h10a4 4 0 014 4v8z" />
                    </svg>
                  }
                >
                  Join Discussion
                </Button>
                
                {(mockEventType === "Virtual" || mockEventType === "Hybrid") && (
                  <Button
                    href={`/events/${event.id}/lobby`}
                    variant="outline"
                    className="w-full border-slate-200 hover:bg-slate-50 font-bold rounded-xl transition-all"
                    size="lg"
                    leftIcon={
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    }
                  >
                    Virtual Lobby
                  </Button>
                )}
                
                <Button
                  href={`/events/${event.id}/store`}
                  variant="outline"
                  className="w-full border-slate-200 hover:bg-slate-50 font-bold rounded-xl transition-all"
                  size="lg"
                  disabled={!loadingMerch && merchProductCount === 0}
                  leftIcon={
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  }
                  rightIcon={!loadingMerch && merchProductCount > 0 ? (
                    <span className="flex items-center gap-1.5 text-xs">
                      {!isMerchAvailable && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-semibold">
                          Closed
                        </span>
                      )}
                      {isMerchAvailable && isEventPast && event.postEventMerchSales && (
                        <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-semibold">
                          Available
                        </span>
                      )}
                      <span className="text-slate-500 font-normal">
                        {merchProductCount} {merchProductCount === 1 ? 'item' : 'items'}
                      </span>
                    </span>
                  ) : undefined}
                >
                  Event Merch
                </Button>
                
                <form action="/api/events/save" method="POST">
                  <input type="hidden" name="eventId" value={event.id} />
                  <Button 
                    type="submit" 
                    variant="outline" 
                    className="w-full border-slate-200 hover:bg-slate-50 font-bold py-4 rounded-xl transition-all"
                    size="lg"
                    leftIcon={
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    }
                  >
                    Save Event
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}