import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const email: string = body?.email || "";
  if (!email) {
    return NextResponse.json({ ok: false, error: "Email required" }, { status: 400 });
  }
  return NextResponse.json({ ok: true, message: "Password reset email sent" });
}

