import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api/client";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("access_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await req.json();
    const { latitude, longitude, city } = body;

    if (typeof latitude !== "number" || typeof longitude !== "number" || !city) {
      return NextResponse.json({ error: "Latitude, longitude, and city are required" }, { status: 400 });
    }

    const res = await fetch(`${BACKEND_URL}/api/v1/community/notifications/location`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ latitude, longitude, city }),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ detail: "Failed to update location" }));
      return NextResponse.json({ error: error.detail }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ error: "Failed to update location" }, { status: 500 });
  }
}
