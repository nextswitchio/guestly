"use client";
import { Clipboard, Map } from 'lucide-react';
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import EventCard from "@/components/events/EventCard";
import EventMap from "@/components/near/EventMap";
import PullToRefresh from "@/components/ui/PullToRefresh";
import Icon from '@/components/ui/Icon';
import { nearestCity, CITY_COORDS, distanceKm as calculateDistance, type City } from "@/features/geo/cities";
import type { Event } from "@/lib/events";
import { useScrollAnimation, useStaggeredAnimation } from "@/lib/hooks/useScrollAnimation";

type UserLocation = {
  latitude: number;
  longitude: number;
  timestamp: number;
};

type PermissionState = 'prompt' | 'granted' | 'denied' | 'unsupported';

type EventWithDistance = Event & {
  distanceKm: number;
};

type Result = {
  city: City | null;
  distanceKm?: number;
  events: EventWithDistance[];
  loading: boolean;
  error?: string;
};

export default function NearMePage() {
  const router = useRouter();
  const [res, setRes] = React.useState<Result>({ city: null, events: [], loading: false });
  const [manualCity, setManualCity] = React.useState<City | "">("");
  const [userLocation, setUserLocation] = React.useState<UserLocation | null>(null);
  const [permissionState, setPermissionState] = React.useState<PermissionState>('prompt');
  const [viewMode, setViewMode] = React.useState<'map' | 'grid'>('map');
  const [distanceUnit, setDistanceUnit] = React.useState<'km' | 'miles'>('km');

  // Animation hooks
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();
  const { ref: controlsRef, isVisible: controlsVisible } = useScrollAnimation();
  const { ref: emptyStateRef, isVisible: emptyStateVisible } = useScrollAnimation();
  const { ref: eventsGridRef, visibleItems: eventsVisible } = useStaggeredAnimation(res.events.length);
  const { ref: mapRef, isVisible: mapVisible } = useScrollAnimation();

  // Detect user's locale and set distance unit
  React.useEffect(() => {
    const locale = navigator.language || 'en-US';
    // US, UK (partially), Liberia, and Myanmar use miles
    const useMiles = locale.startsWith('en-US') || locale.startsWith('en-LR') || locale.startsWith('my');
    setDistanceUnit(useMiles ? 'miles' : 'km');
  }, []);

  // Check permission status on mount
  React.useEffect(() => {
    if (!("geolocation" in navigator)) {
      setPermissionState('unsupported');
      return;
    }

    // Check if Permissions API is available
    if ("permissions" in navigator) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        setPermissionState(result.state as PermissionState);
        
        // Listen for permission changes
        result.addEventListener('change', () => {
          setPermissionState(result.state as PermissionState);
        });
      }).catch(() => {
        // Permissions API not fully supported, stay in prompt state
        setPermissionState('prompt');
      });
    }
  }, []);

  // Load saved location on mount
  React.useEffect(() => {
    const savedLocation = localStorage.getItem("near:location");
    const savedCity = localStorage.getItem("near:city") as City | null;
    
    if (savedLocation) {
      try {
        const location: UserLocation = JSON.parse(savedLocation);
        // Check if location is less than 1 hour old
        if (Date.now() - location.timestamp < 3600000) {
          setUserLocation(location);
          if (savedCity && (savedCity in CITY_COORDS)) {
            loadCity(savedCity, undefined, location.latitude, location.longitude);
          }
        } else {
          // Clear stale location
          localStorage.removeItem("near:location");
          localStorage.removeItem("near:city");
        }
      } catch {
        // Invalid stored data
        localStorage.removeItem("near:location");
      }
    }
  }, []);

  async function loadCity(city: City, distanceKm?: number, userLat?: number, userLon?: number) {
    setRes((r) => ({ ...r, loading: true, error: undefined }));
    try {
      const r = await fetch(`/api/events?city=${encodeURIComponent(city)}&pageSize=12`);
      const d = await r.json();
      const events: Event[] = d?.data || d?.events || [];
      
      // Calculate distance for each event and sort by distance
      let eventsWithDistance: EventWithDistance[];
      
      if (userLat !== undefined && userLon !== undefined) {
        // Calculate distance from user location to each event's city
        eventsWithDistance = events.map(event => {
          const eventCityCoords = CITY_COORDS[event.city];
          const distance = calculateDistance({ lat: userLat, lon: userLon }, eventCityCoords);
          return {
            ...event,
            distanceKm: distance
          };
        });
        
        // Sort events by distance (nearest first)
        eventsWithDistance.sort((a, b) => a.distanceKm - b.distanceKm);
      } else {
        // No user location, use city center distance or set to 0
        eventsWithDistance = events.map(event => ({
          ...event,
          distanceKm: 0
        }));
      }
      
      setRes({ city, distanceKm, events: eventsWithDistance, loading: false });
    } catch {
      setRes({ city, distanceKm, events: [], loading: false, error: "Failed to load events" });
    }
  }

  // Pull to refresh handler
  const handleRefresh = React.useCallback(async () => {
    if (res.city && userLocation) {
      await loadCity(res.city, res.distanceKm, userLocation.latitude, userLocation.longitude);
    } else if (res.city) {
      await loadCity(res.city);
    }
  }, [res.city, res.distanceKm, userLocation]);

  function detect() {
    if (!("geolocation" in navigator)) {
      setPermissionState('unsupported');
      setRes({ city: null, events: [], loading: false, error: "Geolocation is not supported by your browser" });
      return;
    }
    
    setRes((r) => ({ ...r, loading: true, error: undefined }));
    
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const location: UserLocation = {
          latitude,
          longitude,
          timestamp: Date.now()
        };
        
        // Store user location in state
        setUserLocation(location);
        
        // Save to localStorage for future visits
        localStorage.setItem("near:location", JSON.stringify(location));
        
        // Find nearest city
        const near = nearestCity(latitude, longitude);
        localStorage.setItem("near:city", near.city);
        
        // Update permission state
        setPermissionState('granted');
        
        // Load events for the nearest city with user location for distance calculation
        loadCity(near.city, near.distanceKm, latitude, longitude);
      },
      (err) => {
        // Handle different error codes
        let errorMessage = "Unable to get your location";
        
        if (err.code === err.PERMISSION_DENIED) {
          setPermissionState('denied');
          errorMessage = "Location permission denied. Please enable location access in your browser settings or select a city manually.";
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          errorMessage = "Location information is unavailable. Please try again or select a city manually.";
        } else if (err.code === err.TIMEOUT) {
          errorMessage = "Location request timed out. Please try again or select a city manually.";
        }
        
        setRes({ city: null, events: [], loading: false, error: errorMessage });
      },
      { 
        enableHighAccuracy: false, 
        maximumAge: 300000, // 5 minutes
        timeout: 10000 // 10 seconds
      }
    );
  }

  function handleEventClick(eventId: string) {
    router.push(`/events/${eventId}`);
  }

  // Helper function to format distance based on unit preference
  function formatDistance(km: number): string {
    if (distanceUnit === 'miles') {
      const miles = km * 0.621371;
      return `${miles.toFixed(1)} mi`;
    }
    return `${km.toFixed(1)} km`;
  }

  return (
    <PullToRefresh 
      onRefresh={handleRefresh}
      disabled={res.loading || !res.city}
      className="min-h-screen"
    >
      {/* Hero section */}
      <div className="bg-[#001c24] -mt-[200px] pt-[200px] font-dm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-16 md:py-20">
            <div
              ref={headerRef}
              className={`text-center transition-all duration-700 ease-[var(--ease-out)] ${
                headerVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <div className="max-w-2xl mx-auto">
                <span className="inline-flex items-center gap-2 rounded-full border border-lime/25 bg-lime/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-lime mb-6">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime opacity-60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-lime" />
                  </span>
                  Near Me
                </span>
                <h1 className="text-4xl sm:text-5xl lg:text-[4rem] font-black leading-[1.06] tracking-tight text-white">
                  Events Near You
                </h1>
                <p className="mt-5 text-lg leading-relaxed text-white/60 max-w-xl mx-auto">
                  Find events based on your location.
                </p>
              </div>
            </div>

            {/* Controls */}
            <div
              ref={controlsRef}
              className={`mt-8 flex flex-wrap items-center justify-center gap-4 transition-all duration-700 delay-200 ease-[var(--ease-out)] ${
                controlsVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <button
                onClick={detect}
                disabled={permissionState === 'unsupported'}
                className="inline-flex h-13 items-center gap-2.5 rounded-xl bg-lime px-5 text-sm font-bold text-dark transition-all duration-200 hover:bg-lime-hover hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-lime disabled:hover:translate-y-0"
                aria-label="Use my location"
                title={permissionState === 'unsupported' ? 'Geolocation not supported' : permissionState === 'denied' ? 'Location permission denied' : 'Use my location'}
              >
                {permissionState === 'granted' && userLocation ? (
                  <span className="inline-flex items-center gap-2">
                    <Icon name="map-pin" className="w-4 h-4" />
                    <span>Update location</span>
                  </span>
                ) : (
                  'Use my location'
                )}
              </button>
              <div className="flex items-center gap-2">
                <label htmlFor="city" className="text-xs text-white/50">or choose</label>
                <select
                  id="city"
                  value={manualCity}
                  onChange={(e) => setManualCity(e.target.value as City | "")}
                  className="h-10 rounded-xl border border-white/20 bg-white/10 px-3 text-sm font-medium text-white transition-all hover:border-white/40 focus:border-lime focus:outline-none focus:ring-2 focus:ring-lime/20 cursor-pointer"
                  aria-label="Select a city"
                >
                  <option value="" className="text-dark">Select city</option>
                  {Object.keys(CITY_COORDS).map((c) => (
                    <option key={c} value={c} className="text-dark">{c}</option>
                  ))}
                </select>
                <button
                  disabled={!manualCity}
                  onClick={() => manualCity && loadCity(manualCity)}
                  className="inline-flex h-10 items-center rounded-xl border border-white/20 bg-white/10 px-4 text-sm font-medium text-white hover:bg-white/20 disabled:opacity-50 transition-all"
                >
                  Load
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#f8fafc]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {res.error && (
          <div className={`mb-6 rounded-xl border px-5 py-4 text-sm ${
            permissionState === 'denied' 
              ? 'border-rose-200 bg-rose-50 text-rose-800'
              : 'border-amber-200 bg-amber-50 text-amber-800'
          }`}>
            <div className="flex items-start gap-3">
              <span className="mt-0.5">
                {permissionState === 'denied' ? <Icon name="lock" className="w-5 h-5" /> : <Icon name="alert-triangle" className="w-5 h-5" />}
              </span>
              <div className="flex-1">
                <p className="font-semibold">{res.error}</p>
                {permissionState === 'denied' && (
                  <p className="mt-1 text-xs opacity-90">
                    To enable location access: Click the location icon in your browser's address bar and select "Allow"
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {permissionState === 'unsupported' && !res.error && (
          <div className="mb-6 rounded-xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-700 shadow-sm">
            <div className="flex items-start gap-3">
              <span className="mt-0.5"><Icon name="info" className="w-5 h-5 text-slate-400" /></span>
              <div className="flex-1">
                <p className="font-semibold text-slate-900">Location services not available</p>
                <p className="mt-1 text-slate-500">
                  Your browser doesn't support geolocation. Please select a city manually.
                </p>
              </div>
            </div>
          </div>
        )}

        {!res.city && !res.loading && (
          <div 
            ref={emptyStateRef}
            className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white py-16 text-center shadow-sm transition-all duration-700 ease-[var(--ease-out)] ${
              emptyStateVisible
                ? "opacity-100 translate-y-0 scale-100"
                : "opacity-0 translate-y-8 scale-95"
            }`}
          >
            <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
              {permissionState === 'denied' ? <Icon name="lock" className="w-8 h-8" /> : permissionState === 'unsupported' ? <Icon name="globe" className="w-8 h-8" /> : <Icon name="map-pin" className="w-8 h-8" />}
            </span>
            <p className="text-base font-bold text-slate-900">
              {permissionState === 'denied' 
                ? 'Location access is blocked'
                : permissionState === 'unsupported'
                ? 'Location services unavailable'
                : 'Share your location to find nearby events'}
            </p>
            <p className="mt-1 text-sm text-slate-500 max-w-md">
              {permissionState === 'denied'
                ? 'Enable location permissions in your browser settings to see events near you, or choose a city manually below'
                : permissionState === 'unsupported'
                ? 'Your browser doesn\'t support geolocation. Choose a city from the dropdown above'
                : 'Or choose a city from the dropdown'}
            </p>
            <div className="mt-6 flex items-center gap-3">
              {permissionState !== 'denied' && permissionState !== 'unsupported' && (
                <button 
                  onClick={detect} 
                  className="inline-flex h-13 items-center gap-2.5 rounded-xl bg-lime px-6 text-sm font-bold text-dark transition-all duration-200 hover:bg-lime-hover hover:-translate-y-0.5 active:translate-y-0"
                >
                  Use my location
                </button>
              )}
              <Link 
                href="/explore" 
                className="inline-flex h-13 items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-6 text-sm font-bold text-slate-900 transition-all duration-200 hover:bg-slate-50 hover:-translate-y-0.5 active:translate-y-0"
              >
                Browse all
              </Link>
            </div>
          </div>
        )}

        {res.city && (
          <div className="mb-6 flex items-center gap-3 text-sm text-slate-500">
            {userLocation && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span>
                Using your location
              </span>
            )}
            <span>
              Showing events near <span className="font-semibold text-slate-900">{res.city}</span>
              {typeof res.distanceKm === "number" && (
                <span className="text-slate-400"> • ~{Math.round(res.distanceKm)} km away</span>
              )}
            </span>
            <div className="ml-auto flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
              <button
                onClick={() => setViewMode('map')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  viewMode === 'map'
                    ? 'bg-lime text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                aria-label="Map view"
              >
               <Map className="h-3.5 w-3.5 inline mr-1" /> Map
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  viewMode === 'grid'
                    ? 'bg-lime text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                aria-label="Grid view"
              >
               <Clipboard className="h-3.5 w-3.5 inline mr-1" /> List
              </button>
            </div>
          </div>
        )}

        {res.loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div 
                key={i} 
                className="h-64 animate-pulse rounded-2xl bg-slate-100 border border-slate-100"
                style={{
                  animationDelay: `${i * 100}ms`,
                }}
              />
            ))}
          </div>
        ) : res.city ? (
          res.events.length === 0 ? (
            <div 
              ref={emptyStateRef}
              className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white py-16 text-center shadow-sm transition-all duration-700 ease-[var(--ease-out)] ${
                emptyStateVisible
                  ? "opacity-100 translate-y-0 scale-100"
                  : "opacity-0 translate-y-8 scale-95"
              }`}
            >
              <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
                <Map className="w-8 h-8" />
              </span>
              <p className="text-base font-bold text-slate-900">No events found in this area</p>
              <p className="mt-1 text-sm text-slate-500">Try a nearby city</p>
            </div>
          ) : (
            <>
              {viewMode === 'map' && (
                <div 
                  ref={mapRef}
                  className={`mb-8 rounded-2xl overflow-hidden border border-slate-100 shadow-sm transition-all duration-700 ease-[var(--ease-out)] ${
                    mapVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-8"
                  }`}
                >
                  <EventMap
                    events={res.events}
                    center={res.city in CITY_COORDS ? CITY_COORDS[res.city as keyof typeof CITY_COORDS] : undefined}
                    zoom={11}
                    onEventClick={handleEventClick}
                  />
                </div>
              )}
              
              <div ref={eventsGridRef} className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {res.events.map((e, index) => (
                  <div
                    key={e.id}
                    className={`transition-all duration-700 ease-[var(--ease-out)] ${
                      eventsVisible[index]
                        ? "opacity-100 translate-y-0 scale-100"
                        : "opacity-0 translate-y-8 scale-95"
                    }`}
                    style={{
                      transitionDelay: `${index * 100}ms`,
                    }}
                  >
                    <EventCard
                      id={e.id}
                      title={e.title}
                      description={e.description}
                      date={e.date}
                      city={e.city}
                      category={e.category}
                      image={e.image}
                      distanceKm={userLocation ? e.distanceKm : undefined}
                      distanceUnit={distanceUnit}
                    />
                  </div>
                ))}
              </div>
            </>
          )
        ) : null}
      </div>
      </div>
    </PullToRefresh>
  );
}
