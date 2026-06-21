import { NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api/client";

export async function GET() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/v1/featured/settings`, { cache: "no-store" });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json({ fee_per_hour: 5000, currency: "NGN" });
  }
}
