import { NextRequest, NextResponse } from 'next/server';
import { BACKEND_URL } from '@/lib/api/client';

type SenderRole = 'organizer' | 'influencer';

function getAuthHeaders(req: NextRequest): Record<string, string> {
  const token = req.cookies.get('access_token')?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function normalizeStatus(status: string) {
  return status === 'invited' ? 'pending' : status === 'declined' ? 'rejected' : status;
}

function normalizeMessage(raw: any, currentUserId: string | undefined, currentUserRole: SenderRole) {
  const senderRole: SenderRole = raw.sender_id === currentUserId ? currentUserRole : currentUserRole === 'organizer' ? 'influencer' : 'organizer';
  return {
    id: raw.id,
    collaborationId: raw.collaboration_id,
    senderId: raw.sender_id,
    senderRole,
    content: raw.content,
    attachments: raw.attachments,
    read: Array.isArray(raw.read_by) ? raw.read_by.includes(currentUserId) : false,
    readAt: Array.isArray(raw.read_by) && raw.read_by.includes(currentUserId) ? new Date(raw.created_at).getTime() : undefined,
    createdAt: new Date(raw.created_at).getTime(),
  };
}

function readUserRole(req: NextRequest): SenderRole {
  const role = req.cookies.get('user_role')?.value || req.cookies.get('role')?.value || '';
  return role === 'ORGANISER' ? 'organizer' : 'influencer';
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUserId = req.cookies.get('user_id')?.value;
    const currentUserRole = readUserRole(req);
    const { id: collaborationId } = await params;

    const res = await fetch(`${BACKEND_URL}/api/v1/influencers/collaborations/${collaborationId}/messages`, {
      method: 'GET',
      headers: getAuthHeaders(req),
      credentials: 'include',
    });

    const raw = await res.json().catch(() => ([]));
    const rawMessages = Array.isArray(raw) ? raw : raw.messages || [];
    const messages = rawMessages.map((item: any) => normalizeMessage(item, currentUserId, currentUserRole));

    return NextResponse.json({ messages, unreadCount: 0, total: messages.length }, { status: res.status });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUserId = req.cookies.get('user_id')?.value;
    const currentUserRole = readUserRole(req);
    const { id: collaborationId } = await params;
    const body = await req.json();

    const res = await fetch(`${BACKEND_URL}/api/v1/influencers/collaborations/${collaborationId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(req),
      },
      body: JSON.stringify(body),
      credentials: 'include',
    });

    const raw = await res.json().catch(() => ({}));
    if (!res.ok) {
      return NextResponse.json(raw, { status: res.status });
    }

    const message = normalizeMessage(raw, currentUserId, currentUserRole);
    return NextResponse.json({ message }, { status: res.status });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
