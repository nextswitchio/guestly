import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api/client";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));

  if (!body.orderId || !body.reference) {
    return NextResponse.json({ success: false, error: "orderId and reference required" }, { status: 400 });
  }

  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/orders/verify-payment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        order_id: body.orderId,
        reference: body.reference,
      }),
    });

    const data = await res.json();

    if (res.ok && data.success) {
      return NextResponse.json({ success: true, message: data.message });
    }

    return NextResponse.json(
      { success: false, error: data.detail || "Verification failed" },
      { status: res.status }
    );
  } catch {
    return NextResponse.json({ success: false, error: "Backend unavailable" }, { status: 503 });
  }
}
