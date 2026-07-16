"use client";

import React, { useEffect, useState } from "react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import SwipeableImageGallery from "@/components/ui/SwipeableImageGallery";

type Props = {
  id?: string;
  title: string;
  date: string;
  city: string;
  category: string;
  image: string;
  images?: Array<{
    src: string;
    alt: string;
    caption?: string;
  }>;
  description?: string;
  onAction?: () => void;
  onSaveToggle?: () => void;
  isSaved?: boolean;
  venue?: string;
  state?: string;
  country?: string;
  organizer?: {
    id?: string;
    name: string;
    verified?: boolean;
    avatar?: string;
  };
  attendeeCount?: number;
  eventType?: "Physical" | "Virtual" | "Hybrid";
};

export default function EventHero({
  id,
  title,
  date,
  city,
  category,
  image,
  images,
  description,
  onAction,
  onSaveToggle,
  isSaved = false,
  venue,
  state,
  country,
  organizer,
  attendeeCount,
  eventType = "Physical",
}: Props) {
  const [isVisible, setIsVisible] = useState(false);
  const [following, setFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const isPast = new Date(date) < new Date();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    if (!organizer?.id && !organizer?.name) return;
    const oid = organizer.id || `org-${organizer.name!.toLowerCase().replace(/\s+/g, "-")}`;
    fetch(`/api/follows/check?organizerId=${oid}`)
      .then(r => r.json())
      .then(d => { if (d.following !== undefined) setFollowing(d.following); })
      .catch((err) => console.error("Failed to check follow status:", err));
  }, [organizer?.id, organizer?.name]);

  const toggleFollow = async () => {
    if (!organizer?.id && !organizer?.name) return;
    setFollowLoading(true);
    const oid = organizer.id || `org-${organizer.name!.toLowerCase().replace(/\s+/g, "-")}`;
    try {
      const res = await fetch("/api/follows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ organizerId: oid, action: following ? "unfollow" : "follow" }),
      });
      const d = await res.json();
      if (d.following !== undefined) setFollowing(d.following);
    } catch {}
    finally { setFollowLoading(false); }
  };

  const formattedDate = new Date(date).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const formattedTime = new Date(date).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Prepare images for gallery
  const galleryImages = images && images.length > 0 ? images : [
    { src: image, alt: title, caption: title }
  ];

  return (
    <div className="relative overflow-hidden rounded-3xl bg-neutral-900 h-[70vh] min-h-[400px] sm:min-h-[500px] max-h-[700px]">
      {/* Background image gallery with swipe support */}
      <div className="absolute inset-0">
        <SwipeableImageGallery
          images={galleryImages}
          aspectRatio="wide"
          showDots={galleryImages.length > 1}
          showArrows={false} // Hide arrows on mobile for better touch experience
          autoPlay={galleryImages.length > 1}
          autoPlayInterval={6000}
          className="h-full"
        />
        {/* Multi-layer gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/95 via-neutral-900/60 to-neutral-900/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-900/80 via-transparent to-transparent" />
      </div>

      {/* Glass morphism content overlay */}
      <div className="absolute inset-0 flex flex-col justify-end overflow-y-auto">
        <div 
          className={`glass-dark rounded-t-3xl p-4 sm:p-8 lg:p-12 transition-all duration-[var(--duration-slow)] ${
            isVisible ? "animate-fade-in-up" : "opacity-0 translate-y-8"
          }`}
        >
            <div className="max-w-6xl">
            {/* Event type and category badges */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <Badge 
                variant="primary" 
                className="glass-light border-lime/30 text-lime font-semibold text-xs sm:text-sm"
              >
                {category}
              </Badge>
              <Badge 
                variant={eventType === "Virtual" ? "success" : eventType === "Hybrid" ? "warning" : "neutral"}
                className="glass-light border-white/20 text-white font-medium text-xs sm:text-sm"
              >
                {eventType} Event
              </Badge>
            </div>

            {/* Title with enhanced typography */}
            <h1 className="text-xl sm:text-3xl lg:text-5xl xl:text-6xl font-bold leading-tight tracking-tight text-white mb-3 sm:mb-6 max-w-4xl">
              {title}
            </h1>

            {/* Description */}
            {description && (
              <p className="text-xs sm:text-sm lg:text-lg leading-relaxed text-neutral-200 mb-3 sm:mb-8 max-w-2xl line-clamp-2 sm:line-clamp-3">
                {description}
              </p>
            )}

            {/* Event details grid */}
            <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 sm:mb-8">
              {/* Date & Time */}
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm">
                  <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <path d="M16 2v4M8 2v4M3 10h18" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-300">Date & Time</p>
                  <p className="text-white font-semibold">{formattedDate}</p>
                  <p className="text-neutral-300 text-sm">{formattedTime}</p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm">
                  <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path d="M12 21c-4-4-8-7.5-8-11a8 8 0 1 1 16 0c0 3.5-4 7-8 11z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-neutral-300">Location</p>
                  <p className="text-white font-semibold truncate">{venue || city}</p>
                  <p className="text-neutral-300 text-sm truncate">
                    {[city, state, country].filter(Boolean).join(", ")}
                  </p>
                  <p className="text-neutral-300 text-sm">{eventType === "Virtual" ? "Online Event" : "In Person"}</p>
                </div>
              </div>

              {/* Organizer with trust signal */}
              {organizer && (
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm overflow-hidden">
                    {organizer.avatar ? (
                      <img src={organizer.avatar} alt={organizer.name} className="w-full h-full object-cover" />
                    ) : (
                      <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-300">Organizer</p>
                    <div className="flex items-center gap-2">
                      <p className="text-white font-semibold">{organizer.name}</p>
                      {organizer.verified && (
                        <div className="flex items-center justify-center w-5 h-5 rounded-full bg-success-500">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <p className="text-neutral-300 text-sm">
                      {organizer.verified ? "Verified Organizer" : "Event Organizer"}
                    </p>
                  </div>
                </div>
              )}

              {/* Social proof */}
              {attendeeCount != null && attendeeCount > 0 && (
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm">
                    <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-300">Interest</p>
                    <p className="text-white font-semibold">{attendeeCount.toLocaleString()}</p>
                    <p className="text-neutral-300 text-sm">People interested</p>
                  </div>
                </div>
              )}
            </div>

            {/* CTA buttons with enhanced styling */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {isPast ? (
                <Button 
                  size="sm"
                  className="bg-slate-400 text-white font-semibold rounded-xl shadow-lg cursor-default opacity-70 sm:px-8 sm:py-4 sm:text-base sm:min-h-[56px]"
                  leftIcon={
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                    </svg>
                  }
                >
                  Event Ended
                </Button>
              ) : (
                <Button 
                  size="sm" 
                  href={`/events/${id}/buy`}
                  className="bg-lime hover:bg-lime-hover text-dark font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-[var(--duration-normal)] hover:scale-105 sm:px-8 sm:py-4 sm:text-base sm:min-h-[56px]"
                  leftIcon={
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                    </svg>
                  }
                >
                  Get Tickets
                </Button>
              )}
              
              <Button
                variant="outline"
                size="sm"
                onClick={onSaveToggle}
                className={`font-medium rounded-xl backdrop-blur-sm transition-all duration-[var(--duration-normal)] sm:px-8 sm:py-4 sm:text-base sm:min-h-[56px] ${
                  isSaved
                    ? "bg-lime/20 border-lime/30 text-lime"
                    : "glass-light border-white/30 text-white hover:bg-white/10"
                }`}
                leftIcon={
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill={isSaved ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                }
              >
                {isSaved ? "Saved" : "Save Event"}
              </Button>

              {organizer && (
                <button
                  onClick={toggleFollow}
                  disabled={followLoading}
                  className={`inline-flex items-center gap-1.5 sm:gap-2.5 rounded-xl border px-4 sm:px-8 py-2 sm:py-4 text-xs sm:text-base font-semibold transition-all min-h-[36px] sm:min-h-[56px] ${
                    following
                      ? "bg-lime/10 border-lime/20 text-lime hover:bg-lime/20"
                      : "bg-white/10 border-white/20 text-white hover:bg-white/20"
                  } disabled:opacity-50`}
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill={following ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="8.5" cy="7" r="4" /><path d="M20 8v6M23 11h-6" />
                  </svg>
                  {followLoading ? "..." : following ? "Following" : "Follow"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
