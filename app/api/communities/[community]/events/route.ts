import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api/client";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ community: string }> }
) {
  const { community: communityParam } = await params;
  const community = decodeURIComponent(communityParam);

  try {
    const res = await fetch(
      `${BACKEND_URL}/api/v1/events?community=${encodeURIComponent(community)}&page_size=50`,
      { cache: "no-store" }
    );
    if (!res.ok) {
      return NextResponse.json({ success: true, data: [] });
    }
    const data = await res.json();
    return NextResponse.json({ success: true, data: data.events ?? [] });
  } catch {
    return NextResponse.json({ success: false, error: "Backend unavailable" }, { status: 502 });
  }
}
