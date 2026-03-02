"use client";
import React from "react";
import Link from "next/link";
import EventCard from "@/components/events/EventCard";
import { nearestCity, CITY_COORDS, type City } from "@/features/geo/cities";
import type { Event } from "@/lib/events";

type Result = {
  city: City | null;
  distanceKm?: number;
  events: Event[];
  loading: boolean;
  error?: string;
};

export default function NearMeClient() {
  const [res, setRes] = React.useState<Result>({ city: null, events: [], loading: false });
  const [manualCity, setManualCity] = React.useState<City | "">("");

  async function loadCity(city: City, distanceKm?: number) {
    setRes((r) => ({ ...r, loading: true, error: undefined }));
    try {
      const r = await fetch(`/api/events?city=${encodeURIComponent(city)}&pageSize=12`);
      const d = await r.json();
      const events: Event[] = d?.data || d?.events || [];
      setRes({ city, distanceKm, events, loading: false });
    } catch {
      setRes({ city, distanceKm, events: [], loading: false, error: "Failed to load events" });
    }
  }

  React.useEffect(() => {
    const saved = localStorage.getItem("near:city") as City | null;
    if (saved && (saved in CITY_COORDS)) {
      loadCity(saved);
    }
  }, []);

  function detect() {
    if (!("geolocation" in navigator)) {
      setRes({ city: null, events: [], loading: false, error: "Geolocation not supported" });
      return;
    }
    setRes((r) => ({ ...r, loading: true, error: undefined }));
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const near = nearestCity(latitude, longitude);
        localStorage.setItem("near:city", near.city);
        loadCity(near.city, near.distanceKm);
      },
      (err) => {
        setRes({ city: null, events: [], loading: false, error: err.message || "Permission denied" });
      },
      { enableHighAccuracy: false, maximumAge: 60000 }
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Events Near You</h1>
            <p className="mt-1 text-sm text-neutral-500">Find events based on your location.</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={detect}
              className="rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
              aria-label="Use my location"
            >
              Use my location
            </button>
            <div className="flex items-center gap-2">
              <label htmlFor="city" className="text-xs text-neutral-500">or choose</label>
              <select
                id="city"
                value={manualCity}
                onChange={(e) => setManualCity(e.target.value as City | "")}
                className="rounded-md border border-neutral-200 bg-white px-2 py-1 text-sm"
                aria-label="Select a city"
              >
                <option value="">Select city</option>
                {Object.keys(CITY_COORDS).map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <button
                disabled={!manualCity}
                onClick={() => manualCity && loadCity(manualCity)}
                className="rounded-md border border-neutral-200 bg-white px-3 py-1.5 text-sm font-medium text-neutral-700 enabled:hover:bg-neutral-50 disabled:opacity-50"
              >
                Load
              </button>
            </div>
          </div>
        </div>

        {res.error && (
          <div className="mb-4 rounded-lg border border-warning-200 bg-warning-50 px-3 py-2 text-sm text-warning-800">
            {res.error}
          </div>
        )}

        {!res.city && !res.loading && (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-neutral-200 py-16 text-center">
            <span className="text-5xl">📍</span>
            <p className="mt-3 text-sm font-medium text-neutral-700">Share your location to find nearby events</p>
            <p className="mt-1 text-xs text-neutral-500">Or choose a city from the dropdown</p>
            <div className="mt-4 flex items-center gap-2">
              <button onClick={detect} className="rounded-xl bg-primary-600 px-5 py-2 text-sm font-semibold text-white hover:bg-primary-700">Use my location</button>
              <Link href="/explore" className="rounded-xl border border-neutral-200 bg-white px-5 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-50">Browse all</Link>
            </div>
          </div>
        )}

        {res.city && (
          <div className="mb-4 text-sm text-neutral-600">
            Showing events near <span className="font-semibold text-neutral-900">{res.city}</span>
            {typeof res.distanceKm === "number" && (
              <span className="text-neutral-400"> • ~{Math.round(res.distanceKm)} km</span>
            )}
          </div>
        )}

        {res.loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-56 animate-pulse rounded-xl bg-neutral-200" />
            ))}
          </div>
        ) : res.city ? (
          res.events.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-neutral-200 py-16 text-center">
              <span className="text-5xl">🎫</span>
              <p className="mt-3 text-sm font-medium text-neutral-700">No events found near {res.city}</p>
              <Link href="/explore" className="mt-4 rounded-xl border border-neutral-200 bg-white px-5 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-50">Browse all events</Link>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {res.events.map((event) => (
                <EventCard key={event.id} {...event} />
              ))}
            </div>
          )
        ) : null}
      </div>
    </div>
  );
}
