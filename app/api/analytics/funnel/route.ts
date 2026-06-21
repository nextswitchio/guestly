import { NextRequest, NextResponse } from 'next/server';
import { getFunnelAnalysis } from '@/lib/marketing';

export async function GET(req: NextRequest) {
  try {
    const userId = req.cookies.get('user_id')?.value;
    const role = req.cookies.get('role')?.value;

    if (!userId || role !== 'organiser') {
      return NextResponse.json(
        { error: 'Unauthorized - Organiser access required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const eventId = searchParams.get('eventId');

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: 'Start date and end date are required' },
        { status: 400 }
      );
    }

    const dateRange = {
      start: new Date(startDate).getTime(),
      end: new Date(endDate).getTime()
    };

    const funnelAnalysis = getFunnelAnalysis(eventId || userId);

    return NextResponse.json(funnelAnalysis);
  } catch (error) {
    console.error('Error fetching funnel analysis:', error);
    return NextResponse.json(
      { error: 'Failed to fetch funnel analysis' },
      { status: 500 }
    );
  }
}
