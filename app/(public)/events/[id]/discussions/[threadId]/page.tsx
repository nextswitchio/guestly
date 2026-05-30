'use client';
import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Heart, MessageCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { useToast } from '@/components/ui/ToastProvider';

interface Reply {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  likes: number;
  createdAt: number;
}

interface Thread {
  id: string;
  eventId: string;
  authorId: string;
  authorName: string;
  title: string;
  content: string;
  likes: number;
  replyCount: number;
  isPinned: boolean;
  createdAt: number;
  updatedAt: number;
}

function getInitial(name: string | undefined | null): string {
  if (name && typeof name === 'string' && name.length > 0) {
    return name[0].toUpperCase();
  }
  return 'A';
}

function formatDate(date: number | string | undefined | null): string {
  if (date == null) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleString();
}

export default function DiscussionThreadPage({
  params,
}: {
  params: Promise<{ id: string; threadId: string }>;
}) {
  const { id, threadId } = use(params);
  const router = useRouter();
  const { addToast } = useToast();
  const [thread, setThread] = useState<Thread | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [loading, setLoading] = useState(true);
  const [liking, setLiking] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    const cookies = document.cookie.split(';');
    const hasAuth = cookies.some((c) => c.trim().startsWith('user_id=') || c.trim().startsWith('access_token='));
    if (!hasAuth) {
      router.push('/login');
      return;
    }
    fetchThread();
  }, [threadId]);

  const fetchThread = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/events/${id}/discussions/${threadId}`);
      if (res.ok) {
        const data = await res.json();
        setThread(data.data.thread);
        setReplies(data.data.replies || []);
      }
    } catch (err) {
      console.error('Failed to fetch thread:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (liking) return;
    setLiking(true);
    try {
      const res = await fetch(`/api/events/${id}/discussions/${threadId}/like`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        if (data.data) setThread((prev) => prev ? { ...prev, likes: data.data.likes } : prev);
      }
    } catch (err) {
      console.error('Failed to like:', err);
    } finally {
      setLiking(false);
    }
  };

  const handlePostReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    setPosting(true);
    try {
      const res = await fetch(`/api/events/${id}/discussions/${threadId}/replies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: replyText.trim() }),
      });
      if (res.ok) {
        setReplyText('');
        addToast('Reply posted!', { type: 'success' });
        fetchThread();
      } else {
        const data = await res.json().catch(() => ({}));
        addToast(data?.error || 'Failed to post reply', { type: 'error' });
      }
    } catch {
      addToast('Network error', { type: 'error' });
    } finally {
      setPosting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!thread) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Discussion not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <Button variant="outline" onClick={() => router.push(`/events/${id}/community`)} className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Community
        </Button>

        <Card className="p-6">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="w-10 h-10 rounded-full bg-lime/20 flex items-center justify-center text-dark font-semibold shrink-0">
              {getInitial(thread.authorName)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold">{thread.authorName || 'Anonymous'}</span>
                <span className="text-sm text-gray-500">{formatDate(thread.createdAt)}</span>
              </div>
              <h2 className="text-xl font-bold mb-2">{thread.title}</h2>
              <p className="text-gray-900 dark:text-white whitespace-pre-wrap">{thread.content}</p>
              <div className="flex items-center gap-4 mt-4 text-sm text-gray-600">
                <button onClick={handleLike} disabled={liking} className="flex items-center gap-1 hover:text-red-500 transition-colors">
                  <Heart className={`w-4 h-4 ${liking ? 'opacity-50' : ''}`} />
                  {thread.likes} {thread.likes === 1 ? 'like' : 'likes'}
                </button>
                <span className="flex items-center gap-1">
                  <MessageCircle className="w-4 h-4" />
                  {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
                </span>
              </div>
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Replies ({replies.length})</h3>
          {replies.length === 0 ? (
            <Card className="p-6 text-center text-gray-500">
              No replies yet. Be the first to respond!
            </Card>
          ) : (
            replies.map((reply) => (
              <Card key={reply.id} className="p-4 sm:p-6">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-sm font-semibold shrink-0">
                    {getInitial(reply.authorName)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm">{reply.authorName || 'Anonymous'}</span>
                      <span className="text-xs text-gray-500">{formatDate(reply.createdAt)}</span>
                    </div>
                    <p className="text-gray-900 dark:text-white whitespace-pre-wrap">{reply.content}</p>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Post a Reply</h3>
          <form onSubmit={handlePostReply} className="space-y-4">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write your reply..."
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white min-h-[100px]"
              required
            />
            <Button type="submit" loading={posting} disabled={posting}>
              {posting ? 'Posting...' : 'Post Reply'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
