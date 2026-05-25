import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api/client";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const city = searchParams.get("city");
  const country = searchParams.get("country");
  const type = searchParams.get("type");

  try {
    const query = new URLSearchParams({ page_size: "100" });
    if (city) query.set("city", city);
    if (country) query.set("country", country);

    const res = await fetch(`${BACKEND_URL}/api/v1/events?${query}`, { cache: "no-store" });
    const events: any[] = res.ok ? ((await res.json()).events ?? []) : [];

    // Derive communities from real event data
    const communityMap = new Map<string, { type: string | null; count: number }>();
    events.forEach((e) => {
      if (e.community) {
        const existing = communityMap.get(e.community);
        if (existing) {
          existing.count++;
        } else {
          communityMap.set(e.community, { type: e.community_type ?? null, count: 1 });
        }
      }
    });

    const communities = Array.from(communityMap.entries())
      .map(([name, d]) => ({ name, type: d.type, count: d.count }))
      .sort((a, b) => b.count - a.count);

    const typeMap = new Map<string, number>();
    communities.forEach((c) => {
      if (c.type) typeMap.set(c.type, (typeMap.get(c.type) ?? 0) + c.count);
    });
    const communityTypes = Array.from(typeMap.entries())
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count);

    // Handle stats request from community page
    if (type === "stats") {
      return NextResponse.json({ followers: 0, posts: communities.length });
    }

    return NextResponse.json({ success: true, data: { communities, communityTypes } });
  } catch {
    return NextResponse.json({ success: false, error: "Backend unavailable" }, { status: 502 });
  }
}
