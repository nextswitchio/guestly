import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api/client";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("access_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await req.json();
    const { platform, credentials } = body;

    if (!platform || !credentials) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const res = await fetch(`${BACKEND_URL}/api/v1/community/social/connect`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ platform, credentials }),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ detail: "Failed to connect account" }));
      return NextResponse.json({ error: error.detail }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json({ success: true, account: data });
  } catch {
    return NextResponse.json({ error: "Failed to connect account" }, { status: 500 });
  }
}
