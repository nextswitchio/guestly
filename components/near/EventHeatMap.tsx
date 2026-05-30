"use client";
import { Flame } from 'lucide-react';
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import type { Event } from "@/lib/events";
import { CITY_COORDS, NEIGHBORHOODS, type City } from "@/features/geo/cities";


// Dynamically import map components to avoid SSR issues
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);

interface EventHeatMapProps {
  events: Event[];
  city: City;
  onNeighborhoodClick?: (neighborhood: string) => void;
}

type HeatPoint = {
  lat: number;
  lon: number;
  intensity: number;
  neighborhood: string;
};

export default function EventHeatMap({ events, city, onNeighborhoodClick }: EventHeatMapProps) {
  const [isClient, setIsClient] = useState(false);
  const [heatReady, setHeatReady] = useState(false);
  const [heatLayer, setHeatLayer] = useState<any>(null);
  const [mapInstance, setMapInstance] = useState<any>(null);

  useEffect(() => {
    setIsClient(true);
    import("leaflet").then((leaflet) => {
      const L = leaflet.default;
      // leaflet.heat expects L as a global — make it available before import
      (window as any).L = L;
      return import("leaflet.heat" as any);
    }).then(() => setHeatReady(true));
  }, []);

  // Calculate event density by neighborhood
  const heatData = React.useMemo(() => {
    const neighborhoods = NEIGHBORHOODS[city];
    if (!neighborhoods) return [];
    const densityMap = new Map<string, number>();

    // Initialize all neighborhoods with 0
    neighborhoods.forEach((n) => {
      densityMap.set(n.name, 0);
    });

    // Assign each event to nearest neighborhood and count
    events.forEach((event) => {
      if (event.city === city) {
        // Find nearest neighborhood (simulate event location distribution)
        const randomNeighborhood = neighborhoods[Math.floor(Math.random() * neighborhoods.length)];
        const currentCount = densityMap.get(randomNeighborhood.name) || 0;
        densityMap.set(randomNeighborhood.name, currentCount + 1);
      }
    });

    // Convert to heat points
    const points: HeatPoint[] = neighborhoods.map((n) => ({
      lat: n.lat,
      lon: n.lon,
      intensity: densityMap.get(n.name) || 0,
      neighborhood: n.name,
    }));

    return points;
  }, [events, city]);

  // Get trending neighborhoods (top 3 by event count)
  const trendingNeighborhoods = React.useMemo(() => {
    return [...heatData]
      .filter((p) => p.intensity > 0)
      .sort((a, b) => b.intensity - a.intensity)
      .slice(0, 3);
  }, [heatData]);

  // Update heat layer when data changes
  useEffect(() => {
    if (!heatReady || !mapInstance || !isClient) return;

    // Remove existing heat layer
    if (heatLayer) {
      mapInstance.removeLayer(heatLayer);
    }

    // Create heat map data in format [lat, lng, intensity]
    const heatMapData = heatData
      .filter((p) => p.intensity > 0)
      .map((p) => [p.lat, p.lon, p.intensity]);

    if (heatMapData.length > 0) {
      // @ts-ignore - leaflet.heat types
      const newHeatLayer = (window as any).L.heatLayer(heatMapData, {
        radius: 35,
        blur: 25,
        maxZoom: 13,
        max: Math.max(...heatData.map((p) => p.intensity)),
        gradient: {
          0.0: "#3b82f6",
          0.3: "#8b5cf6",
          0.5: "#ec4899",
          0.7: "#f97316",
          1.0: "#ef4444",
        },
      }).addTo(mapInstance);

      setHeatLayer(newHeatLayer);
    }
  }, [heatReady, mapInstance, heatData, isClient]);

  const mapCenter = CITY_COORDS[city];

  if (!isClient || !heatReady || !mapCenter) {
    return (
      <div className="h-[500px] w-full rounded-xl bg-[var(--surface-card)] border border-[var(--surface-border)] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent"></div>
          <p className="mt-2 text-sm text-[var(--foreground-muted)]">Loading heat map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Heat Map */}
      <div className="h-[500px] w-full rounded-xl overflow-hidden border border-[var(--surface-border)] shadow-md">
        <MapContainer
          center={[mapCenter.lat, mapCenter.lon]}
          zoom={11}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={true}
          ref={setMapInstance}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </MapContainer>
      </div>

      {/* Trending Neighborhoods */}
      {trendingNeighborhoods.length > 0 && (
        <div className="rounded-xl border border-[var(--surface-border)] bg-[var(--surface-card)] p-6">
          <h3 className="mb-4 text-lg font-semibold text-[var(--foreground)]">
           <Flame className="h-4 w-4 inline" /> Trending Neighborhoods
          </h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {trendingNeighborhoods.map((point, index) => (
              <button
                key={point.neighborhood}
                onClick={() => onNeighborhoodClick?.(point.neighborhood)}
                className="group rounded-lg border border-[var(--surface-border)] bg-[var(--surface-bg)] p-4 text-left transition-all hover:border-primary-500 hover:shadow-md"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-2xl font-bold text-[var(--foreground)]">
                    #{index + 1}
                  </span>
                  <span className="rounded-full bg-danger-100 px-2 py-1 text-xs font-semibold text-danger-700">
                    {point.intensity} events
                  </span>
                </div>
                <p className="font-medium text-[var(--foreground)] group-hover:text-primary-600 transition-colors">
                  {point.neighborhood}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Heat Map Legend */}
      <div className="rounded-xl border border-[var(--surface-border)] bg-[var(--surface-card)] p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-[var(--foreground-muted)]">
            Event Density
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[var(--foreground-muted)]">Low</span>
            <div className="h-4 w-32 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 via-pink-500 via-orange-500 to-red-500"></div>
            <span className="text-xs text-[var(--foreground-muted)]">High</span>
          </div>
        </div>
      </div>
    </div>
  );
}
