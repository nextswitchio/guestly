"use client";
import type { Event } from "@/lib/events";

export type City = Event["city"];

export const CITY_COORDS: Record<City, { lat: number; lon: number }> = {
  Lagos: { lat: 6.5244, lon: 3.3792 },
  Abuja: { lat: 9.0765, lon: 7.3986 },
  Accra: { lat: 5.6037, lon: -0.187 },
  Nairobi: { lat: -1.2921, lon: 36.8219 },
};

function toRad(v: number) {
  return (v * Math.PI) / 180;
}

export function distanceKm(a: { lat: number; lon: number }, b: { lat: number; lon: number }) {
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const sinDLat = Math.sin(dLat / 2);
  const sinDLon = Math.sin(dLon / 2);
  const c = 2 * Math.asin(Math.sqrt(sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLon * sinDLon));
  return R * c;
}

export function nearestCity(lat: number, lon: number): { city: City; distanceKm: number } {
  let best: { city: City; distanceKm: number } | null = null;
  for (const [name, coords] of Object.entries(CITY_COORDS) as [City, { lat: number; lon: number }][]) {
    const d = distanceKm({ lat, lon }, coords);
    if (!best || d < best.distanceKm) best = { city: name, distanceKm: d };
  }
  // best is never null because CITY_COORDS has entries
  return best as { city: City; distanceKm: number };
}

