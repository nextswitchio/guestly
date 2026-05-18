import { NextRequest, NextResponse } from 'next/server';
import { 
  getAllEventsWithPerformance, 
  getEventPerformanceSummary,
  type EventPerformanceFilters,
  type EventPerformanceSortBy,
  type SortOrder
} from '@/lib/store';

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
    
    // Check if requesting a specific event
    const eventId = searchParams.get('eventId');
    if (eventId) {
      // Get specific event performance data
      const { events } = getAllEventsWithPerformance({}, 'date', 'desc', 1, 1000);
      const event = events.find(e => e.id === eventId);
      
      if (!event) {
        return NextResponse.json(
          { success: false, error: { code: 'NOT_FOUND', message: 'Event not found' } },
          { status: 404 }
        );
      }
      
      return NextResponse.json({
        success: true,
        data: {
          events: [event],
          total: 1,
          page: 1,
          pageSize: 1,
          totalPages: 1,
        }
      });
    }
    
    // Parse filters
    const filters: EventPerformanceFilters = {};
    if (searchParams.get('status')) filters.status = searchParams.get('status') as any;
    if (searchParams.get('category')) filters.category = searchParams.get('category')!;
    if (searchParams.get('city')) filters.city = searchParams.get('city')!;
    if (searchParams.get('country')) filters.country = searchParams.get('country')!;
    if (searchParams.get('eventType')) filters.eventType = searchParams.get('eventType') as any;
    if (searchParams.get('dateFrom')) filters.dateFrom = searchParams.get('dateFrom')!;
    if (searchParams.get('dateTo')) filters.dateTo = searchParams.get('dateTo')!;
    
    // Parse sorting
    const sortBy = (searchParams.get('sortBy') as EventPerformanceSortBy) || 'date';
    const sortOrder = (searchParams.get('sortOrder') as SortOrder) || 'desc';
    
    // Parse pagination
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');
    
    // Get events with performance data
    const performanceData = getAllEventsWithPerformance(filters, sortBy, sortOrder, page, pageSize);
    
    // Get summary statistics
    const summary = getEventPerformanceSummary();

    return NextResponse.json({
      success: true,
      data: {
        ...performanceData,
        summary,
      }
    });
  } catch (error) {
    console.error('Error fetching event performance data:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'INTERNAL_ERROR', 
          message: 'Failed to fetch event performance data' 
        } 
      },
      { status: 500 }
    );
  }
}