import { NextRequest, NextResponse } from 'next/server';
import { listAffiliates } from '@/lib/marketing';

export async function GET(req: NextRequest) {
  try {
    const role = req.cookies.get('role')?.value;

    // Only platform admins can list all affiliates
    if (role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden. Admin access required.' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || undefined;

    const affiliates = listAffiliates({
      status: status as any,
    });

    return NextResponse.json(affiliates);
  } catch (error) {
    console.error('Error listing affiliates:', error);
    return NextResponse.json(
      { error: 'Failed to list affiliates' },
      { status: 500 }
    );
  }
}
