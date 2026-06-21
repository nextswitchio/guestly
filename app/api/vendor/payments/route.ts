import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api/client";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("access_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Vendor authentication required" }, { status: 401 });
    }

    const res = await fetch(`${BACKEND_URL}/api/v1/vendors/payments`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ detail: "Failed to fetch payments" }));
      return NextResponse.json({ error: error.detail }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ error: "Failed to fetch payments" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("access_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Vendor authentication required" }, { status: 401 });
    }

    const body = await req.json();
    const event_id = body.event_id || body.eventId;
    const amount = body.amount;
    const notes = body.notes || null;

    if (!event_id || !amount || amount <= 0) {
      return NextResponse.json({ error: "Event ID and valid amount are required" }, { status: 400 });
    }

    const res = await fetch(`${BACKEND_URL}/api/v1/vendors/payments`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ event_id, amount, notes }),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ detail: "Failed to create payment" }));
      return NextResponse.json({ error: error.detail }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ error: "Failed to create payment" }, { status: 500 });
  }
}
