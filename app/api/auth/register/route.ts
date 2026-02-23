import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const email: string = body?.email || "";
  const role: "attendee" | "organiser" = body?.role || "attendee";
  if (!email) {
    return NextResponse.json({ ok: false, error: "Email required" }, { status: 400 });
  }
  return NextResponse.json({ ok: true, role, message: "Registered. Check your email to verify." });
}

