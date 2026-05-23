import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api/client";

function authHeaders(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function requireAdmin(request: NextRequest) {
  return request.cookies.get("role")?.value === "admin" && request.cookies.get("access_token")?.value;
}

function toBackendPayload(body: Record<string, unknown>) {
  const asDate = (value: unknown) => {
    if (typeof value === "number") return new Date(value).toISOString();
    return value;
  };
  return {
    event_id: body.eventId ?? body.event_id,
    coverage_type: body.coverageType ?? body.coverage_type,
    country: body.country,
    city: body.city,
    start_date: asDate(body.startDate ?? body.start_date),
    end_date: asDate(body.endDate ?? body.end_date),
    payment_status: body.paymentStatus ?? body.payment_status,
    notes: body.notes,
  };
}

export async function GET(request: NextRequest) {
  if (!requireAdmin(request)) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "Admin access required" } },
      { status: 401 },
    );
  }

  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");

  try {
    if (action === "settings") {
      const response = await fetch(`${BACKEND_URL}/api/v1/admin/featured/settings`, {
        headers: authHeaders(request),
        cache: "no-store",
      });
      const data = await response.json();
      return NextResponse.json({ success: response.ok, data }, { status: response.status });
    }

    if (action === "stats") {
      const response = await fetch(`${BACKEND_URL}/api/v1/admin/featured/stats`, {
        headers: authHeaders(request),
        cache: "no-store",
      });
      const data = await response.json();
      return NextResponse.json({ success: response.ok, data }, { status: response.status });
    }

    if (action === "featured-events") {
      const response = await fetch(`${BACKEND_URL}/api/v1/events/featured/?page_size=12`, {
        headers: authHeaders(request),
        cache: "no-store",
      });
      const data = await response.json();
      return NextResponse.json({ success: response.ok, data }, { status: response.status });
    }

    if (action === "available-positions") {
      return NextResponse.json({ success: true, data: Array.from({ length: 10 }, (_, index) => index + 1) });
    }

    const params = new URLSearchParams();
    const status = searchParams.get("status");
    if (status && status !== "all") params.set("status_filter", status);

    const response = await fetch(`${BACKEND_URL}/api/v1/admin/featured${params.size ? `?${params}` : ""}`, {
      headers: authHeaders(request),
      cache: "no-store",
    });
    const data = await response.json();
    return NextResponse.json({ success: response.ok, data }, { status: response.status });
  } catch {
    return NextResponse.json(
      { success: false, error: { code: "BACKEND_ERROR", message: "Failed to load featured placements" } },
      { status: 502 },
    );
  }
}

export async function POST(request: NextRequest) {
  if (!requireAdmin(request)) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "Admin access required" } },
      { status: 401 },
    );
  }

  try {
    const body = await request.json();
    const response = await fetch(`${BACKEND_URL}/api/v1/admin/featured`, {
      method: "POST",
      headers: authHeaders(request),
      body: JSON.stringify(toBackendPayload(body)),
    });
    const data = await response.json();
    return NextResponse.json({ success: response.ok, data, error: response.ok ? undefined : data }, { status: response.status });
  } catch {
    return NextResponse.json(
      { success: false, error: { code: "BACKEND_ERROR", message: "Failed to create featured placement" } },
      { status: 502 },
    );
  }
}

export async function PUT(request: NextRequest) {
  if (!requireAdmin(request)) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "Admin access required" } },
      { status: 401 },
    );
  }

  try {
    const body = await request.json();
    const response = await fetch(`${BACKEND_URL}/api/v1/admin/featured/settings`, {
      method: "PUT",
      headers: authHeaders(request),
      body: JSON.stringify({
        fee_per_hour: body.feePerHour ?? body.fee_per_hour,
        currency: body.currency || "NGN",
      }),
    });
    const data = await response.json();
    return NextResponse.json({ success: response.ok, data, error: response.ok ? undefined : data }, { status: response.status });
  } catch {
    return NextResponse.json(
      { success: false, error: { code: "BACKEND_ERROR", message: "Failed to update featured placement settings" } },
      { status: 502 },
    );
  }
}
