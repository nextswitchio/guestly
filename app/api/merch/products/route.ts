import { NextRequest, NextResponse } from "next/server";
import { getProductById } from "@/lib/store";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const ids = searchParams.get("ids");

    if (!ids) {
      return NextResponse.json(
        { success: false, error: "Product IDs required" },
        { status: 400 }
      );
    }

    const productIds = ids.split(",");
    const products = productIds
      .map(id => getProductById(id))
      .filter(p => p !== null);

    return NextResponse.json({
      success: true,
      products,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch products" },
      { status: 500 }
    );
  }
}
