import { NextRequest, NextResponse } from 'next/server';
import { fetchBackendJson } from '@/lib/api/proxy';

type UserRole = 'organiser' | 'vendor' | 'affiliate';

function isUserRole(role: string | undefined): role is UserRole {
  return role === 'organiser' || role === 'vendor' || role === 'affiliate';
}

function toClientVerification(doc: any) {
  if (!doc) return null;
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

export async function GET(req: NextRequest) {
  try {
    const role = req.cookies.get('user_role')?.value || req.cookies.get('role')?.value;

    if (!role) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!isUserRole(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 403 });
    }

    const { data, status, ok } = await fetchBackendJson(
      req,
      `/api/v1/community/identity?role=${encodeURIComponent(role)}`,
    );
    if (!ok) return NextResponse.json(data, { status });

    const verification = toClientVerification(data);

    return NextResponse.json({
      verification,
      isVerified: verification?.status === 'verified',
      isPending: verification?.status === 'pending' || verification?.status === 'under_review',
    });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch verification status' }, { status: 500 });
  }
}
