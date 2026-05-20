import { NextRequest, NextResponse } from "next/server";
import { fetchBackendJson } from "@/lib/api/proxy";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const eventId = id;
  
  try {
    const { data, status, ok } = await fetchBackendJson(req, `/api/v1/merchandise/events/${eventId}/products`);
    if (!ok) return NextResponse.json(data, { status });
    
    return NextResponse.json({
      success: true,
      data: data?.products || []
    });
  } catch (error) {
    console.error('Error fetching merchandise:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch merchandise' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const userId = req.cookies.get("user_id")?.value;
  const role = req.cookies.get("role")?.value;
  const eventId = id;
  
  if (!userId || role !== "organiser") {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const products = Array.isArray(body.products) ? body.products : [body];
    const created = [];

    for (const product of products) {
      const { data, status, ok } = await fetchBackendJson(
        req,
        `/api/v1/merchandise/events/${eventId}/products`,
        { method: "POST", body: JSON.stringify(product) },
      );
      if (!ok) return NextResponse.json(data, { status });
      created.push(data);
    }

    return NextResponse.json({
      success: true,
      data: { eventId, products: created }
    });
  } catch (error) {
    console.error('Error adding merchandise:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add merchandise' },
      { status: 500 }
    );
  }
}
