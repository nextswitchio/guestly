import { NextRequest, NextResponse } from "next/server";

// Simple in-memory cart storage
const userCarts: Record<string, any[]> = {};

export async function POST(req: NextRequest) {
  const userId = req.cookies.get("user_id")?.value;
  
  if (!userId) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { type, productId, quantity, variant } = body;
    
    if (!userCarts[userId]) {
      userCarts[userId] = [];
    }
    
    const cartItem = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      productId,
      quantity,
      variant,
      addedAt: Date.now()
    };
    
    userCarts[userId].push(cartItem);
    
    return NextResponse.json({
      success: true,
      data: cartItem
    });
  } catch (error) {
    console.error('Error adding to cart:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add to cart' },
      { status: 500 }
    );
  }
}