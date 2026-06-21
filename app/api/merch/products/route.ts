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
        const res = await fetch(`${BACKEND_URL}/api/v1/merch/products/${id}`);
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
