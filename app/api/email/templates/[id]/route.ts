import { NextRequest, NextResponse } from 'next/server';
import { getEmailTemplate } from '@/lib/marketing';

// GET /api/email/templates/[id] - Get email template details
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const organizerId = req.cookies.get('user_id')?.value;
    const role = req.cookies.get('role')?.value;

    if (!organizerId || role !== 'organiser') {
      return NextResponse.json(
        { error: 'Unauthorized. Organiser access required.' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const template = getEmailTemplate(id);

    if (!template) {
      return NextResponse.json(
        { error: 'Email template not found' },
        { status: 404 }
      );
    }

    // Verify ownership
    if (template.organizerId !== organizerId) {
      return NextResponse.json(
        { error: 'Forbidden. You do not own this template.' },
        { status: 403 }
      );
    }

    return NextResponse.json(template, { status: 200 });
  } catch (error) {
    console.error('Error fetching email template:', error);
    return NextResponse.json(
      { error: 'Failed to fetch email template' },
      { status: 500 }
    );
  }
}
