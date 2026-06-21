import { NextRequest, NextResponse } from 'next/server';
import { registerAffiliate } from '@/lib/marketing';

export async function POST(req: NextRequest) {
  try {
    const userId = req.cookies.get('user_id')?.value;

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in.' },
        { status: 401 }
      );
    }

    const data = await req.json();

    // Validate required fields
    if (!data.businessName || !data.email || !data.phone || !data.paymentMethod || !data.paymentDetails) {
      return NextResponse.json(
        { error: 'Missing required fields: businessName, email, phone, paymentMethod, paymentDetails' },
        { status: 400 }
      );
    }

    const affiliate = registerAffiliate(userId, data);

    return NextResponse.json(affiliate, { status: 201 });
  } catch (error) {
    console.error('Error registering affiliate:', error);
    return NextResponse.json(
      { error: 'Failed to register affiliate' },
      { status: 500 }
    );
  }
}
