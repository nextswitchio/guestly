import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api/client";
import { NEIGHBORHOODS, type City } from "@/features/geo/cities";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ city: string }> }
) {
  const { city } = await params;
  const decodedCity = decodeURIComponent(city) as City;

  const neighborhoods = NEIGHBORHOODS[decodedCity];
  if (!neighborhoods) {
    return NextResponse.json({ success: false, error: "City not found" }, { status: 404 });
  }

  try {
    const res = await fetch(
      `${BACKEND_URL}/api/v1/events?city=${encodeURIComponent(decodedCity)}&page_size=100`,
      { cache: "no-store" }
    );

    const events: any[] = res.ok ? ((await res.json()).events ?? []) : [];

    // Distribute events across neighborhoods using event coordinates when available
    const densityMap = new Map<string, number>(neighborhoods.map((n) => [n.name, 0]));

    events.forEach((event) => {
      if (event.latitude && event.longitude) {
        // Find closest neighborhood
        let closest = neighborhoods[0];
        let minDist = Infinity;
        neighborhoods.forEach((n) => {
          const d = Math.hypot(n.lat - event.latitude, n.lon - event.longitude);
          if (d < minDist) { minDist = d; closest = n; }
        });
        densityMap.set(closest.name, (densityMap.get(closest.name) ?? 0) + 1);
      } else {
        // Spread evenly if no coordinates
        const n = neighborhoods[Math.floor(Math.random() * neighborhoods.length)];
        densityMap.set(n.name, (densityMap.get(n.name) ?? 0) + 1);
      }
    });

    const heatMap = neighborhoods.map((n) => ({
      neighborhood: n.name,
      lat: n.lat,
      lon: n.lon,
      eventCount: densityMap.get(n.name) ?? 0,
    }));

    const trending = [...heatMap]
      .filter((d) => d.eventCount > 0)
      .sort((a, b) => b.eventCount - a.eventCount)
      .slice(0, 5);

    return NextResponse.json({
      success: true,
      data: {
        heatMap,
        trending,
        totalEvents: events.length,
        activeNeighborhoods: heatMap.filter((d) => d.eventCount > 0).length,
      },
    });
  } catch {
    return NextResponse.json({ success: false, error: "Backend unavailable" }, { status: 502 });
  }
}
