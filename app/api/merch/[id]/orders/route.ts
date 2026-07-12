import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api/client";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = req.cookies.get("access_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized", orders: [] }, { status: 401 });
    }

    const { id: productId } = await params;

    const res = await fetch(`${BACKEND_URL}/api/v1/merchandise/orders`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      return NextResponse.json({ orders: [] }, { status: res.status });
    }

    const orders = await res.json();
    const filtered = Array.isArray(orders)
      ? orders.filter((order: any) =>
          order.items?.some((item: any) => item.product_id === productId)
        )
      : [];

    return NextResponse.json({ success: true, orders: filtered });
  } catch {
    return NextResponse.json({ orders: [] }, { status: 500 });
  }
}
