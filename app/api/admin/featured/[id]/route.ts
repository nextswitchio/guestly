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

function asDate(value: unknown) {
  if (typeof value === "number") return new Date(value).toISOString();
  return value;
}

function toBackendPayload(body: Record<string, unknown>) {
  return {
    coverage_type: body.coverageType ?? body.coverage_type,
    country: body.country,
    city: body.city,
    start_date: asDate(body.startDate ?? body.start_date),
    end_date: asDate(body.endDate ?? body.end_date),
    fee_per_hour: body.feePerHour ?? body.fee_per_hour,
    status: body.status,
    payment_status: body.paymentStatus ?? body.payment_status,
    notes: body.notes,
    rejection_reason: body.rejectionReason ?? body.rejection_reason,
  };
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!requireAdmin(request)) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "Admin access required" } },
      { status: 401 },
    );
  }
  const { id } = await params;
  const response = await fetch(`${BACKEND_URL}/api/v1/admin/featured`, {
    headers: authHeaders(request),
    cache: "no-store",
    credentials: 'include',
  });
  const data = await response.json();
  const placement = Array.isArray(data) ? data.find((item: { id: string }) => item.id === id) : null;
  return NextResponse.json({ success: Boolean(placement), data: placement }, { status: placement ? 200 : 404 });
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!requireAdmin(request)) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "Admin access required" } },
      { status: 401 },
    );
  }
  const { id } = await params;
  try {
    const body = await request.json();
    const response = await fetch(`${BACKEND_URL}/api/v1/admin/featured/${id}`, {
      method: "PUT",
      headers: authHeaders(request),
      body: JSON.stringify(toBackendPayload(body)),
      credentials: 'include',
    });
    const data = await response.json();
    return NextResponse.json({ success: response.ok, data, error: response.ok ? undefined : data }, { status: response.status });
  } catch {
    return NextResponse.json(
      { success: false, error: { code: "BACKEND_ERROR", message: "Failed to update featured placement" } },
      { status: 502 },
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!requireAdmin(request)) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "Admin access required" } },
      { status: 401 },
    );
  }
  const { id } = await params;
  const reason = new URL(request.url).searchParams.get("reason") || "Cancelled by admin";
  const response = await fetch(`${BACKEND_URL}/api/v1/admin/featured/${id}`, {
    method: "PUT",
    headers: authHeaders(request),
    body: JSON.stringify({ status: "cancelled", rejection_reason: reason }),
    credentials: 'include',
  });
  const data = await response.json();
  return NextResponse.json({ success: response.ok, data, error: response.ok ? undefined : data }, { status: response.status });
}
