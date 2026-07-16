import { NextRequest, NextResponse } from "next/server";
import { fetchBackendJson } from "@/lib/api/proxy";

export async function GET(req: NextRequest) {
  const { data, status, ok } = await fetchBackendJson(req, "/api/v1/events/bookmarks");
  if (!ok) return NextResponse.json({ ok: false, data: [] });
  return NextResponse.json({ ok: true, data });
}

async function getEventId(req: NextRequest): Promise<string | null> {
  const body = await req.json().catch((err) => { console.error("Failed to parse request body:", err); return undefined; });
  if (body && typeof body === "object") {
    const obj = body as { eventId?: string };
    if (obj.eventId) return obj.eventId;
  }
  const fd = await req.formData().catch((err) => { console.error("Failed to parse form data:", err); return undefined; });
  return fd?.get("eventId")?.toString() ?? null;
}

export async function POST(req: NextRequest) {
  const eventId = await getEventId(req);
  if (!eventId) return NextResponse.json({ ok: false, error: "eventId required" }, { status: 400 });

  const { data, status, ok } = await fetchBackendJson(
    req,
    `/api/v1/events/bookmark?event_id=${encodeURIComponent(eventId)}`,
    { method: "POST" },
  );

  if (!ok) return NextResponse.json(data, { status });

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const eventId = await getEventId(req);
  if (!eventId) return NextResponse.json({ ok: false, error: "eventId required" }, { status: 400 });

  const { data, status, ok } = await fetchBackendJson(
    req,
    `/api/v1/events/bookmark/${encodeURIComponent(eventId)}`,
    { method: "DELETE" },
  );

  if (!ok) return NextResponse.json(data, { status });

  return NextResponse.json({ ok: true });
}
