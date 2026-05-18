import { NextRequest, NextResponse } from 'next/server';
import { getSEOChecklist } from '@/lib/marketing';

/**
 * GET /api/seo/checklist/[eventId]
 * Get SEO checklist for an event
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params;
    
    const checklist = getSEOChecklist(eventId);
    
    return NextResponse.json(checklist);
  } catch (error) {
    console.error('[SEO Checklist API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate SEO checklist' },
      { status: 500 }
    );
  }
}
