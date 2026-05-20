import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api/client";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const eventId = searchParams.get("eventId");
  if (!eventId) return NextResponse.json({ error: "eventId required" }, { status: 400 });

  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/events/${eventId}/tickets`);
    if (!res.ok) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }
    const data = await res.json();
    return NextResponse.json({ ok: true, availability: data });
  } catch {
    return NextResponse.json({ error: "Failed to fetch tickets" }, { status: 500 });
  }
}
