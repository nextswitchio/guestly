import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const userId = req.cookies.get('user_id')?.value;
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Return default settings for now - would fetch from DB in production
    return NextResponse.json({
      settings: {
        businessName: 'My Affiliate Business',
        email: 'affiliate@example.com',
        phone: '+234 800 000 0000',
        website: '',
        promotionalChannels: ['Instagram', 'Twitter', 'WhatsApp'],
        paymentMethod: 'bank' as const,
        paymentDetails: {
          bankName: '',
          accountName: '',
          accountNumber: '',
        },
        emailNotifications: true,
        payoutNotifications: true,
        collaborationNotifications: true,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const userId = req.cookies.get('user_id')?.value;
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    // Would save to DB in production

    return NextResponse.json({ success: true, settings: body });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}
