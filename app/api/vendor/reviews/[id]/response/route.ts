import { NextRequest, NextResponse } from "next/server";
import { fetchBackendJson } from "@/lib/api/proxy";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const { data, status, ok } = await fetchBackendJson(
      req,
      `/api/v1/vendors/reviews/${id}/response`,
      {
        method: "POST",
        body: JSON.stringify({ response: body.response }),
      },
    );
    if (!ok) return NextResponse.json(data, { status });
    return NextResponse.json({ review: data });
  } catch {
    return NextResponse.json({ error: "Failed to respond to review" }, { status: 500 });
  }
}
