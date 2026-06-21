import { NextRequest, NextResponse } from "next/server";

function readCart(req: NextRequest, userId: string): any[] {
  const raw = req.cookies.get("cart")?.value;
  if (!raw) return [];
  try {
    const parsed = JSON.parse(decodeURIComponent(raw));
    if (Array.isArray(parsed)) return parsed;
    const userCart = parsed?.[userId];
    return Array.isArray(userCart) ? userCart : [];
  } catch {
    return [];
  }
}

export async function GET(req: NextRequest) {
  const userId = req.cookies.get("user_id")?.value;
  
  if (!userId) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const cart = readCart(req, userId);
    
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
