import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api/client";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ city: string }> }
) {
  const { city } = await params;
  const { searchParams } = req.nextUrl;
  const subPath = searchParams.get("sub") || "stats";

  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/community/cities/${city}/${subPath}`);
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: "Backend unavailable" }, { status: 503 });
  }
}
