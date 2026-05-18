import { NextRequest, NextResponse } from "next/server";
import { 
  getAdminUser, 
  updateUserRole, 
  updateUserStatus,
  getUserActivityStats,
  logAdminAction,
  type UserRole,
  type UserStatus
} from "@/lib/store";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check if user is admin
    const role = request.cookies.get('role')?.value;
    if (role !== 'admin') {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Admin access required' } },
        { status: 403 }
      );
    }

    const { id: userId } = await params;
    const user = getAdminUser(userId);
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'User not found' } },
        { status: 404 }
      );
    }

    // Get detailed activity stats
    const activityStats = getUserActivityStats(userId);

    return NextResponse.json({
      success: true,
      data: {
        user,
        activityStats
      }
    });

  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch user' } },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check if user is admin
    const role = request.cookies.get('role')?.value;
    const adminUserId = request.cookies.get('user_id')?.value;
    
    if (role !== 'admin' || !adminUserId) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Admin access required' } },
        { status: 403 }
      );
    }

    const { id: userId } = await params;
    const body = await request.json();
    const { role: newRole, status: newStatus } = body;

    let updatedUser = getAdminUser(userId);
    if (!updatedUser) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'User not found' } },
        { status: 404 }
      );
    }

    const originalRole = updatedUser.role;
    const originalStatus = updatedUser.status;

    // Update role if provided
    if (newRole && ['attendee', 'organizer', 'vendor', 'admin'].includes(newRole)) {
      updatedUser = updateUserRole(userId, newRole as UserRole);
      
      // Log role change
      if (originalRole !== newRole) {
        logAdminAction(
          adminUserId,
          'Admin User', // TODO: Get actual admin name
          'user_role_changed',
          'user',
          userId,
          { oldRole: originalRole, newRole },
          updatedUser?.displayName || updatedUser?.email || userId,
          request
        );
      }
    }

    // Update status if provided
    if (newStatus && ['active', 'suspended', 'pending', 'banned'].includes(newStatus)) {
      updatedUser = updateUserStatus(userId, newStatus as UserStatus);
      
      // Log status change
      if (originalStatus !== newStatus) {
        logAdminAction(
          adminUserId,
          'Admin User', // TODO: Get actual admin name
          'user_status_changed',
          'user',
          userId,
          { oldStatus: originalStatus, newStatus },
          updatedUser?.displayName || updatedUser?.email || userId,
          request
        );
      }
    }

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, error: { code: 'UPDATE_FAILED', message: 'Failed to update user' } },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedUser
    });

  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to update user' } },
      { status: 500 }
    );
  }
}