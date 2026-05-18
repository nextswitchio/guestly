import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const token: string = body?.token || "";
  if (!token) {
    return NextResponse.json({ ok: false, error: "Token required" }, { status: 400 });
  }
  return NextResponse.json({ ok: true, message: "Email verified" });
}

