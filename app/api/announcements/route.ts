import { NextRequest, NextResponse } from "next/server";
import { 
  getActiveAnnouncementsForUser,
  getUnreadAnnouncementsForUser,
  recordAnnouncementView,
  dismissAnnouncement
} from "@/lib/store";

export async function GET(request: NextRequest) {
  try {
    const userId = request.cookies.get('user_id')?.value;
    const role = request.cookies.get('role')?.value;

    if (!userId || !role) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const unreadOnly = searchParams.get('unread') === 'true';

    let announcements;
    if (unreadOnly) {
      announcements = getUnreadAnnouncementsForUser(userId, role);
    } else {
      announcements = getActiveAnnouncementsForUser(role);
    }

    return NextResponse.json({
      success: true,
      data: { announcements }
    });

  } catch (error) {
    console.error('Error fetching announcements:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch announcements' } },
      { status: 500 }
    );
  }
}