"use client";
import { Briefcase, Building2, GraduationCap, MapPin, PartyPopper, Search, Theater } from 'lucide-react';
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import EventCard from "@/components/events/EventCard";
import type { Event } from "@/lib/events";

export default function CommunityPage() {
  const params = useParams();
  const community = decodeURIComponent(params.community as string);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCommunityEvents() {
      try {
        setLoading(true);
        const res = await fetch(
          `/api/communities/${encodeURIComponent(community)}/events`
        );
        const json = await res.json();
        if (json.success) {
          setEvents(json.data);
        }
      } catch (error) {
        console.error("Error fetching community events:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCommunityEvents();
  }, [community]);

  // Get community type icon
  const getCommunityTypeInfo = () => {
    if (events.length === 0) return { type: "Community" as const };
    const firstEvent = events[0];
    const typeMap: Record<string, { type: string }> = {
      campus: { type: "Campus" },
      neighborhood: { type: "Neighborhood" },
      professional: { type: "Professional Community" },
      cultural: { type: "Cultural Community" },
    };
    return firstEvent.communityType
      ? typeMap[firstEvent.communityType] || { type: "Community" }
      : { type: "Community" };
  };

  const communityInfo = getCommunityTypeInfo();

  const getCommunityIcon = (communityType?: string) => {
    switch (communityType) {
      case "campus": return <GraduationCap className="h-8 w-8" />;
      case "neighborhood": return <Building2 className="h-8 w-8" />;
      case "professional": return <Briefcase className="h-8 w-8" />;
      case "cultural": return <Theater className="h-8 w-8" />;
      default: return <MapPin className="h-8 w-8" />;
    }
  };

  return (
    <div className="bg-[#f8fafc]">
      {/* Hero Section */}
      <div className="bg-white border-b border-slate-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-24">
          <div className="max-w-4xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="text-slate-900">
                {getCommunityIcon(events[0]?.communityType)}
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                  {communityInfo.type}
                </p>
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">{community}</h1>
              </div>
            </div>
            <p className="text-lg leading-relaxed text-slate-500 mt-4">
              Discover events happening in {community}
            </p>
            {events.length > 0 && (
              <div className="flex items-center gap-6 mt-6 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <PartyPopper className="h-4 w-4 text-slate-400" />
                  <span>
                    <strong className="text-slate-900">{events.length}</strong> {events.length === 1 ? "Event" : "Events"}
                  </span>
                </div>
                {events[0].city && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-slate-400" />
                    <span>{events[0].city}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Events Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-24">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-96 animate-pulse rounded-2xl bg-slate-200 border border-slate-100"
              />
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-16">
            <div className="mb-4 flex justify-center text-slate-300"><Search className="h-12 w-12" /></div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              No Events Found
            </h2>
            <p className="text-slate-500">
              There are currently no events in {community}.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-12">
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 mb-2">
                Upcoming Events
              </h2>
              <p className="text-lg leading-relaxed text-slate-500">
                {events.length} {events.length === 1 ? "event" : "events"} in {community}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <EventCard
                  key={event.id}
                  id={event.id}
                  title={event.title}
                  description={event.description}
                  date={event.date}
                  city={event.city}
                  category={event.category}
                  image={event.image}
                  eventType={event.eventType?.toLowerCase() as "physical" | "virtual" | "hybrid"}
                  community={event.community}
                  communityType={event.communityType}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
