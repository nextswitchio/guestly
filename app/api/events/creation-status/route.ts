import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api/client";

export async function GET(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  if (!token) return NextResponse.json({ can_create: false, event_count: 0, limit: 5, has_active_subscription: false, subscription_expires_at: null }, { status: 200 });

  try {
    const response = await fetch(`${BACKEND_URL}/api/v1/events/creation-status`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json({ can_create: false, event_count: 0, limit: 5, has_active_subscription: false, subscription_expires_at: null }, { status: 200 });
  }
}
