import { NextRequest, NextResponse } from 'next/server';
import { trackEmailOpen } from '@/lib/marketing';

// POST /api/email/track/open - Track email open
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // Validate required fields
    if (!data.emailId || !data.recipientId) {
      return NextResponse.json(
        { error: 'Missing required fields: emailId, recipientId' },
        { status: 400 }
      );
    }

    trackEmailOpen(data.emailId, data.recipientId);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error tracking email open:', error);
    return NextResponse.json(
      { error: 'Failed to track email open' },
      { status: 500 }
    );
  }
}

// GET /api/email/track/open - Track email open via tracking pixel
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const emailId = searchParams.get('emailId');
    const recipientId = searchParams.get('recipientId');

    if (!emailId || !recipientId) {
      // Return 1x1 transparent pixel even on error to avoid broken images
      const pixel = Buffer.from(
        'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
        'base64'
      );
      return new NextResponse(pixel, {
        status: 200,
        headers: {
          'Content-Type': 'image/gif',
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      });
    }

    trackEmailOpen(emailId, recipientId);

    // Return 1x1 transparent tracking pixel
    const pixel = Buffer.from(
      'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
      'base64'
    );

    return new NextResponse(pixel, {
      status: 200,
      headers: {
        'Content-Type': 'image/gif',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    console.error('Error tracking email open:', error);
    // Still return pixel to avoid broken images
    const pixel = Buffer.from(
      'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
      'base64'
    );
    return new NextResponse(pixel, {
      status: 200,
      headers: {
        'Content-Type': 'image/gif',
      },
    });
  }
}
