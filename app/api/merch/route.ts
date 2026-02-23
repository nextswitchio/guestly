import { NextRequest, NextResponse } from "next/server";
import { getProductsByEvent, getAllProducts, getProductById, getMerchStats } from "@/lib/store";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const eventId = searchParams.get("eventId");
  const productId = searchParams.get("id");
  const stats = searchParams.get("stats");

  if (stats === "true") {
    return NextResponse.json(getMerchStats());
  }

  if (productId) {
    const product = getProductById(productId);
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });
    return NextResponse.json({ product });
  }

  if (eventId) {
    return NextResponse.json({ products: getProductsByEvent(eventId) });
  }

  return NextResponse.json({ products: getAllProducts() });
}
