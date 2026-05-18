import { NextRequest, NextResponse } from 'next/server';
import { selectWinningVariant } from '@/lib/marketing';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const organizerId = req.cookies.get('user_id')?.value;
    const role = req.cookies.get('role')?.value;

    if (!organizerId || role !== 'organiser') {
      return NextResponse.json(
        { error: 'Unauthorized - Organiser access required' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const winner = selectWinningVariant(id);

    return NextResponse.json({ winner });
  } catch (error) {
    console.error('Error selecting winning variant:', error);
    return NextResponse.json(
      { error: 'Failed to select winning variant' },
      { status: 500 }
    );
  }
}
