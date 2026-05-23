import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api/client";

function authHeaders(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function toBackendPayload(body: Record<string, unknown>) {
  return {
    event_id: body.eventId ?? body.event_id,
    coverage_type: body.coverageType ?? body.coverage_type,
    country: body.country,
    city: body.city,
    start_date: body.startDate ?? body.start_date,
    end_date: body.endDate ?? body.end_date,
    notes: body.notes,
  };
}

export async function GET(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const response = await fetch(`${BACKEND_URL}/api/v1/featured/requests/my`, {
      headers: authHeaders(request),
      cache: "no-store",
    });
    const data = await response.json();
    return NextResponse.json({ success: response.ok, data }, { status: response.status });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to load featured placement requests" }, { status: 502 });
  }
}

export async function POST(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const response = await fetch(`${BACKEND_URL}/api/v1/featured/requests`, {
      method: "POST",
      headers: authHeaders(request),
      body: JSON.stringify(toBackendPayload(body)),
    });
    const data = await response.json();
    return NextResponse.json({ success: response.ok, data, error: response.ok ? undefined : data }, { status: response.status });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to request featured placement" }, { status: 502 });
  }
}
