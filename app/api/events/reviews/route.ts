import { NextRequest, NextResponse } from "next/server";
import { fetchBackendJson } from "@/lib/api/proxy";

export async function GET(req: NextRequest) {
  try {
    const { data, status, ok } = await fetchBackendJson(req, "/api/v1/events/reviews/my");
    if (!ok) return NextResponse.json(data, { status });
    return NextResponse.json({ reviews: Array.isArray(data) ? data : [] });
  } catch {
    return NextResponse.json({ error: "Failed to fetch event reviews" }, { status: 500 });
  }
}
