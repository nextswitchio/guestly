import { NextRequest, NextResponse } from "next/server";
import { getUserOrders } from "@/lib/store";
import { CacheHelpers, CacheKeys } from "@/lib/cache";
import { createConditionalResponse, CacheConfigs } from "@/lib/middleware/cache";

function userId(req: NextRequest) {
  return req.cookies.get("user_id")?.value;
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  const requestingUserId = userId(req);
  const { userId: targetUserId } = await params;
  
  // Only allow users to access their own orders
  if (!requestingUserId || requestingUserId !== targetUserId) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    // Cache user orders with appropriate tags
    const orders = await CacheHelpers.cacheUserProfile(
      targetUserId,
      () => getUserOrders(targetUserId),
      {
        ttl: 2 * 60 * 1000, // 2 minutes for orders (they change frequently)
        staleTime: 30 * 1000, // 30 seconds stale time
      }
    );
    
    const responseData = { ok: true, orders };
    
    // Return cached response with private cache headers
    return createConditionalResponse(req, responseData, {
      ...CacheConfigs.userProfile,
      maxAge: 120, // 2 minutes for orders
      staleWhileRevalidate: 30, // 30 seconds
      generateETag: true,
    });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}