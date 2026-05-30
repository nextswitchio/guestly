import { NextResponse } from 'next/server';
import { getAuthHeaders } from '@/lib/api/client';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userId } = await params;
    
    const headers = await getAuthHeaders();
    const res = await fetch(
      `${BACKEND_URL}/api/v1/admin/users/${userId}/generate-virtual-account`,
      {
        method: 'POST',
        headers,
      }
    );

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { success: false, error: data.detail || 'Failed to generate virtual account' },
        { status: res.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
