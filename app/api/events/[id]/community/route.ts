import { NextRequest, NextResponse } from "next/server";
import { fetchBackendJson } from "@/lib/api/proxy";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { data, status, ok } = await fetchBackendJson(req, `/api/v1/community/events/${id}/discussions`);
  if (!ok) return NextResponse.json(data, { status });
  return NextResponse.json({ ok: true, data });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const message: string = body?.message || "";
    if (!message.trim()) {
      return NextResponse.json({ ok: false, error: "Message required" }, { status: 400 });
    }
    const trimmed = message.trim();
    const { data, status, ok } = await fetchBackendJson(
      req,
      `/api/v1/community/events/${id}/discussions`,
      {
        method: "POST",
        body: JSON.stringify({ title: trimmed.slice(0, 80), content: trimmed }),
      },
    );
    if (!ok) return NextResponse.json(data, { status });
    return NextResponse.json({ ok: true, data });
  } catch (e) {
    return NextResponse.json({ ok: false, error: "Failed to post" }, { status: 500 });
  }
}
