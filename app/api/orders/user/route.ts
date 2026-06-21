import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api/client";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("access_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const page = url.searchParams.get("page") || "1";
    const pageSize = url.searchParams.get("pageSize") || "20";

    const res = await fetch(`${BACKEND_URL}/api/v1/orders/?page=${page}&page_size=${pageSize}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ detail: "Failed to fetch orders" }));
      return NextResponse.json({ error: error.detail }, { status: res.status });
    }

    const data = await res.json();
    
    // Map backend snake_case fields to frontend camelCase
    const mappedOrders = (data.orders || []).map((order: any) => ({
      id: order.id,
      eventId: order.event_id,
      items: order.items || [],
      total: order.total,
      status: order.status,
      createdAt: new Date(order.created_at).getTime(),
      user_id: order.user_id,
      payment_method: order.payment_method,
      payment_reference: order.payment_reference,
      updated_at: order.updated_at,
    }));

    return NextResponse.json({ 
      success: true, 
      orders: mappedOrders, 
      total: data.total, 
      page: data.page, 
      page_count: data.page_count 
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
