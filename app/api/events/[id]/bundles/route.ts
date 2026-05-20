import { NextRequest, NextResponse } from "next/server";
import { fetchBackendJson } from "@/lib/api/proxy";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: eventId } = await params;
  const { data, status, ok } = await fetchBackendJson(req, `/api/v1/merchandise/events/${eventId}/bundles`);
  if (!ok) return NextResponse.json(data, { status });
  return NextResponse.json({ success: true, data });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: eventId } = await params;
  const userId = req.cookies.get("user_id")?.value;
  const role = req.cookies.get("role")?.value;

  if (!userId || role !== "organiser") {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, description, productIds, discountPercentage, bundlePrice } = body;

    if (!name || !productIds || !Array.isArray(productIds) || productIds.length < 2) {
      return NextResponse.json(
        { success: false, error: "Name and at least 2 products required" },
        { status: 400 }
      );
    }

    let resolvedBundlePrice = bundlePrice;
    if (!resolvedBundlePrice) {
      const productsResult = await fetchBackendJson(req, `/api/v1/merchandise/events/${eventId}/products?page_size=100`);
      if (!productsResult.ok) return NextResponse.json(productsResult.data, { status: productsResult.status });
      const products = productsResult.data?.products || [];
      const originalPrice = products
        .filter((product: any) => productIds.includes(product.id))
        .reduce((sum: number, product: any) => sum + product.price, 0);
      resolvedBundlePrice = originalPrice * (1 - ((discountPercentage || 0) / 100));
    }

    const { data, status, ok } = await fetchBackendJson(
      req,
      `/api/v1/merchandise/events/${eventId}/bundles`,
      {
        method: "POST",
        body: JSON.stringify({
          name,
          description,
          product_ids: productIds,
          bundle_price: resolvedBundlePrice,
        }),
      },
    );
    if (!ok) return NextResponse.json(data, { status });
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create bundle" },
      { status: 500 }
    );
  }
}
