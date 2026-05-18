import { NextRequest, NextResponse } from "next/server";
import { 
  getAnnouncement,
  recordAnnouncementView,
  dismissAnnouncement
} from "@/lib/store";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = request.cookies.get('user_id')?.value;
    const role = request.cookies.get('role')?.value;

    if (!userId || !role) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { action } = body;

    // Check if announcement exists
    const announcement = getAnnouncement(id);
    if (!announcement) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Announcement not found' } },
        { status: 404 }
      );
    }

    // Check if user can see this announcement
    const canView = announcement.targetType === 'all' || announcement.targetType === role;
    if (!canView) {
      return NextResponse.json(
        { success: false, error: { code: 'FORBIDDEN', message: 'Not authorized to view this announcement' } },
        { status: 403 }
      );
    }

    let result;
    switch (action) {
      case 'view':
        result = recordAnnouncementView(userId, id);
        break;
      case 'dismiss':
        result = dismissAnnouncement(userId, id);
        break;
      default:
        return NextResponse.json(
          { success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid action. Use "view" or "dismiss"' } },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Error processing announcement action:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to process announcement action' } },
      { status: 500 }
    );
  }
}