import { NextRequest, NextResponse } from 'next/server';
import { getSocialMetrics } from '@/lib/marketing';

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
    const metrics = getSocialMetrics(id);

    if (!metrics) {
      return NextResponse.json(
        { error: 'Social post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      metrics,
    });
  } catch (error) {
    console.error('Error getting social metrics:', error);
    return NextResponse.json(
      { error: 'Failed to get social metrics' },
      { status: 500 }
    );
  }
}
