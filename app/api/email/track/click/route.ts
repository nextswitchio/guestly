import { NextRequest, NextResponse } from 'next/server';
import { trackEmailClick } from '@/lib/marketing';

// POST /api/email/track/click - Track email click
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // Validate required fields
    if (!data.emailId || !data.recipientId || !data.linkId) {
      return NextResponse.json(
        { error: 'Missing required fields: emailId, recipientId, linkId' },
        { status: 400 }
      );
    }

    trackEmailClick(data.emailId, data.recipientId);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error tracking email click:', error);
    return NextResponse.json(
      { error: 'Failed to track email click' },
      { status: 500 }
    );
  }
}

// GET /api/email/track/click - Track email click via redirect
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const emailId = searchParams.get('emailId');
    const recipientId = searchParams.get('recipientId');
    const linkId = searchParams.get('linkId');
    const url = searchParams.get('url');

    if (!emailId || !recipientId || !linkId || !url) {
      return NextResponse.json(
        { error: 'Missing required parameters: emailId, recipientId, linkId, url' },
        { status: 400 }
      );
    }

    // Track the click
    trackEmailClick(emailId, recipientId);

    // Redirect to the actual URL
    return NextResponse.redirect(url, 302);
  } catch (error) {
    console.error('Error tracking email click:', error);
    // If tracking fails, still try to redirect if URL is available
    const { searchParams } = new URL(req.url);
    const url = searchParams.get('url');
    if (url) {
      return NextResponse.redirect(url, 302);
    }
    return NextResponse.json(
      { error: 'Failed to track email click' },
      { status: 500 }
    );
  }
}
