import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/api/client";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ city: string }> }
) {
  const { city } = await params;
  const decodedCity = decodeURIComponent(city);
  const { searchParams } = req.nextUrl;

  try {
    const query = new URLSearchParams({ city: decodedCity, page_size: "50" });
    if (searchParams.get("category")) query.set("category", searchParams.get("category")!);
    if (searchParams.get("q")) query.set("q", searchParams.get("q")!);
    if (searchParams.get("startDate")) query.set("startDate", searchParams.get("startDate")!);
    if (searchParams.get("endDate")) query.set("endDate", searchParams.get("endDate")!);
    if (searchParams.get("page")) query.set("page", searchParams.get("page")!);
    if (searchParams.get("pageSize")) query.set("page_size", searchParams.get("pageSize")!);

    const res = await fetch(`${BACKEND_URL}/api/v1/events?${query}`, { cache: "no-store" });
    if (!res.ok) {
      return NextResponse.json({ success: true, data: [], pagination: { page: 1, pageCount: 1, total: 0 } });
    }
    const data = await res.json();
    return NextResponse.json({
      success: true,
      data: data.events ?? [],
      pagination: { page: data.page ?? 1, pageCount: data.page_count ?? 1, total: data.total ?? 0 },
    });
  } catch {
    return NextResponse.json({ success: false, error: "Backend unavailable" }, { status: 502 });
  }
}
