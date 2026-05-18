import { NextRequest, NextResponse } from "next/server";
import { apiCache } from "@/lib/cache";
import { createNoCacheResponse } from "@/lib/middleware/cache";

function isAdmin(req: NextRequest): boolean {
  const role = req.cookies.get("role")?.value;
  return role === "admin";
}

export async function POST(req: NextRequest) {
  // Only allow admin access
  if (!isAdmin(req)) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const statsBefore = apiCache.getStats();
    const cleaned = apiCache.cleanup();
    const statsAfter = apiCache.getStats();
    
    const responseData = {
      ok: true,
      cleaned,
      statsBefore,
      statsAfter,
      message: `Cleaned up ${cleaned} expired cache entries`,
    };
    
    return createNoCacheResponse(responseData);
  } catch (error) {
    console.error('Error cleaning up cache:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to cleanup cache' },
      { status: 500 }
    );
  }
}