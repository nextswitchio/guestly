import { NextRequest, NextResponse } from 'next/server';
import { BACKEND_URL } from '@/lib/api/client';

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

    // Parse pagination
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = parseInt(searchParams.get('pageSize') || '20');
  
  // Build query params for backend API
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('page_size', pageSize.toString());
  
  if (searchParams.get('status')) {
    params.append('status_filter', searchParams.get('status')!);
  }
  
  // Sorting parameters
  if (searchParams.get('sortBy')) {
    params.append('sort_by', searchParams.get('sortBy')!);
  }
  if (searchParams.get('sortOrder')) {
    params.append('sort_order', searchParams.get('sortOrder')!);
  }

  // Fetch from backend API
  // Extract access token from cookies
  const cookieHeader = request.headers.get('cookie') || '';
  const accessToken = cookieHeader.split(';').find(c => c.trim().startsWith('access_token='))?.split('=')[1];
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }
  
  const backendResponse = await fetch(`${BACKEND_URL}/api/v1/admin/events?${params}`, {
    headers,
  });
  
  if (!backendResponse.ok) {
    const errorData = await backendResponse.json().catch(() => ({ detail: 'Unknown error' }));
    console.error('Backend API error:', errorData);
    return NextResponse.json({
      success: false,
      error: {
        code: 'BACKEND_ERROR',
        message: errorData.detail || `Backend API returned ${backendResponse.status}`,
        status: backendResponse.status,
      }
    }, { status: backendResponse.status });
  }
  
  const backendData = await backendResponse.json();
  
  // Map backend response to frontend format
  const events = backendData.events.map((event: any) => ({
    id: event.id.toString() || event.id,
    title: event.title,
    date: event.date,
    category: event.category,
    city: event.city,
    country: event.country,
    eventType: event.event_type || event.eventType || 'Physical',
    status: mapEventStatus(event.status),
    ticketsSold: event.tickets_sold || 0,
    totalTickets: event.capacity || 0,
    revenue: event.total_revenue || 0,
    orders: event.unique_orders || 0,
    conversionRate: 0,
    averageOrderValue: event.unique_orders > 0 ? (event.total_revenue || 0) / event.unique_orders : 0,
    attendanceRate: undefined,
    createdAt: new Date(event.created_at || event.date).getTime(),
  }));
  
  // Compute summary for the component
  const totalEvents = events.length;
  const totalRevenue = events.reduce((sum, e) => sum + (e.revenue || 0), 0);
  const totalTicketsSold = events.reduce((sum, e) => sum + (e.ticketsSold || 0), 0);
  const summary = {
    totalEvents,
    totalRevenue,
    totalTicketsSold,
    averageTicketsPerEvent: totalEvents > 0 ? totalTicketsSold / totalEvents : 0,
    averageRevenuePerEvent: totalEvents > 0 ? totalRevenue / totalEvents : 0,
    topPerformingCategory: 'N/A',
    topPerformingCity: 'N/A',
  };

  return NextResponse.json({
    success: true,
    events,
    summary,
    total: backendData.total || backendData.events.length,
    page: backendData.page || 1,
    pageSize: backendData.pageSize || backendData.page_size || pageSize,
    totalPages: backendData.totalPages || backendData.page_count || 1,
  });
  } catch (error) {
    console.error('Error in admin events performance route:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error instanceof Error ? error.message : 'Failed to fetch events',
        }
      },
      { status: 500 }
    );
  }
}

function mapEventStatus(status: string): 'upcoming' | 'ongoing' | 'completed' | 'cancelled' {
  const statusMap: Record<string, 'upcoming' | 'ongoing' | 'completed' | 'cancelled'> = {
    'draft': 'upcoming',
    'published': 'upcoming',
    'ongoing': 'ongoing',
    'completed': 'completed',
    'cancelled': 'cancelled',
  };
  return statusMap[status?.toLowerCase() || 'published'] || 'upcoming';
}
