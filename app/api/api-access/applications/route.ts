import { NextRequest, NextResponse } from 'next/server';
import { fetchBackendJson } from '@/lib/api/proxy';

export async function GET(req: NextRequest) {
  try {
    const { data, status, ok } = await fetchBackendJson(req, '/api/v1/api-access/applications');
    if (!ok) return NextResponse.json(data, { status });
    return NextResponse.json(data, { status });
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { data, status, ok } = await fetchBackendJson(
      req,
      '/api/v1/api-access/applications',
      {
        method: 'POST',
        body: JSON.stringify(body),
      }
    );
    if (!ok) return NextResponse.json(data, { status });
    return NextResponse.json(data, { status });
  } catch (error) {
    console.error('Error creating application:', error);
    return NextResponse.json({ error: 'Failed to create application' }, { status: 500 });
  }
}