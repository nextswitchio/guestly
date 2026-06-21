import { NextRequest, NextResponse } from 'next/server';
import { assignTestVariant } from '@/lib/marketing';

export async function POST(
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
    const variant = assignTestVariant(id, userId);

    return NextResponse.json({ variant });
  } catch (error) {
    console.error('Error assigning test variant:', error);
    return NextResponse.json(
      { error: 'Failed to assign test variant' },
      { status: 500 }
    );
  }
}
