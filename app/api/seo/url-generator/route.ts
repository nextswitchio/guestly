import { NextRequest, NextResponse } from 'next/server';
import { generateSEOFriendlyURL } from '@/lib/marketing';

/**
 * POST /api/seo/url-generator
 * Generate SEO-friendly URL from event name, city, and date
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { eventName, city, date } = body;
    
    if (!eventName || !city || !date) {
      return NextResponse.json(
        { error: 'Missing required fields: eventName, city, date' },
        { status: 400 }
      );
    }
    
    const url = generateSEOFriendlyURL(eventName, city, date);
    
    return NextResponse.json({ url, slug: url });
  } catch (error) {
    console.error('[SEO URL Generator API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate SEO-friendly URL' },
      { status: 500 }
    );
  }
}
