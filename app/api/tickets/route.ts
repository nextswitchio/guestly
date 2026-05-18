import { NextRequest, NextResponse } from "next/server";
import { events } from "@/lib/events";
import { seedEventTickets, getAvailability } from "@/lib/store";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const eventId = searchParams.get("eventId");
  if (!eventId) return NextResponse.json({ ok: false, error: "eventId required" }, { status: 400 });
  const ev = events.find((e) => e.id === eventId);
  if (!ev) return NextResponse.json({ ok: false, error: "event not found" }, { status: 404 });
  seedEventTickets(ev);
  const avail = getAvailability(eventId);
  return NextResponse.json({ ok: true, availability: avail });
}

