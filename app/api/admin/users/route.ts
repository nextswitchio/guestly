import { NextRequest, NextResponse } from "next/server";
import { 
  getAllAdminUsers, 
  searchUsers, 
  filterUsersByRole, 
  filterUsersByStatus,
  getUserStatistics,
  type UserRole,
  type UserStatus
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
    const search = searchParams.get('search');
    const roleFilter = searchParams.get('role') as UserRole | null;
    const statusFilter = searchParams.get('status') as UserStatus | null;
    const stats = searchParams.get('stats') === 'true';

    // Return statistics if requested
    if (stats) {
      const statistics = getUserStatistics();
      return NextResponse.json({
        success: true,
        data: statistics
      });
    }

    let users = getAllAdminUsers();

    // Apply search filter
    if (search) {
      users = searchUsers(search);
    }

    // Apply role filter
    if (roleFilter) {
      users = users.filter(user => user.role === roleFilter);
    }

    // Apply status filter
    if (statusFilter) {
      users = users.filter(user => user.status === statusFilter);
    }

    // Pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedUsers = users.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: {
        users: paginatedUsers,
        pagination: {
          page,
          limit,
          total: users.length,
          totalPages: Math.ceil(users.length / limit),
          hasNext: endIndex < users.length,
          hasPrev: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch users' } },
      { status: 500 }
    );
  }
}