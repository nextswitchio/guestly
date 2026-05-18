import { NextRequest, NextResponse } from "next/server";
import { apiCache } from "@/lib/cache";
import { createNoCacheResponse } from "@/lib/middleware/cache";

function isAdmin(req: NextRequest): boolean {
  const role = req.cookies.get("role")?.value;
  return role === "admin";
}

export async function GET(req: NextRequest) {
  // Only allow admin access
  if (!isAdmin(req)) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const stats = apiCache.getStats();
    const keys = apiCache.getKeys();
    
    // Get cache entry info for debugging
    const entries = keys.slice(0, 50).map(key => {
      const info = apiCache.getEntryInfo(key);
      return {
        key,
        ...info,
        isStale: info ? Date.now() - info.timestamp > info.staleTime : false,
        isExpired: info ? Date.now() - info.timestamp > info.ttl : false,
      };
    });
    
    const responseData = {
      ok: true,
      stats,
      totalKeys: keys.length,
      entries,
      timestamp: Date.now(),
    };
    
    // Don't cache this response
    return createNoCacheResponse(responseData);
  } catch (error) {
    console.error('Error fetching cache stats:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch cache stats' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  // Only allow admin access
  if (!isAdmin(req)) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get("key");
    const tag = searchParams.get("tag");
    const all = searchParams.get("all") === "true";
    
    let cleared = 0;
    
    if (all) {
      apiCache.clear();
      cleared = -1; // Indicate all cleared
    } else if (key) {
      cleared = apiCache.invalidate(key) ? 1 : 0;
    } else if (tag) {
      cleared = apiCache.invalidateByTag(tag);
    } else {
      return NextResponse.json(
        { ok: false, error: 'Must specify key, tag, or all=true' },
        { status: 400 }
      );
    }
    
    const responseData = {
      ok: true,
      cleared,
      message: all 
        ? 'All cache entries cleared'
        : `${cleared} cache entries cleared`,
    };
    
    return createNoCacheResponse(responseData);
  } catch (error) {
    console.error('Error clearing cache:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to clear cache' },
      { status: 500 }
    );
  }
}