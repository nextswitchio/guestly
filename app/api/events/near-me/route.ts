import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api/client";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const radius = searchParams.get("radius") || "10";

  if (!lat || !lng) {
    return NextResponse.json({ success: false, error: "Latitude and longitude required" }, { status: 400 });
  }

  try {
    const params = new URLSearchParams({ lat, lng, radius });
    const res = await fetch(`${BACKEND_URL}/api/v1/events/near-me?${params}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      // Fall back to listing published events if near-me endpoint doesn't exist
      const fallback = await fetch(`${BACKEND_URL}/api/v1/events?page_size=20`, { cache: "no-store" });
      if (fallback.ok) {
        const data = await fallback.json();
        return NextResponse.json({ success: true, data: data.events ?? [] });
      }
      return NextResponse.json({ success: true, data: [] });
    }

    const data = await res.json();
    return NextResponse.json({ success: true, data: data.events ?? data.data ?? data });
  } catch {
    return NextResponse.json({ success: false, error: "Backend unavailable" }, { status: 502 });
  }
}
