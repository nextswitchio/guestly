import { NextRequest, NextResponse } from 'next/server';
import { BACKEND_URL } from '@/lib/api/client';

function getAuthHeaders(req: NextRequest): Record<string, string> {
  const token = req.cookies.get('access_token')?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function GET(req: NextRequest) {
  const token = req.cookies.get('access_token')?.value;
  
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = req.nextUrl;
    const period = searchParams.get('period') || '24h';
    
    const res = await fetch(`${BACKEND_URL}/api/v1/monitoring/report?period=${period}`, {
      headers: getAuthHeaders(req),
      credentials: 'include',
      cache: 'no-store',
    });
    
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error('Error generating monitoring report:', error);
    return NextResponse.json(
      { error: 'Failed to generate monitoring report' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get('access_token')?.value;
  
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = req.nextUrl;
    const period = searchParams.get('period') || '24h';
    const { recipient } = await req.json();
    
    const res = await fetch(`${BACKEND_URL}/api/v1/monitoring/report/email?period=${period}&recipient=${recipient}`, {
      method: 'POST',
      headers: getAuthHeaders(req),
      credentials: 'include',
    });
    
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error('Error emailing monitoring report:', error);
    return NextResponse.json(
      { error: 'Failed to email monitoring report' },
      { status: 500 }
    );
  }
}
