"use client";
import { Flame, Target, Users } from 'lucide-react';
import React from "react";
import Link from "next/link";
import EventCard from "@/components/events/EventCard";
import CommunityFilter from "@/components/events/CommunityFilter";
import CategoryDistribution from "@/components/events/CategoryDistribution";
import TimeFilter, { TimeFilterValue } from "@/components/events/TimeFilter";
import { Event } from "@/lib/events";
import EmptyState from "@/components/ui/EmptyState";
import Button from "@/components/ui/Button";
import { useScrollAnimation, useStaggeredAnimation } from "@/lib/hooks/useScrollAnimation";
import type { CityStats } from "@/lib/store";
import dynamic from "next/dynamic";
import type { City } from "@/features/geo/cities";

const EventHeatMap = dynamic(() => import("@/components/near/EventHeatMap"), { ssr: false });

interface CityPageProps {
  params: Promise<{ city: string }>;
}

export default function CityHubPage({ params }: CityPageProps) {
  const [cityName, setCityName] = React.useState<string>("");
  const [cityImage, setCityImage] = React.useState<string>("");
  const [events, setEvents] = React.useState<Event[]>([]);
  const [stats, setStats] = React.useState<CityStats | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
  const [selectedCommunity, setSelectedCommunity] = React.useState<string | undefined>(undefined);
  const [selectedCommunityType, setSelectedCommunityType] = React.useState<string | undefined>(undefined);
  const [timeFilter, setTimeFilter] = React.useState<TimeFilterValue>("all");
  const [startDate, setStartDate] = React.useState<Date | null>(null);
  const [endDate, setEndDate] = React.useState<Date | null>(null);
  const [showHeatMap, setShowHeatMap] = React.useState(true);
  const [selectedNeighborhood, setSelectedNeighborhood] = React.useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  // Animation hooks
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();
  const { ref: statsRef, isVisible: statsVisible } = useScrollAnimation();
  const { ref: eventsGridRef, visibleItems: eventsVisible } = useStaggeredAnimation(events.length);

  React.useEffect(() => {
    async function loadData() {
      try {
        const resolvedParams = await params;
        const decodedCity = decodeURIComponent(resolvedParams.city);
        const cityNameFormatted = decodedCity.charAt(0).toUpperCase() + decodedCity.slice(1);
        setCityName(cityNameFormatted);

        // Set default fallback image
        const fallbackImage = `/cities/${decodedCity.toLowerCase()}.png`;
        setCityImage(fallbackImage);

        // Fetch city details from catalog to get the image
        try {
          const catalogResponse = await fetch('/api/platform/catalog');
          if (catalogResponse.ok) {
            const catalogData = await catalogResponse.json();
            const cityData = catalogData.cities?.find(
              (c: any) => c.name.toLowerCase() === decodedCity.toLowerCase() || c.slug.toLowerCase() === decodedCity.toLowerCase()
            );
            if (cityData?.image) {
              setCityImage(cityData.image);
            }
          }
        } catch (error) {
          console.error("Error fetching city catalog:", error);
          // Fallback image already set above
        }

        // Fetch city statistics
        const statsResponse = await fetch(`/api/cities/${encodeURIComponent(decodedCity.toLowerCase())}/stats`);
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          const raw = statsData.data || {};
          setStats({
            city: raw.city ?? raw.name ?? decodedCity,
            totalEvents: raw.totalEvents ?? raw.total_events ?? 0,
            upcomingEvents: raw.upcomingEvents ?? raw.upcoming_events ?? 0,
            totalAttendees: raw.totalAttendees ?? raw.total_attendees ?? 0,
            popularCategories: raw.popularCategories ?? raw.popular_categories ?? [],
            trendingEvents: raw.trendingEvents ?? raw.trending_events ?? [],
          });
        }

        // Fetch city events
        const eventsParams = new URLSearchParams();
        if (selectedCategory) eventsParams.set("category", selectedCategory);
        if (selectedCommunity) eventsParams.set("community", selectedCommunity);
        if (selectedCommunityType) eventsParams.set("communityType", selectedCommunityType);
        if (startDate) eventsParams.set("startDate", startDate.toISOString());
        if (endDate) eventsParams.set("endDate", endDate.toISOString());
        
        const eventsResponse = await fetch(
          `/api/cities/${encodeURIComponent(decodedCity)}/events${
            eventsParams.toString() ? `?${eventsParams.toString()}` : ""
          }`
        );
        if (eventsResponse.ok) {
          const eventsData = await eventsResponse.json();
          setEvents(eventsData.data);
        }
      } catch (error) {
        console.error("Error loading city data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [params, selectedCategory, selectedCommunity, selectedCommunityType, startDate, endDate]);

  // Real-time updates: Poll for trending events every 30 seconds
  React.useEffect(() => {
    if (!cityName) return;

    const interval = setInterval(async () => {
      try {
        setIsRefreshing(true);
        const statsResponse = await fetch(`/api/cities/${encodeURIComponent(cityName.toLowerCase())}/stats`);
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          const raw = statsData.data || {};
          setStats({
            city: raw.city ?? raw.name ?? cityName,
            totalEvents: raw.totalEvents ?? raw.total_events ?? 0,
            upcomingEvents: raw.upcomingEvents ?? raw.upcoming_events ?? 0,
            totalAttendees: raw.totalAttendees ?? raw.total_attendees ?? 0,
            popularCategories: raw.popularCategories ?? raw.popular_categories ?? [],
            trendingEvents: raw.trendingEvents ?? raw.trending_events ?? [],
          });
        }
      } catch (error) {
        console.error("Error refreshing city stats:", error);
      } finally {
        setIsRefreshing(false);
      }
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [cityName]);

  // City-specific branding colors
  const cityColors: Record<string, { primary: string; gradient: string; accent: string }> = {
    Lagos: {
      primary: "from-navy-700 via-navy-700/95 to-lime",
      gradient: "bg-gradient-to-br from-navy-700 via-navy-700/95 to-lime",
      accent: "text-lime",
    },
    Abuja: {
      primary: "from-navy-700 via-navy-700/95 to-green-600",
      gradient: "bg-gradient-to-br from-navy-700 via-navy-700/95 to-green-600",
      accent: "text-green-500",
    },
    Accra: {
      primary: "from-navy-700 via-navy-700/95 to-amber-600",
      gradient: "bg-gradient-to-br from-navy-700 via-navy-700/95 to-amber-600",
      accent: "text-amber-500",
    },
    Nairobi: {
      primary: "from-navy-700 via-navy-700/95 to-rose-600",
      gradient: "bg-gradient-to-br from-navy-700 via-navy-700/95 to-rose-600",
      accent: "text-rose-500",
    },
  };

  const cityBranding = cityColors[cityName] || cityColors.Lagos;

  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="animate-pulse">
          <div className="mb-8 h-48 rounded-2xl bg-slate-200"></div>
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="h-24 rounded-2xl bg-slate-200"></div>
            <div className="h-24 rounded-2xl bg-slate-200"></div>
            <div className="h-24 rounded-2xl bg-slate-200"></div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 rounded-2xl bg-slate-200"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-24 space-y-8 sm:space-y-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-400">
        <Link href="/" className="hover:text-slate-600 transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/explore" className="hover:text-slate-600 transition-colors">
          Explore
        </Link>
        <span>/</span>
        <span className="text-slate-600">{cityName}</span>
      </nav>

      {/* City Hero Section */}
      <div
        ref={headerRef}
        className="mb-8 overflow-hidden rounded-2xl relative min-h-[400px]"
      >
        {/* Background Image */}
        {cityImage ? (
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ 
              backgroundImage: `url(${cityImage})`,
            }}
          />
        ) : (
          <div className="absolute inset-0 bg-dark" />
        )}
        
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-[#001C24]/80" />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-dark/50 via-dark/70 to-dark" />
        
        {/* Decorative gradient orbs */}
        <div className="absolute top-0 right-0 h-72 w-72 bg-lime/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 h-64 w-64 bg-lime/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />
        
        {/* Content */}
        <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between p-6 sm:p-8 z-10">
          <div>
            <h1 className="mb-2 text-3xl font-bold tracking-tight sm:text-4xl text-white">
              Events in {cityName}
            </h1>
            <p className="text-base sm:text-lg text-white/80">
              Discover amazing events happening in your city
            </p>
          </div>
          {stats && (
            <div className="flex gap-3 sm:gap-4">
              <div className="rounded-lg px-4 py-3 backdrop-blur-sm border bg-white/15 border-white/10">
                <div className="text-2xl font-bold text-lime">{stats.upcomingEvents}</div>
                <div className="text-xs sm:text-sm text-white/70">Upcoming</div>
              </div>
              <div className="rounded-lg px-4 py-3 backdrop-blur-sm border bg-white/15 border-white/10">
                <div className="text-2xl font-bold text-lime">{stats.totalEvents}</div>
                <div className="text-xs sm:text-sm text-white/70">Total Events</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* City Statistics */}
      {stats && typeof stats.totalAttendees === "number" && (
        <div className="mb-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-100 bg-white p-4 sm:p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
              <div className="mb-2 flex items-center gap-2">
                <div className={`text-2xl ${cityBranding.accent}`}><Users className="h-4 w-4 inline-block" /></div>
                <h3 className="text-sm font-medium text-slate-500">Total Attendees</h3>
              </div>
              <div className="text-3xl font-bold text-slate-900">
                {stats.totalAttendees.toLocaleString()}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-4 sm:p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
              <div className="mb-2 flex items-center gap-2">
                <div className={`text-2xl ${cityBranding.accent}`}><Target className="h-4 w-4 inline-block" /></div>
                <h3 className="text-sm font-medium text-slate-500">Top Category</h3>
              </div>
              <div className="text-2xl font-bold text-slate-900">
                {(stats.popularCategories ?? [])[0]?.category || "N/A"}
              </div>
              <div className="mt-1 text-sm text-slate-500">
                {(stats.popularCategories ?? [])[0]?.count || 0} events
              </div>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-4 sm:p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
              <div className="mb-2 flex items-center gap-2">
                <div className={`text-2xl ${cityBranding.accent}`}><Flame className="h-4 w-4 inline-block" /></div>
                <h3 className="text-sm font-medium text-slate-500">Trending Events</h3>
              </div>
              <div className="text-3xl font-bold text-slate-900">
                {(stats.trendingEvents ?? []).length}
              </div>
              <div className="mt-1 text-sm text-slate-500">Hot right now</div>
            </div>
          </div>
        </div>
      )}

      {/* Category Distribution */}
      {stats && (stats.popularCategories ?? []).length > 0 && (
        <CategoryDistribution
          categories={stats.popularCategories}
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
          cityBranding={cityBranding}
        />
      )}

      {/* Community Filter */}
      <div className="mb-8">
        <CommunityFilter
          city={cityName}
          selectedCommunity={selectedCommunity}
          selectedCommunityType={selectedCommunityType}
          onCommunityChange={setSelectedCommunity}
          onCommunityTypeChange={setSelectedCommunityType}
        />
      </div>

      {/* Time Filter */}
      <div className="mb-8">
          <div className="bg-white rounded-2xl border border-slate-100 p-4 sm:p-6 shadow-sm">
            <TimeFilter
            value={timeFilter}
            startDate={startDate}
            endDate={endDate}
            onChange={(value, start, end) => {
              setTimeFilter(value);
              setStartDate(start || null);
              setEndDate(end || null);
            }}
          />
        </div>
      </div>

      {/* Heat Map Section */}
      {events.length > 0 && (
        <div className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Event Hot Spots</h2>
              <p className="text-sm text-slate-600">
                Discover where events are happening across {cityName}
              </p>
            </div>
            <button
              onClick={() => setShowHeatMap(!showHeatMap)}
              className="rounded-xl border border-slate-100 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-all hover:bg-slate-50"
            >
              {showHeatMap ? "Hide Map" : "Show Map"}
            </button>
          </div>
          {showHeatMap && (
            <EventHeatMap
              events={events}
                city={(cityName.charAt(0).toUpperCase() + cityName.slice(1)) as City}
              onNeighborhoodClick={(neighborhood) => {
                setSelectedNeighborhood(neighborhood);
                // Scroll to events section
                document.getElementById("events-section")?.scrollIntoView({ behavior: "smooth" });
              }}
            />
          )}
        </div>
      )}

      {/* Trending Events Section */}
      {stats && stats.trendingEvents.length > 0 && !selectedCategory && !selectedCommunity && !selectedNeighborhood && (
        <div className="mb-12">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 flex items-center gap-2">
                <Flame className="h-6 w-6 text-slate-900" />
                Trending in {cityName}
                {isRefreshing && (
                  <span className="ml-2 inline-flex h-4 w-4 animate-spin rounded-full border-2 border-lime border-t-transparent"></span>
                )}
              </h2>
              <p className="text-lg leading-relaxed text-slate-500 mt-2">
                Hot events based on views, saves, and recent ticket sales • Updates every 30s
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.trendingEvents.slice(0, 3).map((eventId) => {
              const event = events.find((e) => e.id === eventId);
              if (!event) return null;
              return (
                <EventCard
                  key={event.id}
                  id={event.id}
                  title={event.title}
                  description={event.description}
                  date={event.date}
                  city={event.city}
                  category={event.category}
                  image={event.image}
                  isTrending={true}
                />
              );
            })}
          </div>
          <div className="mt-6 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
        </div>
      )}

      {/* Events Grid */}
      <div id="events-section">
        {selectedNeighborhood && (
          <div className="mb-4 flex items-center gap-2">
            <span className="text-sm text-slate-600">
              Showing events in <strong>{selectedNeighborhood}</strong>
            </span>
            <button
              onClick={() => setSelectedNeighborhood(null)}
              className="text-sm text-lime hover:text-lime-hover font-medium"
            >
              Clear
            </button>
          </div>
        )}
        {!selectedCategory && !selectedCommunity && !selectedNeighborhood && (
          <h2 className="mb-6 text-3xl sm:text-4xl font-black tracking-tight text-slate-900">All Events</h2>
        )}
        {events.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <EmptyState
              title="No events found"
              description={
                selectedCategory
                  ? `There are no ${selectedCategory} events in ${cityName} right now.`
                  : `There are no events listed in ${cityName} right now.`
              }
            />
            <div className="mt-4 flex gap-2">
              {selectedCategory && (
                <Button onClick={() => setSelectedCategory(null)} variant="outline">
                  Clear Filter
                </Button>
              )}
              <Button href="/explore" variant="primary">
                Explore All Events
              </Button>
            </div>
          </div>
        ) : (
          <div ref={eventsGridRef} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {events.map((event, index) => (
              <div key={event.id}>
                <EventCard
                  id={event.id}
                  title={event.title}
                  description={event.description}
                  date={event.date}
                  city={event.city}
                  category={event.category}
                  image={event.image}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* City-specific CTA */}
      <section className="mt-8 sm:mt-12 rounded-2xl bg-dark relative overflow-hidden py-14 px-6 sm:py-20 sm:px-12 text-center">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 h-72 w-72 bg-lime/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 h-64 w-64 bg-lime/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />
        </div>
        <div className="relative max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
            Love events in {cityName}?
          </h2>
          <p className="mt-4 text-lg text-white/60">
            Get notified when new events drop, grab early-bird tickets, and never miss what matters in your city.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button variant="primary" href="/register">
              Create Free Account
            </Button>
            <Button variant="white" href="/explore">
              Browse Events
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
