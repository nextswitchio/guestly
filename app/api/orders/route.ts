import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api/client";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value;
  const { searchParams } = req.nextUrl;
  const id = searchParams.get("id");
  const eventId = searchParams.get("eventId");

  if (id) {
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/orders/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (res.ok) {
        return NextResponse.json({ order: data });
      }
      return NextResponse.json({ order: null }, { status: res.status });
    } catch {
      return NextResponse.json({ order: null }, { status: 503 });
    }
  }

  const page = searchParams.get("page") || "1";
  const page_size = searchParams.get("page_size") || "100";

  // Build query string — backend supports event_id filter
  const qs = new URLSearchParams({ page, page_size });
  if (eventId) qs.set("event_id", eventId);

  try {
    const res = await fetch(
      `${BACKEND_URL}/api/v1/orders/?${qs.toString()}`,
      { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    );
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ orders: [], total: 0, page: 1, page_count: 1 });
  }
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value;
  const body = await req.json().catch(() => ({}));

  const { eventId, items } = body;

  if (!eventId || !items) {
    return NextResponse.json(
      { success: false, error: "Event ID and items required" },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/orders/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        event_id: eventId,
        items: items.map((item: any) => ({
          ticket_id: item.ticketId || item.id,
          quantity: item.quantity,
          attendance_type: item.attendanceType || item.attendance_type,
        })),
      }),
    });

    const data = await res.json();

    if (res.ok) {
      return NextResponse.json({ success: true, order: data, orderId: data.id });
    }

    return NextResponse.json(
      { success: false, error: data.detail || "Order creation failed" },
      { status: res.status }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "Backend unavailable" },
      { status: 503 }
    );
  }
}
