import { NextRequest, NextResponse } from 'next/server';
import { fetchBackendJson } from '@/lib/api/proxy';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { data, status, ok } = await fetchBackendJson(
      req,
      '/api/v1/api-access/billing/subscriptions',
      {
        method: 'POST',
        body: JSON.stringify(body),
      }
    );
    if (!ok) return NextResponse.json(data, { status });
    return NextResponse.json(data, { status });
  } catch (error) {
    console.error('Error subscribing:', error);
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
  }
}