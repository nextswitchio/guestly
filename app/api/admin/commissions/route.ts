import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('access_token')?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const status = searchParams.get('status');

    if (action === 'summary') {
      const res = await fetch(`${BACKEND_URL}/api/v1/admin/commissions/summary`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      return NextResponse.json({ success: true, data });
    }

    if (action === 'trends') {
      const months = searchParams.get('months') || '6';
      const res = await fetch(`${BACKEND_URL}/api/v1/admin/commissions/trends?months=${months}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      return NextResponse.json({ success: true, data });
    }

    const params = new URLSearchParams();
    if (status) params.set('status_filter', status);

    const res = await fetch(`${BACKEND_URL}/api/v1/admin/commissions?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const commissions = await res.json();
    return NextResponse.json({ success: true, data: { commissions, total: commissions.length } });
  } catch (error) {
    console.error('Error fetching commissions:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch commissions' } },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('access_token')?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { action, commissionId, ...data } = body;

    if (action === 'settle' && commissionId) {
      const res = await fetch(`${BACKEND_URL}/api/v1/admin/commissions/${commissionId}/settle`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      const result = await res.json();
      return NextResponse.json({ success: true, data: result });
    }

    if (action === 'generate_report') {
      const res = await fetch(`${BACKEND_URL}/api/v1/admin/commissions/report`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      return NextResponse.json({ success: true, data: result });
    }

    return NextResponse.json(
      { success: false, error: { code: 'INVALID_ACTION', message: 'Invalid action' } },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error processing commission request:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to process request' } },
      { status: 500 }
    );
  }
}
