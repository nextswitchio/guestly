import { NextRequest, NextResponse } from 'next/server';
import { fetchBackendJson } from '@/lib/api/proxy';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = searchParams.get('page') || '1';
    const page_size = searchParams.get('page_size') || '20';
    
    const { data, status, ok } = await fetchBackendJson(
      req,
      `/api/v1/api-access/keys?page=${page}&page_size=${page_size}`
    );
    if (!ok) return NextResponse.json(data, { status });
    return NextResponse.json(data, { status });
  } catch (error) {
    console.error('Error fetching keys:', error);
    return NextResponse.json({ error: 'Failed to fetch keys' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { data, status, ok } = await fetchBackendJson(
      req,
      '/api/v1/api-access/keys',
      {
        method: 'POST',
        body: JSON.stringify(body),
      }
    );
    if (!ok) return NextResponse.json(data, { status });
    return NextResponse.json(data, { status });
  } catch (error) {
    console.error('Error creating key:', error);
    return NextResponse.json({ error: 'Failed to create key' }, { status: 500 });
  }
}