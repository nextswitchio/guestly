import { NextRequest, NextResponse } from "next/server";

function makeToken(prefix: string) {
  const rand = Math.random().toString(36).slice(2);
  const time = Date.now().toString(36);
  return `${prefix}.${rand}.${time}`;
}

export async function POST(req: NextRequest) {
  const refresh = req.cookies.get("refresh_token")?.value;
  if (!refresh) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const access = makeToken("access");
  const res = NextResponse.json({ ok: true });
  res.cookies.set("access_token", access, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 15,
  });
  return res;
}

