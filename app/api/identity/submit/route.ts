import { NextRequest, NextResponse } from 'next/server';
import { submitIdentityVerification } from '@/lib/marketing';

export async function POST(req: NextRequest) {
  try {
    const userId = req.cookies.get('user_id')?.value;
    const role = req.cookies.get('user_role')?.value;

    if (!userId || !role) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!['organiser', 'vendor', 'affiliate'].includes(role)) {
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

    if (!docType || !docNumber || !legalFirstName || !legalLastName || !dateOfBirth || !documentFrontUrl) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const verification = submitIdentityVerification(userId, role as any, {
      docType,
      docNumber,
      legalFirstName,
      legalLastName,
      dateOfBirth,
      nationality,
      documentFrontUrl,
      documentBackUrl,
      selfieUrl,
    });

    return NextResponse.json({
      success: true,
      verification: {
        id: verification.id,
        status: verification.status,
        submittedAt: verification.submittedAt,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to submit verification' }, { status: 400 });
  }
}
