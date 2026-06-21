import { NextRequest, NextResponse } from 'next/server';
import { fetchBackendJson } from '@/lib/api/proxy';

type UserRole = 'organiser' | 'vendor' | 'affiliate';
type VerificationStatus = 'pending' | 'under_review' | 'verified' | 'rejected';

function isUserRole(role: string | null): role is UserRole {
  return role === 'organiser' || role === 'vendor' || role === 'affiliate';
}

function isVerificationStatus(status: unknown): status is VerificationStatus {
  return status === 'pending' || status === 'under_review' || status === 'verified' || status === 'rejected';
}

function toClientVerification(doc: any) {
  return {
    id: doc.id,
    userId: doc.user_id,
    role: doc.role,
    docType: doc.doc_type,
    docNumber: doc.doc_number,
    legalFirstName: doc.legal_first_name,
    legalLastName: doc.legal_last_name,
    dateOfBirth: doc.date_of_birth,
    nationality: doc.nationality,
    documentFrontUrl: doc.document_front_url,
    documentBackUrl: doc.document_back_url,
    selfieUrl: doc.selfie_url,
    status: doc.status,
    rejectionReason: doc.rejection_reason,
    submittedAt: doc.submitted_at ? Date.parse(doc.submitted_at) : undefined,
    reviewedAt: doc.reviewed_at ? Date.parse(doc.reviewed_at) : undefined,
    reviewedBy: doc.reviewed_by,
  };
}

export async function POST(req: NextRequest) {
  try {
    const role = req.cookies.get('user_role')?.value || req.cookies.get('role')?.value;

    if (role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const body = await req.json();
    const { documentId, status, rejectionReason } = body;

    if (!documentId || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!isVerificationStatus(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const result = await fetchBackendJson(req, `/api/v1/community/identity/review/${documentId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status, rejection_reason: rejectionReason }),
    });

    if (!result.ok) return NextResponse.json(result.data, { status: result.status });
    return NextResponse.json({ success: true, verification: toClientVerification(result.data) });
  } catch {
    return NextResponse.json({ error: 'Failed to update verification' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const role = req.cookies.get('user_role')?.value || req.cookies.get('role')?.value;

    if (role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const roleParam = searchParams.get('role');
    const statusParam = searchParams.get('status');

    const params = new URLSearchParams();
    if (isUserRole(roleParam)) params.set('role', roleParam);
    if (isVerificationStatus(statusParam)) params.set('status', statusParam);
    const result = await fetchBackendJson(req, `/api/v1/community/identity/review${params.size ? `?${params}` : ''}`);

    if (!result.ok) return NextResponse.json(result.data, { status: result.status });
    const verifications = (result.data || []).map(toClientVerification);

    return NextResponse.json({ verifications });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch verifications' }, { status: 500 });
  }
}
