import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api/client";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const ids = searchParams.get("ids");

    if (!ids) {
      return NextResponse.json({ error: "Product IDs required" }, { status: 400 });
    }

    const productIds = ids.split(",");
    const products = await Promise.all(
      productIds.map(async (id) => {
        const res = await fetch(`${BACKEND_URL}/api/v1/merchandise/products/${id}`);
        return res.ok ? res.json() : null;
      })
    );

    return NextResponse.json({
      success: true,
      products: products.filter(Boolean),
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("access_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { eventId, name, description, price, stock, imageUrl, category, fulfillmentType, sizes } = body;

    if (!eventId || !name || price === undefined) {
      return NextResponse.json({ error: "Event ID, name, and price are required" }, { status: 400 });
    }

    const res = await fetch(`${BACKEND_URL}/api/v1/merchandise/events/${eventId}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name,
        description: description || "",
        price,
        image: imageUrl || "",
        category: category || "Apparel",
        stock: stock || 0,
        sizes: sizes || [],
        fulfillment_type: fulfillmentType || "pickup",
      }),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ detail: "Failed to create product" }));
      return NextResponse.json({ error: error.detail }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json({ success: true, product: data });
  } catch {
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
