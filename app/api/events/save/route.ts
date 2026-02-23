import { NextRequest, NextResponse } from "next/server";
import { saveEvent } from "@/lib/store";

function userId(req: NextRequest) {
  const role = req.cookies.get("role")?.value;
  return role === "attendee" ? "attendee-user" : "organiser-user";
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
  saveEvent(userId(req), eventId);
  return NextResponse.json({ ok: true });
}
