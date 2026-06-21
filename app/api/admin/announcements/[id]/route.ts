import { NextRequest, NextResponse } from "next/server";
import { 
  getAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  getAnnouncementStats,
  type AnnouncementTargetType,
  type AnnouncementPriority,
  type AnnouncementStatus
} from "@/lib/store";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Validate token exists - backend will handle role validation via JWT
    const token = request.cookies.get('access_token')?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }

    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const includeStats = searchParams.get('stats') === 'true';

    const announcement = getAnnouncement(id);
    if (!announcement) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Announcement not found' } },
        { status: 404 }
      );
    }

    let responseData: any = { announcement };

    // Include statistics if requested
    if (includeStats) {
      const stats = getAnnouncementStats(id);
      responseData.stats = stats.viewsByAnnouncement;
    }

    return NextResponse.json({
      success: true,
      data: responseData
    });

  } catch (error) {
    console.error('Error fetching announcement:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch announcement' } },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Check if user is admin
    const role = request.cookies.get('role')?.value;
    if (role !== 'admin') {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Admin access required' } },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { title, content, targetType, priority, status, scheduledAt, expiresAt } = body;

    // Check if announcement exists
    const existingAnnouncement = getAnnouncement(id);
    if (!existingAnnouncement) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Announcement not found' } },
        { status: 404 }
      );
    }

    // Validate target type (if provided)
    if (targetType) {
      const validTargetTypes: AnnouncementTargetType[] = ['all', 'attendee', 'organiser', 'vendor'];
      if (!validTargetTypes.includes(targetType)) {
        return NextResponse.json(
          { success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid target type' } },
          { status: 400 }
        );
      }
    }

    // Validate priority (if provided)
    if (priority) {
      const validPriorities: AnnouncementPriority[] = ['low', 'medium', 'high', 'urgent'];
      if (!validPriorities.includes(priority)) {
        return NextResponse.json(
          { success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid priority' } },
          { status: 400 }
        );
      }
    }

    // Validate status (if provided)
    if (status) {
      const validStatuses: AnnouncementStatus[] = ['draft', 'scheduled', 'published', 'expired'];
      if (!validStatuses.includes(status)) {
        return NextResponse.json(
          { success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid status' } },
          { status: 400 }
        );
      }
    }

    // Validate scheduled date (if provided)
    if (scheduledAt && scheduledAt < Date.now()) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Scheduled time must be in the future' } },
        { status: 400 }
      );
    }

    // Validate expiration date (if provided)
    if (expiresAt && expiresAt < Date.now()) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Expiration time must be in the future' } },
        { status: 400 }
      );
    }

    // Prepare updates object
    const updates: any = {};
    if (title !== undefined) updates.title = title;
    if (content !== undefined) updates.content = content;
    if (targetType !== undefined) updates.targetType = targetType;
    if (priority !== undefined) updates.priority = priority;
    if (status !== undefined) updates.status = status;
    if (scheduledAt !== undefined) updates.scheduledAt = scheduledAt;
    if (expiresAt !== undefined) updates.expiresAt = expiresAt;

    // Handle status changes
    if (status === 'published' && existingAnnouncement.status !== 'published') {
      updates.publishedAt = Date.now();
    }

    const updatedAnnouncement = updateAnnouncement(id, updates);

    return NextResponse.json({
      success: true,
      data: updatedAnnouncement
    });

  } catch (error) {
    console.error('Error updating announcement:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to update announcement' } },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Check if user is admin
    const role = request.cookies.get('role')?.value;
    if (role !== 'admin') {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Admin access required' } },
        { status: 403 }
      );
    }

    const deleted = deleteAnnouncement(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Announcement not found' } },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { message: 'Announcement deleted successfully' }
    });

  } catch (error) {
    console.error('Error deleting announcement:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to delete announcement' } },
      { status: 500 }
    );
  }
}