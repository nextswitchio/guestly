import { NextRequest, NextResponse } from "next/server";
import { getEventDraft, saveEventDraft } from "@/lib/store";

function userId(req: NextRequest) {
  const role = req.cookies.get("role")?.value;
  return role === "organiser" ? "organiser-user" : "attendee-user";
}

export async function GET(req: NextRequest) {
  const draft = getEventDraft(userId(req));
  return NextResponse.json({ ok: true, draft });
}

export async function PATCH(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const updated = saveEventDraft(userId(req), body || {});
  return NextResponse.json({ ok: true, draft: updated });
}

