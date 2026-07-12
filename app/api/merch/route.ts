import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api/client";

function getAuthHeaders(req: NextRequest): Record<string, string> {
  const token = req.cookies.get("access_token")?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const eventId = searchParams.get("eventId");
  const ids = searchParams.get("ids");
  const stats = searchParams.get("stats");
  const singleId = searchParams.get("id");

  if (stats) {
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/merchandise/my-products`, {
        headers: getAuthHeaders(req),
      });
      if (!res.ok) {
        return NextResponse.json({ totalProducts: 0, unitsSold: 0, revenue: 0, bestSellers: [] });
      }
      const data = await res.json();
      const products = data.products || [];
      const totalProducts = products.length;
      const unitsSold = products.reduce((sum: number, p: any) => sum + (p.sold || 0), 0);
      const revenue = products.reduce((sum: number, p: any) => sum + (p.price || 0) * (p.sold || 0), 0);
      return NextResponse.json({ totalProducts, unitsSold, revenue, bestSellers: products.slice(0, 5) });
    } catch {
      return NextResponse.json({ totalProducts: 0, unitsSold: 0, revenue: 0, bestSellers: [] });
    }
  }

  if (ids) {
    const productIds = ids.split(",");
    const products = await Promise.all(
      productIds.map(async (id) => {
        try {
          const res = await fetch(`${BACKEND_URL}/api/v1/merchandise/products/${id}`);
          return res.ok ? res.json() : null;
        } catch {
          return null;
        }
      })
    );
    return NextResponse.json({ success: true, products: products.filter(Boolean) });
  }

  if (singleId) {
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/merchandise/products/${singleId}`);
      if (!res.ok) {
        return NextResponse.json({ product: null }, { status: res.status });
      }
      const data = await res.json();
      return NextResponse.json({ product: data });
    } catch {
      return NextResponse.json({ product: null }, { status: 503 });
    }
  }

  if (eventId) {
    try {
      const res = await fetch(
        `${BACKEND_URL}/api/v1/merchandise/events/${eventId}/products?page=${searchParams.get("page") || 1}&page_size=${searchParams.get("page_size") || 20}`,
        { headers: getAuthHeaders(req) }
      );
      if (!res.ok) {
        return NextResponse.json({ products: [], total: 0, page: 1, page_count: 1 });
      }
      const data = await res.json();
      return NextResponse.json(data);
    } catch {
      return NextResponse.json({ products: [], total: 0, page: 1, page_count: 1 });
    }
  }

  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/merchandise/my-products`, {
      headers: getAuthHeaders(req),
    });
    if (!res.ok) {
      return NextResponse.json({ products: [], total: 0, page: 1, page_count: 1 });
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ products: [], total: 0, page: 1, page_count: 1 });
  }
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value;
  const body = await req.json().catch(() => ({}));
  const { searchParams } = req.nextUrl;
  const action = searchParams.get("action");

  if (action === "order") {
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/merchandise/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          event_id: body.eventId,
          items: body.items?.map((i: any) => ({
            product_id: i.productId,
            quantity: i.quantity,
            size: i.size,
          })),
          shipping_address: body.shippingAddress,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        return NextResponse.json({ success: true, order: data, orderId: data.id });
      }
      return NextResponse.json({ success: false, error: data.detail }, { status: res.status });
    } catch {
      return NextResponse.json({ success: false, error: "Backend unavailable" }, { status: 503 });
    }
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
