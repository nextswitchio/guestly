import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api/client";

function getAuthHeaders(req: NextRequest): Record<string, string> {
  const token = req.cookies.get("access_token")?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const eventId = searchParams.get("eventId");

  if (eventId) {
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/wallet/savings`, {
        headers: getAuthHeaders(req),
      });
      const data = await res.json();
      const target = Array.isArray(data) ? data.find((t: any) => t.event_id === eventId) : null;
      return NextResponse.json({ success: true, target: target || null });
    } catch {
      return NextResponse.json({ success: true, target: null });
    }
  }

  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/wallet/savings`, {
      headers: getAuthHeaders(req),
    });
    const data = await res.json();
    return NextResponse.json({ success: true, targets: data });
  } catch {
    return NextResponse.json({ success: true, targets: [] });
  }
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value;
  const body = await req.json().catch(() => ({}));
  const { searchParams } = req.nextUrl;
  const action = searchParams.get("action");

  if (action === "contribute") {
    const { targetId, amount } = body;
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/wallet/savings/${targetId}/contribute`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ amount }),
      });
      const data = await res.json();
      return NextResponse.json(data, { status: res.status });
    } catch {
      return NextResponse.json({ error: "Backend unavailable" }, { status: 503 });
    }
  }

  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/wallet/savings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        event_id: body.eventId || null,
        goal_amount: body.goalAmount,
        target_date: body.targetDate || null,
        recurring_amount: body.recurringAmount || null,
        recurring_frequency: body.recurringFrequency || null,
        auto_apply: body.autoApply || false,
      }),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: "Backend unavailable" }, { status: 503 });
  }
}
