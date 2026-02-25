import { NextRequest, NextResponse } from "next/server";
import { listVendors, VendorProfile } from "@/lib/store";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const cat = searchParams.get("category");
  const category = (cat || undefined) as VendorProfile["category"] | undefined;
  const q = searchParams.get("q") || undefined;
  const data = listVendors({ category, q });
  return NextResponse.json({ ok: true, data });
}
