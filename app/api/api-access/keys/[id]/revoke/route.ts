import { NextRequest, NextResponse } from 'next/server';
import { fetchBackendJson } from '@/lib/api/proxy';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const { data, status, ok } = await fetchBackendJson(
      req,
      `/api/v1/api-access/keys/${id}/revoke`,
      {
        method: 'PATCH',
        body: JSON.stringify(body),
      }
    );
    if (!ok) return NextResponse.json(data, { status });
    return NextResponse.json(data, { status });
  } catch (error) {
    console.error('Error revoking key:', error);
    return NextResponse.json({ error: 'Failed to revoke key' }, { status: 500 });
  }
}