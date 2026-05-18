import { NextRequest, NextResponse } from 'next/server';
import { updateVerificationStatus, listIdentityVerifications } from '@/lib/marketing';

export async function POST(req: NextRequest) {
  try {
    const userId = req.cookies.get('user_id')?.value;
    const role = req.cookies.get('user_role')?.value;

    if (!userId || role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const body = await req.json();
    const { documentId, status, rejectionReason } = body;

    if (!documentId || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const updated = updateVerificationStatus(documentId, status, rejectionReason, userId);

    if (!updated) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, verification: updated });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update verification' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const userId = req.cookies.get('user_id')?.value;
    const role = req.cookies.get('user_role')?.value;

    if (!userId || role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const filterRole = searchParams.get('role') as any;
    const filterStatus = searchParams.get('status') as any;

    const verifications = listIdentityVerifications({
      role: filterRole || undefined,
      status: filterStatus || undefined,
    });

    return NextResponse.json({ verifications });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch verifications' }, { status: 500 });
  }
}
