import { NextRequest, NextResponse } from "next/server";
import { CacheHelpers } from "@/lib/cache";
import { createConditionalResponse, CacheConfigs } from "@/lib/middleware/cache";

export async function GET(req: NextRequest) {
  const access = req.cookies.get("access_token")?.value;
  const role = req.cookies.get("role")?.value;
  const userId = req.cookies.get("user_id")?.value;
  
  if (!access || !role) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  
  try {
    // Cache user profile data
    const userData = await CacheHelpers.cacheUserProfile(
      userId!,
      () => ({ ok: true, role, userId })
    );
    
    // Return cached response with appropriate headers for private data
    return createConditionalResponse(req, userData, {
      ...CacheConfigs.userProfile,
      generateETag: true,
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch user profile' },
      { status: 500 }
    );
  }
}
