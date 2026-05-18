import { NextRequest, NextResponse } from 'next/server';
import { postToSocial } from '@/lib/marketing';

export async function POST(req: NextRequest) {
  try {
    const userId = req.cookies.get('user_id')?.value;
    const role = req.cookies.get('role')?.value;

    if (!userId || role !== 'organiser') {
      return NextResponse.json(
        { error: 'Unauthorized - Organiser access required' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { platform, content } = body;

    if (!platform || !content) {
      return NextResponse.json(
        { error: 'Platform and content are required' },
        { status: 400 }
      );
    }

    const result = await postToSocial(userId, platform, content);

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error('Error posting to social media:', error);
    return NextResponse.json(
      { error: 'Failed to post to social media' },
      { status: 500 }
    );
  }
}
