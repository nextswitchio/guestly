import { NextResponse } from "next/server";

// In-memory fallback cache for when ipapi.co rate-limits us
let cached: { data: Record<string, unknown>; ts: number } | null = null;

const IPAPI_URL = "https://ipapi.co/json/";
const CACHE_TTL = 3600_000; // 1 hour

export async function GET() {
  // Return in-memory cache if still fresh
  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    return NextResponse.json(cached.data);
  }

  try {
    const res = await fetch(IPAPI_URL, { next: { revalidate: 3600 } });

    if (res.ok) {
      const data = await res.json();
      cached = { data, ts: Date.now() };
      return NextResponse.json(data);
    }

    // Rate-limited — serve stale cache or graceful empty response
    if (cached) {
      return NextResponse.json(cached.data);
    }
    return NextResponse.json({ currency: "NGN", country_code: "NG" });
  } catch {
    if (cached) {
      return NextResponse.json(cached.data);
    }
    return NextResponse.json({ currency: "NGN", country_code: "NG" });
  }
}
