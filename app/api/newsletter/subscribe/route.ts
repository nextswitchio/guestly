import { NextRequest, NextResponse } from 'next/server';
import { subscribeToNewsletter } from '@/lib/marketing';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
    }

    const result = subscribeToNewsletter(email);
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
  }
}
