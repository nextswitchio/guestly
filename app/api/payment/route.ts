import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api/client";

export async function POST(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value;
  const body = await req.json().catch(() => ({}));

  const { orderId, method, payment_details } = body;

  if (!orderId) {
    return NextResponse.json({ ok: false, error: "Order ID required" }, { status: 400 });
  }

  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/orders/pay`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        order_id: orderId,
        method: method || "wallet",
        payment_details,
      }),
    });

    const data = await res.json();

    if (res.ok && data.success) {
      return NextResponse.json({ ok: true, orderId: data.order_id, message: data.message });
    }

    return NextResponse.json(
      { ok: false, error: data.detail || "Payment failed" },
      { status: res.status }
    );
  } catch {
    return NextResponse.json({ ok: false, error: "Backend unavailable" }, { status: 503 });
  }
}
