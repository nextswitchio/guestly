import { NextRequest, NextResponse } from 'next/server';
import { trackAttribution } from '@/lib/marketing';

export async function POST(req: NextRequest) {
  try {
    const userId = req.cookies.get('user_id')?.value;
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { source, medium, campaign, content, term, sessionId, landingPage } = body;

    if (!source || !medium) {
      return NextResponse.json(
        { error: 'Source and medium are required' },
        { status: 400 }
      );
    }

    trackAttribution(userId, sessionId || userId, {
      source,
      medium,
      campaign: campaign || '',
      content,
      term,
      landingPage: landingPage || '/'
    });

    return NextResponse.json({
      success: true,
      message: 'Attribution tracked successfully'
    });
  } catch (error) {
    console.error('Error tracking attribution:', error);
    return NextResponse.json(
      { error: 'Failed to track attribution' },
      { status: 500 }
    );
  }
}
