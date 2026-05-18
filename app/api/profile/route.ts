import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const userId = req.cookies.get("user_id")?.value;
  const role = req.cookies.get("role")?.value;
  
  if (!userId) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Mock user profile data
    const profile = {
      id: userId,
      email: userId,
      name: role === 'organiser' ? 'Test Organiser' : 'Test Attendee',
      role,
      createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000, // 30 days ago
      eventsAttended: role === 'attendee' ? 5 : 0,
      eventsOrganized: role === 'organiser' ? 3 : 0
    };
    
    return NextResponse.json({
      success: true,
      data: profile
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}