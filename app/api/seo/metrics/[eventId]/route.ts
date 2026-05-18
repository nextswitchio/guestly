import { NextRequest, NextResponse } from 'next/server';
import { getSEOMetrics, updateSEOMetrics } from '@/lib/marketing';

/**
 * GET /api/seo/metrics/[eventId]
 * Get SEO performance metrics for an event
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params;
    
    const metrics = getSEOMetrics(eventId);
    
    if (!metrics) {
      return NextResponse.json(
        { error: 'No SEO metrics found for this event' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(metrics);
  } catch (error) {
    console.error('[SEO Metrics API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve SEO metrics' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/seo/metrics/[eventId]
 * Update SEO metrics for an event (from search console data)
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params;
    const body = await req.json();
    
    const { impressions, clicks, averagePosition, topQueries } = body;
    
    if (typeof impressions !== 'number' || typeof clicks !== 'number' || typeof averagePosition !== 'number') {
      return NextResponse.json(
        { error: 'Invalid metrics data. Required: impressions, clicks, averagePosition' },
        { status: 400 }
      );
    }
    
    const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
    
    const metrics = updateSEOMetrics(eventId, {
      impressions,
      clicks,
      averagePosition,
      ctr,
      topQueries: topQueries || [],
    });
    
    return NextResponse.json(metrics);
  } catch (error) {
    console.error('[SEO Metrics API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to update SEO metrics' },
      { status: 500 }
    );
  }
}
