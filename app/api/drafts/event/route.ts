import { NextRequest, NextResponse } from "next/server";

const DRAFT_COOKIE = "event_draft";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function getDraft(req: NextRequest): Record<string, unknown> {
  try {
    const raw = req.cookies.get(DRAFT_COOKIE)?.value;
    if (!raw) return {};
    return JSON.parse(decodeURIComponent(raw));
  } catch {
    return {};
  }
}

export async function GET(req: NextRequest) {
  const draft = getDraft(req);
  return NextResponse.json({ ok: true, draft });
}

export async function PATCH(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const current = getDraft(req);
  const updated = { ...current, ...(body || {}) };

  const res = NextResponse.json({ ok: true, draft: updated });
  res.cookies.set(DRAFT_COOKIE, encodeURIComponent(JSON.stringify(updated)), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
  return res;
}

export async function DELETE(req: NextRequest) {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(DRAFT_COOKIE, "", { maxAge: 0, path: "/" });
  return res;
}
