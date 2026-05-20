import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api/client";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { token } = body;

  if (!token) {
    return NextResponse.json({ ok: false, error: "Token required" }, { status: 400 });
  }

  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/auth/verify-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });

    const data = await res.json();
    return NextResponse.json({ ok: res.ok, message: data.message || data.detail }, { status: res.status });
  } catch {
    return NextResponse.json({ ok: false, error: "Backend unavailable" }, { status: 503 });
  }
}
