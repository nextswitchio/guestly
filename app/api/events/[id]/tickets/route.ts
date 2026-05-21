import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api/client";
import { isStoreId } from "@/lib/api/uuid-guard";
import { events } from "@/lib/events";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: eventId } = await params;

    // Store IDs — return tickets from in-memory data
    if (isStoreId(eventId)) {
      const event = events.find((e) => e.id === eventId);
      if (!event) return NextResponse.json({ error: "Event not found" }, { status: 404 });
      const tickets = event.tickets
        ? Object.entries(event.tickets).map(([name, t]) => ({
            id: `${eventId}-${name.toLowerCase()}`,
            event_id: eventId,
            name,
            price: t.price,
            available: t.available,
            total: t.available,
          }))
        : [];
      return NextResponse.json({ success: true, data: tickets });
    }

    const res = await fetch(`${BACKEND_URL}/api/v1/events/${eventId}/tickets`);

    if (!res.ok) {
      const error = await res.json().catch(() => ({ detail: "Event not found" }));
      return NextResponse.json({ error: error.detail }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json({ success: true, data: data.tickets || [] });
  } catch {
    return NextResponse.json({ error: "Failed to fetch tickets" }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = req.cookies.get("access_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: eventId } = await params;
    const body = await req.json();

    const res = await fetch(`${BACKEND_URL}/api/v1/events/${eventId}/tickets`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ detail: "Failed to set tickets" }));
      return NextResponse.json({ error: error.detail }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ error: "Failed to set tickets" }, { status: 500 });
  }
}
