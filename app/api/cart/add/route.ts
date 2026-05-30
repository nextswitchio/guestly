import { NextRequest, NextResponse } from "next/server";

function readCartStore(req: NextRequest, userId: string): Record<string, any[]> {
  const raw = req.cookies.get("cart")?.value;
  if (!raw) return {};
  try {
    const parsed = JSON.parse(decodeURIComponent(raw));
    if (Array.isArray(parsed)) return { [userId]: parsed };
    return parsed && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

export async function POST(req: NextRequest) {
  const userId = req.cookies.get("user_id")?.value;
  
  if (!userId) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { type, productId, quantity, variant } = body;
    
    const cartItem = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      type,
      productId,
      quantity,
      variant,
      addedAt: Date.now()
    };

    const cartStore = readCartStore(req, userId);
    cartStore[userId] = [...(cartStore[userId] || []), cartItem];
    const response = NextResponse.json({
      success: true,
      data: cartItem
    });
    response.cookies.set("cart", encodeURIComponent(JSON.stringify(cartStore)), {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    });
    
    return response;
  } catch (error) {
    console.error('Error adding to cart:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add to cart' },
      { status: 500 }
    );
  }
}
