import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api/client";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("access_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { order_id, method, payment_method } = body;

    if (!order_id) {
      return NextResponse.json({ error: "orderId required" }, { status: 400 });
    }

    const res = await fetch(`${BACKEND_URL}/api/v1/orders/${order_id}/pay`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ method: method || payment_method || "card" }),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ detail: "Payment failed" }));
      return NextResponse.json({ error: error.detail }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json({ ok: true, data });
  } catch {
    return NextResponse.json({ error: "Payment processing failed" }, { status: 500 });
  }
}
