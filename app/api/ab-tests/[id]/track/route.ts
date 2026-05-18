import { NextRequest, NextResponse } from 'next/server';
import { trackTestConversion } from '@/lib/marketing';

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
    const body = await req.json();
    const { variantId, revenue = 0 } = body;

    if (!variantId) {
      return NextResponse.json(
        { error: 'Missing required field: variantId' },
        { status: 400 }
      );
    }

    trackTestConversion(id, variantId, revenue);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking test conversion:', error);
    return NextResponse.json(
      { error: 'Failed to track test conversion' },
      { status: 500 }
    );
  }
}
