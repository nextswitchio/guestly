import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api/client";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ vendorId: string }> }
) {
  try {
    const { vendorId } = await params;
    const res = await fetch(`${BACKEND_URL}/api/v1/vendors/${vendorId}`);

    if (!res.ok) {
      return NextResponse.json({ error: "Vendor not found" }, { status: 404 });
    }

    const vendor = await res.json();
    return NextResponse.json({ success: true, data: { vendor } });
  } catch {
    return NextResponse.json({ error: "Failed to fetch vendor" }, { status: 500 });
  }
}
