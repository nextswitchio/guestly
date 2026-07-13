import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api/client";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("access_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const event_id = body.event_id || body.eventId;
    const items = body.items;
    const shipping_address = body.shipping_address || body.shippingAddress;

    if (!event_id || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
    }

    const mappedItems = items.map((item: any) => ({
      product_id: item.product_id || item.productId,
      quantity: item.quantity,
      size: item.size,
    }));

    const res = await fetch(`${BACKEND_URL}/api/v1/merchandise/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ event_id, items: mappedItems, shipping_address }),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ detail: "Failed to create order" }));
      return NextResponse.json({ error: error.detail }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json({ success: true, order: data });
  } catch {
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("access_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const res = await fetch(`${BACKEND_URL}/api/v1/merchandise/orders`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      return NextResponse.json({ orders: [] }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json({ success: true, orders: data });
  } catch {
    return NextResponse.json({ orders: [] }, { status: 500 });
  }
}
