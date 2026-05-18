import { NextRequest, NextResponse } from 'next/server';
import { getBlogPostMetrics } from '@/lib/marketing';

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
    const metrics = getBlogPostMetrics(id);

    return NextResponse.json(metrics);
  } catch (error) {
    console.error('Error getting blog post metrics:', error);
    return NextResponse.json(
      { error: 'Failed to get blog post metrics' },
      { status: 500 }
    );
  }
}
