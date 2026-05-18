import { NextRequest, NextResponse } from "next/server";
import { createProductBundle, getEventBundles } from "@/lib/store";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: eventId } = await params;
  const bundles = getEventBundles(eventId);
  return NextResponse.json({ success: true, data: bundles });
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
    const { name, description, productIds, discountPercentage } = body;

    if (!name || !productIds || !Array.isArray(productIds) || productIds.length < 2) {
      return NextResponse.json(
        { success: false, error: "Name and at least 2 products required" },
        { status: 400 }
      );
    }

    const bundle = createProductBundle(eventId, name, description, productIds, discountPercentage || 0);
    return NextResponse.json({ success: true, data: bundle });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create bundle" },
      { status: 500 }
    );
  }
}
