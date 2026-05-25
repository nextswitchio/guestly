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
  const city = body.city;
  return {
    event_id: body.eventId ?? body.event_id,
    coverage_type: body.coverageType ?? body.coverage_type,
    country: body.country || null,
    city: city && typeof city === "string" && city.trim() ? city.trim() : null,
    start_date: body.startDate ?? body.start_date,
    end_date: body.endDate ?? body.end_date,
    notes: body.notes || null,
    payment_method: (body.paymentMethod as string) || "wallet",
    mobile_provider: (body.mobileProvider as string) || null,
    phone_number: (body.phoneNumber as string) || null,
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
    const payload = await request.json();
    const response = await fetch(`${BACKEND_URL}/api/v1/featured/requests`, {
      method: "POST",
      headers: authHeaders(request),
      body: JSON.stringify(toBackendPayload(payload)),
    });
    const text = await response.text();
    let detail: string;
    try { const j = JSON.parse(text); detail = j.detail || j.message || text; } catch { detail = text || response.statusText; }
    if (!response.ok) return NextResponse.json({ success: false, error: detail }, { status: 400 });
    const data = JSON.parse(text);
    return NextResponse.json({ success: true, data, payment_url: data.payment_url || null });
  } catch (err) {
    return NextResponse.json({ success: false, error: err instanceof Error ? err.message : "Failed to request featured placement" }, { status: 502 });
  }
}
