import { NextRequest, NextResponse } from 'next/server';
import { getABTestResults } from '@/lib/marketing';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = req.cookies.get('user_id')?.value;
    const role = req.cookies.get('role')?.value;

    if (!userId || role !== 'organiser') {
      return NextResponse.json(
        { error: 'Unauthorized - Organiser access required' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const results = getABTestResults(id);

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error getting A/B test results:', error);
    return NextResponse.json(
      { error: 'Failed to get A/B test results' },
      { status: 500 }
    );
  }
}
