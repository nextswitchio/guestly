import { NextRequest, NextResponse } from 'next/server';
import { getCohortAnalysis } from '@/lib/marketing';

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
    const cohortDate = searchParams.get('cohortDate');
    const acquisitionChannel = searchParams.get('acquisitionChannel') || undefined;

    if (!cohortDate) {
      return NextResponse.json(
        { error: 'Cohort date is required' },
        { status: 400 }
      );
    }

    const cohortAnalysis = getCohortAnalysis(userId, cohortDate, acquisitionChannel);

    return NextResponse.json(cohortAnalysis);
  } catch (error) {
    console.error('Error fetching cohort analysis:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cohort analysis' },
      { status: 500 }
    );
  }
}
