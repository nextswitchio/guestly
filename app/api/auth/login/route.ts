import { NextRequest, NextResponse } from "next/server";

function makeToken(prefix: string) {
  const rand = Math.random().toString(36).slice(2);
  const time = Date.now().toString(36);
  return `${prefix}.${rand}.${time}`;
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const email: string = body?.email || "";
  const role: "attendee" | "organiser" = body?.role || "attendee";

  if (!email) {
    return NextResponse.json({ ok: false, error: "Email required" }, { status: 400 });
  }

  const access = makeToken("access");
  const refresh = makeToken("refresh");
  const res = NextResponse.json({ ok: true, role });

  res.cookies.set("access_token", access, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 15,
  });
  res.cookies.set("refresh_token", refresh, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  res.cookies.set("role", role, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}

