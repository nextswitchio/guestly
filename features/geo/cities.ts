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

// Neighborhood/area data for heat map visualization
export type Neighborhood = {
  name: string;
  lat: number;
  lon: number;
  city: City;
};

export const NEIGHBORHOODS: Record<City, Neighborhood[]> = {
  Lagos: [
    { name: "Victoria Island", lat: 6.4281, lon: 3.4219, city: "Lagos" },
    { name: "Lekki", lat: 6.4474, lon: 3.5489, city: "Lagos" },
    { name: "Ikeja", lat: 6.5964, lon: 3.3406, city: "Lagos" },
    { name: "Yaba", lat: 6.5158, lon: 3.3711, city: "Lagos" },
    { name: "Surulere", lat: 6.4969, lon: 3.3539, city: "Lagos" },
    { name: "Ikoyi", lat: 6.4541, lon: 3.4316, city: "Lagos" },
    { name: "Ajah", lat: 6.4698, lon: 3.5852, city: "Lagos" },
    { name: "Maryland", lat: 6.5795, lon: 3.3675, city: "Lagos" },
  ],
  Abuja: [
    { name: "Maitama", lat: 9.0820, lon: 7.4951, city: "Abuja" },
    { name: "Wuse", lat: 9.0643, lon: 7.4892, city: "Abuja" },
    { name: "Garki", lat: 9.0354, lon: 7.4892, city: "Abuja" },
    { name: "Asokoro", lat: 9.0354, lon: 7.5340, city: "Abuja" },
    { name: "Gwarinpa", lat: 9.1108, lon: 7.4119, city: "Abuja" },
    { name: "Kubwa", lat: 9.1372, lon: 7.3378, city: "Abuja" },
  ],
  Accra: [
    { name: "Osu", lat: 5.5558, lon: -0.1769, city: "Accra" },
    { name: "Labone", lat: 5.5697, lon: -0.1769, city: "Accra" },
    { name: "East Legon", lat: 5.6437, lon: -0.1769, city: "Accra" },
    { name: "Cantonments", lat: 5.5697, lon: -0.1658, city: "Accra" },
    { name: "Tema", lat: 5.6698, lon: 0.0166, city: "Accra" },
    { name: "Spintex", lat: 5.6437, lon: -0.1103, city: "Accra" },
  ],
  Nairobi: [
    { name: "Westlands", lat: -1.2676, lon: 36.8070, city: "Nairobi" },
    { name: "Kilimani", lat: -1.2921, lon: 36.7856, city: "Nairobi" },
    { name: "Karen", lat: -1.3197, lon: 36.7070, city: "Nairobi" },
    { name: "Parklands", lat: -1.2632, lon: 36.8219, city: "Nairobi" },
    { name: "Lavington", lat: -1.2832, lon: 36.7670, city: "Nairobi" },
    { name: "Upperhill", lat: -1.2921, lon: 36.8219, city: "Nairobi" },
  ],
};

// Assign a random neighborhood to an event based on its city
export function getRandomNeighborhood(city: City): Neighborhood {
  const neighborhoods = NEIGHBORHOODS[city];
  return neighborhoods[Math.floor(Math.random() * neighborhoods.length)];
}

