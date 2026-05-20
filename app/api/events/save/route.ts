import { NextRequest, NextResponse } from "next/server";
import { saveEvent, incrementEventSaves, clearCityStatsCache, listSavedEvents } from "@/lib/store";
import { getEventById } from "@/lib/events";

function getUserId(req: NextRequest): string {
  return req.cookies.get("user_id")?.value || "anonymous";
}

export async function GET(req: NextRequest) {
  const uid = getUserId(req);
  const ids = listSavedEvents(uid);
  const events = ids.map(getEventById).filter(Boolean);
  return NextResponse.json({ ok: true, data: events });
}

export async function POST(req: NextRequest) {
  let eventId: string | undefined;
  const body = await req.json().catch(() => undefined);
  if (body && typeof body === "object") {
    const obj = body as { eventId?: string };
    eventId = obj.eventId;
  }
  if (!eventId) {
    const fd = await req.formData().catch(() => undefined);
    eventId = fd?.get("eventId")?.toString();
  }
  if (!eventId) return NextResponse.json({ ok: false, error: "eventId required" }, { status: 400 });

  saveEvent(getUserId(req), eventId);
  incrementEventSaves(eventId);
  const event = getEventById(eventId);
  if (event) {
    clearCityStatsCache(event.city);
  }

  return NextResponse.json({ ok: true });
}
