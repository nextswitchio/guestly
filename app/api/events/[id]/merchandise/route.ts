import { NextRequest, NextResponse } from "next/server";
import { getProductsByEvent } from "@/lib/store";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const eventId = id;
  
  try {
    const products = getProductsByEvent(eventId);
    
    return NextResponse.json({
      success: true,
      data: products || []
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
    const { products } = body;
    
    // Mock adding merchandise products
    return NextResponse.json({
      success: true,
      data: { eventId, products }
    });
  } catch (error) {
    console.error('Error adding merchandise:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add merchandise' },
      { status: 500 }
    );
  }
}