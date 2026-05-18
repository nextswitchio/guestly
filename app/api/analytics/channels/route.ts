import { NextRequest, NextResponse } from 'next/server';
import { getChannelPerformance } from '@/lib/marketing';

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

    const channelPerformance = getChannelPerformance(userId, dateRange);

    return NextResponse.json(channelPerformance);
  } catch (error) {
    console.error('Error fetching channel performance:', error);
    return NextResponse.json(
      { error: 'Failed to fetch channel performance' },
      { status: 500 }
    );
  }
}
