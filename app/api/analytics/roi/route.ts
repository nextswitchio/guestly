import { NextRequest, NextResponse } from 'next/server';
import { generateROIReport } from '@/lib/marketing';

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
    const campaignId = searchParams.get('campaignId');

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

    const roiReport = generateROIReport(userId, dateRange);

    return NextResponse.json(roiReport);
  } catch (error) {
    console.error('Error generating ROI report:', error);
    return NextResponse.json(
      { error: 'Failed to generate ROI report' },
      { status: 500 }
    );
  }
}
