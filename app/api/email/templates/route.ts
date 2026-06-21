import { NextRequest, NextResponse } from 'next/server';
import {
  createEmailTemplate,
  listEmailTemplates,
} from '@/lib/marketing';

// POST /api/email/templates - Create email template
export async function POST(req: NextRequest) {
  try {
    const organizerId = req.cookies.get('user_id')?.value;
    const role = req.cookies.get('role')?.value;

    if (!organizerId || role !== 'organiser') {
      return NextResponse.json(
        { error: 'Unauthorized. Organiser access required.' },
        { status: 401 }
      );
    }

    const data = await req.json();

    // Validate required fields
    if (!data.name || !data.subject || !data.htmlContent) {
      return NextResponse.json(
        { error: 'Missing required fields: name, subject, htmlContent' },
        { status: 400 }
      );
    }

    const template = createEmailTemplate(organizerId, data);

    return NextResponse.json(template, { status: 201 });
  } catch (error) {
    console.error('Error creating email template:', error);
    return NextResponse.json(
      { error: 'Failed to create email template' },
      { status: 500 }
    );
  }
}

// GET /api/email/templates - List email templates
export async function GET(req: NextRequest) {
  try {
    const organizerId = req.cookies.get('user_id')?.value;
    const role = req.cookies.get('role')?.value;

    if (!organizerId || role !== 'organiser') {
      return NextResponse.json(
        { error: 'Unauthorized. Organiser access required.' },
        { status: 401 }
      );
    }

    const templates = listEmailTemplates(organizerId);

    return NextResponse.json({ templates }, { status: 200 });
  } catch (error) {
    console.error('Error listing email templates:', error);
    return NextResponse.json(
      { error: 'Failed to list email templates' },
      { status: 500 }
    );
  }
}
