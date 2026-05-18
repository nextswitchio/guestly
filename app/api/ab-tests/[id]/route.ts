import { NextRequest, NextResponse } from 'next/server';
import { getABTest } from '@/lib/marketing';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = req.cookies.get('user_id')?.value;

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const abTest = getABTest(id);

    if (!abTest) {
      return NextResponse.json(
        { error: 'A/B test not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(abTest);
  } catch (error) {
    console.error('Error getting A/B test:', error);
    return NextResponse.json(
      { error: 'Failed to get A/B test' },
      { status: 500 }
    );
  }
}
