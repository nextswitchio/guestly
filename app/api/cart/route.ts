import { NextRequest, NextResponse } from "next/server";

// Simple in-memory cart storage (in production, this would be in a database or session)
const userCarts: Record<string, any[]> = {};

export async function GET(req: NextRequest) {
  const userId = req.cookies.get("user_id")?.value;
  
  if (!userId) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const cart = userCarts[userId] || [];
    
    return NextResponse.json({
      success: true,
      data: cart
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch cart' },
      { status: 500 }
    );
  }
}