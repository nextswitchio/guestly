import { NextRequest, NextResponse } from 'next/server';
import { fetchBackendJson } from '@/lib/api/proxy';

type IdentityDocType = 'passport' | 'drivers_license' | 'national_id' | 'voters_card' | 'residence_permit';
type UserRole = 'organiser' | 'vendor' | 'affiliate';

function isUserRole(role: string | undefined): role is UserRole {
  return role === 'organiser' || role === 'vendor' || role === 'affiliate';
}

function isIdentityDocType(docType: unknown): docType is IdentityDocType {
  return docType === 'passport' || docType === 'drivers_license' || docType === 'national_id' || docType === 'voters_card' || docType === 'residence_permit';
}

export async function POST(req: NextRequest) {
  try {
    const role = req.cookies.get('user_role')?.value || req.cookies.get('role')?.value;

    if (!role) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!isUserRole(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 403 });
    }

    const body = await req.json();
    const {
      docType,
      docNumber,
      legalFirstName,
      legalLastName,
      dateOfBirth,
      nationality,
      documentFrontUrl,
      documentBackUrl,
      selfieUrl,
    } = body;

    if (!isIdentityDocType(docType) || !docNumber || !legalFirstName || !legalLastName || !dateOfBirth || !documentFrontUrl) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data, status, ok } = await fetchBackendJson(req, '/api/v1/community/identity', {
      method: 'POST',
      body: JSON.stringify({
        role,
        doc_type: docType,
        doc_number: docNumber,
        legal_first_name: legalFirstName,
        legal_last_name: legalLastName,
        date_of_birth: dateOfBirth,
        nationality,
        document_front_url: documentFrontUrl,
        document_back_url: documentBackUrl,
        selfie_url: selfieUrl,
      }),
    });

    if (!ok) return NextResponse.json(data, { status });

    return NextResponse.json({
      success: true,
      verification: {
        id: data.id,
        status: data.status,
        submittedAt: data.submitted_at ? Date.parse(data.submitted_at) : undefined,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to submit verification' }, { status: 400 });
  }
}
