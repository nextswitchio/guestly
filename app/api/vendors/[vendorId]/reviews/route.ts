import { NextRequest, NextResponse } from "next/server";
import { fetchBackendJson } from "@/lib/api/proxy";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ vendorId: string }> },
) {
  try {
    const { vendorId } = await params;
    const { data, status, ok } = await fetchBackendJson(req, `/api/v1/vendors/${vendorId}/reviews`);
    if (!ok) return NextResponse.json(data, { status });
    return NextResponse.json({ reviews: Array.isArray(data) ? data : [] });
  } catch {
    return NextResponse.json({ error: "Failed to fetch vendor reviews" }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ vendorId: string }> },
) {
  try {
    const { vendorId } = await params;
    const body = await req.json().catch(() => ({}));
    const { data, status, ok } = await fetchBackendJson(
      req,
      `/api/v1/vendors/${vendorId}/reviews`,
      {
        method: "POST",
        body: JSON.stringify({
          event_id: body.eventId || body.event_id,
          rating: body.rating,
          comment: body.comment,
        }),
      },
    );
    if (!ok) return NextResponse.json(data, { status });
    return NextResponse.json({ review: data }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create vendor review" }, { status: 500 });
  }
}
