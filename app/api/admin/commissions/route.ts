import { NextRequest, NextResponse } from 'next/server';
import { BACKEND_URL } from "@/lib/api/client";

function authHeaders(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function requireAdmin(request: NextRequest) {
  return request.cookies.get("role")?.value === "admin" && request.cookies.get("access_token")?.value;
}

async function proxyToBackend(request: NextRequest, path: string, init?: RequestInit) {
  const res = await fetch(`${BACKEND_URL}${path}`, {
    headers: authHeaders(request),
    ...init,
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function GET(request: NextRequest) {
  if (!requireAdmin(request)) {
    return NextResponse.json(
      { success: false, error: { code: 'UNAUTHORIZED', message: 'Admin access required' } },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  const status = searchParams.get('status');

  try {
    if (action === 'summary') {
      return await proxyToBackend(request, '/api/v1/admin/commissions/summary');
    }

    if (action === 'trends') {
      const months = searchParams.get('months') || '6';
      return await proxyToBackend(request, `/api/v1/admin/commissions/trends?months=${months}`);
    }

    const params = new URLSearchParams();
    if (status) params.set('status_filter', status);

    const qs = params.size ? `?${params}` : '';
    return await proxyToBackend(request, `/api/v1/admin/commissions${qs}`);
  } catch (error) {
    console.error('Error fetching commissions:', error);
    return NextResponse.json(
      { success: false, error: { code: 'BACKEND_ERROR', message: 'Backend unavailable' } },
      { status: 502 }
    );
  }
}

export async function POST(request: NextRequest) {
  if (!requireAdmin(request)) {
    return NextResponse.json(
      { success: false, error: { code: 'UNAUTHORIZED', message: 'Admin access required' } },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { action, commissionId, ...data } = body;

    if (action === 'settle' && commissionId) {
      return await proxyToBackend(request, `/api/v1/admin/commissions/${commissionId}/settle`, {
        method: 'POST',
        headers: authHeaders(request),
      });
    }

    if (action === 'generate_report') {
      return await proxyToBackend(request, '/api/v1/admin/commissions/report', {
        method: 'POST',
        headers: authHeaders(request),
        body: JSON.stringify(data),
      });
    }

    return NextResponse.json(
      { success: false, error: { code: 'INVALID_ACTION', message: 'Invalid action' } },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error processing commission request:', error);
    return NextResponse.json(
      { success: false, error: { code: 'BACKEND_ERROR', message: 'Failed to process request' } },
      { status: 502 }
    );
  }
}
