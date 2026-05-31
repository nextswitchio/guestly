import { NextRequest, NextResponse } from 'next/server';
import { BACKEND_URL } from '@/lib/api/client';

// POST /api/verification/requests/{request_id}/submit
// Maps to backend: POST /api/v1/verification/requests/{request_id}/submit

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ request_id: string }> }
) {
  const { request_id } = await params;
  const token = request.cookies.get("access_token")?.value;

  if (!token) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const endpoint = `${BACKEND_URL}/api/v1/verification/requests/${request_id}/submit`;
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || errorData.error || 'Failed to submit verification request');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error submitting verification request:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to submit verification request' },
      { status: 500 }
    );
  }
}
