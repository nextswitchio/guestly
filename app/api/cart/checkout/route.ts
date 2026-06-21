import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api/client";

function getAuthHeaders(req: NextRequest): Record<string, string> {
  const token = req.cookies.get("access_token")?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value;
  const body = await req.json().catch(() => ({}));

  const { eventId, items, shippingAddress } = body;

  if (!eventId || !items) {
    return NextResponse.json(
      { success: false, error: "Event ID and items required" },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/merchandise/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        event_id: eventId,
        items: items.map((item: any) => ({
          product_id: item.productId,
          quantity: item.quantity,
          size: item.size,
        })),
        shipping_address: shippingAddress,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      return NextResponse.json({ success: true, order: data, orderId: data.id });
    }

    return NextResponse.json(
      { success: false, error: data.detail || "Checkout failed" },
      { status: res.status }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "Backend unavailable" },
      { status: 503 }
    );
  }
}
