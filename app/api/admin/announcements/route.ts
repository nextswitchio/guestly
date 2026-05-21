import { NextRequest, NextResponse } from "next/server";
import { 
  createAnnouncement,
  getAnnouncements,
  getAnnouncementStats,
  processScheduledAnnouncements,
  logAdminAction,
  type AnnouncementTargetType,
  type AnnouncementPriority,
  type AnnouncementStatus
} from "@/lib/store";

export async function GET(request: NextRequest) {
  try {
    // Check if user is admin
    const role = request.cookies.get('role')?.value;
    if (role !== 'admin') {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Admin access required' } },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as AnnouncementStatus | null;
    const targetType = searchParams.get('targetType') as AnnouncementTargetType | null;
    const priority = searchParams.get('priority') as AnnouncementPriority | null;
    const stats = searchParams.get('stats') === 'true';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    // Process any scheduled announcements that should be published
    processScheduledAnnouncements();

    // Return statistics if requested
    if (stats) {
      const statistics = getAnnouncementStats();
      return NextResponse.json({
        success: true,
        data: statistics
      });
    }

    // Get announcements with filters
    const offset = (page - 1) * limit;
    const announcements = getAnnouncements({
      status: status || undefined,
      targetType: targetType || undefined,
      priority: priority || undefined,
      limit,
      offset,
    });

    // Get total count for pagination (without limit/offset)
    const totalAnnouncements = getAnnouncements({
      status: status || undefined,
      targetType: targetType || undefined,
      priority: priority || undefined,
    });

    return NextResponse.json({
      success: true,
      data: {
        announcements,
        pagination: {
          page,
          limit,
          total: totalAnnouncements.length,
          totalPages: Math.ceil(totalAnnouncements.length / limit),
          hasNext: offset + limit < totalAnnouncements.length,
          hasPrev: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Error fetching announcements:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch announcements' } },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check if user is admin
    const role = request.cookies.get('role')?.value;
    const userId = request.cookies.get('user_id')?.value;
    const adminName = request.cookies.get('admin_name')?.value || 'Admin User';
    
    if (role !== 'admin' || !userId) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Admin access required' } },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { title, content, targetType, priority, scheduledAt, expiresAt } = body;

    // Validate required fields
    if (!title || !content || !targetType || !priority) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Missing required fields' } },
        { status: 400 }
      );
    }

    // Validate target type
    const validTargetTypes: AnnouncementTargetType[] = ['all', 'attendee', 'organiser', 'vendor'];
    if (!validTargetTypes.includes(targetType)) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid target type' } },
        { status: 400 }
      );
    }

    // Validate priority
    const validPriorities: AnnouncementPriority[] = ['low', 'medium', 'high', 'urgent'];
    if (!validPriorities.includes(priority)) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid priority' } },
        { status: 400 }
      );
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

    // Create the announcement
    const announcement = createAnnouncement({
      title,
      content,
      targetType,
      priority,
      scheduledAt,
      expiresAt,
      createdBy: userId,
    });

    // Log the announcement creation
    logAdminAction(
      userId,
      adminName,
      'announcement_created',
      'announcement',
      announcement.id,
      { 
        title,
        targetType,
        priority,
        scheduledAt: scheduledAt || null,
        expiresAt: expiresAt || null
      },
      title,
      request
    );

    return NextResponse.json({
      success: true,
      data: announcement
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating announcement:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to create announcement' } },
      { status: 500 }
    );
  }
}
