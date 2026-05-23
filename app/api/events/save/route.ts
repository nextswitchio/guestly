import { NextRequest, NextResponse } from "next/server";
import { fetchBackendJson } from "@/lib/api/proxy";

export async function GET(req: NextRequest) {
  const { data, status, ok } = await fetchBackendJson(req, "/api/v1/events/bookmarks");
  if (!ok) return NextResponse.json({ ok: false, data: [] });
  return NextResponse.json({ ok: true, data });
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

  const { data, status, ok } = await fetchBackendJson(
    req,
    `/api/v1/events/bookmark?event_id=${encodeURIComponent(eventId)}`,
    { method: "POST" },
  );

  if (!ok) return NextResponse.json(data, { status });

  return NextResponse.json({ ok: true });
}
