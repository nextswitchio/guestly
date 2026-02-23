import { NextRequest, NextResponse } from "next/server";

export async function POST(_req: NextRequest) {
  const res = NextResponse.json({ ok: true });
  res.cookies.set("access_token", "", { httpOnly: true, path: "/", maxAge: 0 });
  res.cookies.set("refresh_token", "", { httpOnly: true, path: "/", maxAge: 0 });
  res.cookies.set("role", "", { httpOnly: true, path: "/", maxAge: 0 });
  return res;
}

