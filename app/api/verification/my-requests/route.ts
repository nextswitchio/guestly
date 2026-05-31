import { NextRequest, NextResponse } from 'next/server';
import { BACKEND_URL } from '@/lib/api/client';

// GET /api/verification/my-requests
// Maps to backend: GET /api/v1/verification/my-requests

export async function GET(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;

  if (!token) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const endpoint = `${BACKEND_URL}/api/v1/verification/my-requests`;
    
    const response = await fetch(endpoint, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || errorData.error || 'Failed to fetch verification requests');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching my verification requests:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch verification requests' },
      { status: 500 }
    );
  }
}
